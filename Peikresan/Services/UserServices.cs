using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Peikresan.Data;
using Peikresan.Data.Dto;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class UserServices
    {
        public static async Task<List<UserDto>> GetAllUsers(ApplicationDbContext context)
            => await context.Users
                .Include(u => u.Role)
                .Select(user => user.ToDto())
                .AsNoTracking()
                .ToListAsync();

        public static async Task<User> ClosestUser(ApplicationDbContext context, double latitude, double longitude, string role)
        {
            return await context.Users
                .Include(u => u.Role).Where(u => u.Active && u.Role.Name == role)
                .OrderBy(u =>
                    Math.Sqrt(Math.Pow(latitude - u.Latitude, 2) +
                              Math.Pow(longitude - u.Longitude, 2)))
                .AsNoTracking()
                .FirstAsync();
        }

        public static async Task<List<User>> NearUsers(ApplicationDbContext context, double latitude, double longitude, string role, int count)
        {
            // TODO: open time for seller
            return await context.Users
                .Include(u => u.Role)
                .Where(u => u.Active && u.Role.Name == role)
                .OrderBy(u => Math.Sqrt(Math.Pow(latitude - u.Latitude, 2) + Math.Pow(longitude - u.Longitude, 2)))
                .AsNoTracking()
                .Take(count)
                .ToListAsync();
        }

        public static async Task<List<Guid>> NearUsersId(ApplicationDbContext context, double latitude, double longitude, string role, int count)
        {
            return await context.Users
                .Include(u => u.Role)
                .Where(u => u.Active && u.Role.Name == role)
                .OrderBy(u => Math.Sqrt(Math.Pow(latitude - u.Latitude, 2) + Math.Pow(longitude - u.Longitude, 2)))
                .Select(u => u.Id)
                .Take(count)
                .ToListAsync();
        }

        public static async Task<int> CountOpenUser(ApplicationDbContext context, List<Guid> sellersIdList,
            DateTime dateTime)
        {
            var dateTimeNumeric = dateTime.Hour + (dateTime.Minute / 60.0);
            return await context.Users
                .Where(u => sellersIdList.Contains(u.Id))
                .CountAsync(user => user.OpenTime == null || user.CloseTime == null ||
                                    (dateTimeNumeric > user.OpenTime && dateTimeNumeric < user.CloseTime &&
                                     (user.OpenTime2 == null || user.CloseTime2 == null || (dateTimeNumeric > user.OpenTime2 &&
                                         dateTimeNumeric < user.CloseTime2))));
        }

        public static async Task<int> CountOpenUserNow(ApplicationDbContext context, List<Guid> sellersIdList)
        {
            var nowDateTime = DateTime.Now;
            return await CountOpenUser(context, sellersIdList, DateTime.Now);
        }

        public static async Task<List<SubOrder>> FindSeller(ApplicationDbContext context, int orderId)
        {
            var order = await context.Orders.FindAsync(orderId);

            var sellerIds = await NearUsersId(context, order.Latitude, order.Longitude, "Seller", 3);

            var orderItems = await context.OrderItems.Where(oi => oi.OrderId == order.Id).ToListAsync();
            var orderProductsId = orderItems.Select(oi => oi.ProductId).ToList();

            // all seller-products have every price
            var sellersProducts = await context.SellerProducts.Where(sp =>
                sellerIds.Contains((Guid)sp.UserId) && orderProductsId.Contains((int)sp.ProductId)).ToListAsync();

            // only with correct price
            var sellerProducts = (from sellerProduct in sellersProducts from orderItem in orderItems where sellerProduct.ProductId == orderItem.ProductId && sellerProduct.Price == orderItem.Price select sellerProduct).ToList();
            //var sellerProducts = new List<SellerProduct>();
            //foreach (var orderItem in orderItems)
            //{
            //    foreach (var sellersProduct in sellersProducts)
            //    {
            //        if (orderItem.ProductId == sellersProduct.ProductId)
            //        {
            //            if (orderItem.Price == sellersProduct.Price)
            //            {
            //                sellerProducts.Add(sellersProduct);
            //            }
            //        }
            //    }
            //}

            var sellerGroup = sellerProducts.GroupBy(sp => sp.UserId)
                .Select(id => new { id = id.Key, count = id.Count() })
                .OrderByDescending(el => el.count)
                .ToList();

            // 1 Seller
            var oneSellers = sellerGroup.Where(sg => sg.count == orderItems.Count).ToList();
            if (oneSellers.Any())
            {
                Guid sellerId;

                if (oneSellers.Count == 1)
                {
                    sellerId = (Guid)oneSellers.First()?.id;
                }
                else // oneSellers.Count > 1
                {
                    var oneSellersIds = oneSellers.Select(s => s.id).ToList();
                    var user = context.Users.Where(u => oneSellersIds.Contains(u.Id)).OrderBy(u =>
                        Math.Sqrt(Math.Pow(order.Latitude - u.Latitude, 2) +
                                  Math.Pow(order.Longitude - u.Longitude, 2))).First();
                    sellerId = user.Id;
                }

                var subOrder = new SubOrder() { OrderId = order.Id, SellerId = sellerId };
                await context.SubOrders.AddAsync(subOrder);
                await context.SaveChangesAsync();

                var subOrderItems = orderItems.Select(orderItem => new SubOrderItem()
                {
                    Count = orderItem.Count,
                    Price = orderItem.Price,
                    ProductId = orderItem.ProductId,
                    SubOrderId = subOrder.Id,
                    Title = orderItem.Title
                }).ToList();

                await context.SubOrderItems.AddRangeAsync(subOrderItems);
                await context.SaveChangesAsync();
                return new List<SubOrder>() { subOrder };
            }

            // 2 Seller
            var firstSeller = sellerGroup.First();
            var firstSellerItemIds = sellerProducts
                .Where(sp => sp.UserId == firstSeller.id)
                .Select(sp => sp.ProductId)
                .ToList();
            var remainItems = sellerProducts
                .Where(sp => !firstSellerItemIds.Contains(sp.ProductId))
                .ToList();

            sellerGroup = remainItems
                .GroupBy(i => i.UserId)
                .Select(id => new { id = id.Key, count = id.Count() })
                .OrderByDescending(el => el.count)
                .ToList();

            var remainItemCount = orderItems.Count - firstSeller.count;
            var secondSellers = sellerGroup.Where(sg => sg.count == remainItemCount).ToList();
            if (secondSellers.Any())
            {
                // save first
                var subOrder = new SubOrder() { OrderId = order.Id, SellerId = firstSeller.id };
                await context.SubOrders.AddAsync(subOrder);
                await context.SaveChangesAsync();

                var firstSubOrderItems = orderItems
                    .Where(oi => firstSellerItemIds.Contains(oi.ProductId))
                    .Select(orderItem => new SubOrderItem()
                    {
                        Count = orderItem.Count,
                        Price = orderItem.Price,
                        ProductId = orderItem.ProductId,
                        SubOrderId = subOrder.Id,
                        Title = orderItem.Title
                    })
                    .ToList();

                await context.SubOrderItems.AddRangeAsync(firstSubOrderItems);
                await context.SaveChangesAsync();

                Guid secondSellerId;
                if (secondSellers.Count == 1)
                {
                    secondSellerId = (Guid)secondSellers.First().id;
                }
                else
                {
                    var secondSellersIds = secondSellers.Select(s => s.id).ToList();
                    var user = context.Users.Where(u => secondSellersIds.Contains(u.Id)).OrderBy(u =>
                        Math.Sqrt(Math.Pow(order.Latitude - u.Latitude, 2) +
                                  Math.Pow(order.Longitude - u.Longitude, 2))).First();
                    secondSellerId = user.Id;
                }

                var secondSubOrder = new SubOrder() { OrderId = order.Id, SellerId = secondSellerId };
                await context.SubOrders.AddAsync(secondSubOrder);
                await context.SaveChangesAsync();

                var secondSubOrderItems = orderItems
                    .Where(oi => !firstSellerItemIds.Contains(oi.ProductId))
                    .Select(orderItem => new SubOrderItem()
                    {
                        Count = orderItem.Count,
                        Price = orderItem.Price,
                        ProductId = orderItem.ProductId,
                        SubOrderId = secondSubOrder.Id,
                        Title = orderItem.Title
                    })
                    .ToList();

                await context.SubOrderItems.AddRangeAsync(secondSubOrderItems);
                await context.SaveChangesAsync();
                return new List<SubOrder>()
                {
                    subOrder,
                    secondSubOrder
                };
            }
            else
            {
                //3 Seller
                var secondSeller = sellerGroup.First();
                var secondSellerIds = sellerProducts
                    .Where(sp => sp.UserId == secondSeller.id)
                    .Select(sp => sp.ProductId)
                    .ToList();
                remainItems = sellerProducts
                    .Where(sp => !firstSellerItemIds.Contains(sp.ProductId) && !secondSellerIds.Contains(sp.ProductId))
                    .ToList();

                // first seller
                var subOrder = new SubOrder() { OrderId = order.Id, SellerId = firstSeller.id };
                var secondSubOrder = new SubOrder() { OrderId = order.Id, SellerId = secondSeller.id };
                var thirdSubOrder = new SubOrder() { OrderId = order.Id, SellerId = remainItems.First().UserId };
                await context.SubOrders.AddRangeAsync(new List<SubOrder>() { subOrder, secondSubOrder, thirdSubOrder });
                await context.SaveChangesAsync();

                var firstSubOrderItems = orderItems
                    .Where(oi => firstSellerItemIds.Contains(oi.ProductId))
                    .Select(orderItem => new SubOrderItem()
                    {
                        Count = orderItem.Count,
                        Price = orderItem.Price,
                        ProductId = orderItem.ProductId,
                        SubOrderId = subOrder.Id,
                        Title = orderItem.Title
                    })
                    .ToList();

                var secondSubOrderItems = orderItems
                    .Where(oi => !firstSellerItemIds.Contains(oi.ProductId) && secondSellerIds.Contains(oi.ProductId))
                    .Select(orderItem => new SubOrderItem()
                    {
                        Count = orderItem.Count,
                        Price = orderItem.Price,
                        ProductId = orderItem.ProductId,
                        SubOrderId = secondSubOrder.Id,
                        Title = orderItem.Title
                    })
                    .ToList();

                var thirdSubOrderItems = orderItems
                    .Where(oi => !firstSellerItemIds.Contains(oi.ProductId) && secondSellerIds.Contains(oi.ProductId))
                    .Select(orderItem => new SubOrderItem()
                    {
                        Count = orderItem.Count,
                        Price = orderItem.Price,
                        ProductId = orderItem.ProductId,
                        SubOrderId = thirdSubOrder.Id,
                        Title = orderItem.Title
                    })
                    .ToList();

                firstSubOrderItems.AddRange(secondSubOrderItems);
                firstSubOrderItems.AddRange(thirdSubOrderItems);
                await context.SubOrderItems.AddRangeAsync(firstSubOrderItems);
                await context.SaveChangesAsync();
                return new List<SubOrder>()
                {
                    subOrder,
                    secondSubOrder,
                    thirdSubOrder
                };
            }
        }
    }
}
