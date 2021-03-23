using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Peikresan.Data;
using Peikresan.Data.ClientModels;
using Peikresan.Data.Models;
using Peikresan.Data.ViewModels;
using Peikresan.Services;

namespace Peikresan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ILogger<OrderController> _logger;
        private readonly ApplicationDbContext _context;

        public OrderController(ILogger<OrderController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        //[Authorize]
        //[HttpPost("choose-seller")]
        //public async Task<IActionResult> ChooseSellerAsync([FromBody] ChooseUser chooseUser)
        //{
        //    var thisUser = await _context.Users
        //        .Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

        //    if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
        //    {
        //        return Unauthorized("Only Admin Can Remove Category");
        //    }

        //    var seller = await _context.Users
        //        .Include(u => u.Role).FirstAsync(us => us.Id == Guid.Parse(chooseUser.userId));
        //    if (seller == null)
        //    {
        //        return BadRequest("Can not find user");
        //    }

        //    //if(seller.Role==null || seller.Role.Name.ToLower() != "seller")
        //    //{
        //    //    return BadRequest("user is not seller");
        //    //}

        //    var order = await _context.Orders
        //        .Where(ord => ord.Id == chooseUser.orderId).Include(o => o.OrderItems)
        //        .FirstOrDefaultAsync();

        //    if (order == null)
        //    {
        //        return BadRequest("Can not find order");
        //    }

        //    if (order.OrderStatus != OrderStatus.Verified && order.OrderStatus != OrderStatus.SellerDeny)
        //    {
        //        return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
        //    }

        //    // order.Seller = seller;
        //    order.OrderStatus = OrderStatus.AssignToSeller;
        //    order.AssignToSellerDateTime = DateTime.Now;

        //    try
        //    {
        //        _context.Orders.Update(order);
        //        await _context.SaveChangesAsync();

        //        return Ok(new
        //        {
        //            element= order,
        //            order,
        //            success = true,
        //            EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
        //            {
        //                WebsiteModel = WebsiteModel.Order,
        //                WebsiteEventType = WebsiteEventType.Update,
        //                ObjectId = order.Id,
        //                Description = "AssignToSeller " + seller.FullName,
        //                UserId = seller.Id.ToString()
        //            })
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest("error in save order " + e.Message);
        //    }
        //}

        //[Authorize]
        //[HttpPost("seller-answer")]
        //public async Task<IActionResult> AcceptSellerAsync([FromBody] AnswerModel answerModel)
        //{
        //    // var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
        //    //if (this_user.Role == null || this_user.Role.Name.ToLower() != "seller")
        //    //{
        //    //    return Unauthorized("Only Seller Can Remove Category");
        //    //}
        //    var order = await _context.Orders
        //        .Where(ord => ord.Id == answerModel.OrderId).Include(o => o.OrderItems)
        //        .FirstOrDefaultAsync();

        //    if (order == null)
        //    {
        //        return BadRequest("Can not find order");
        //    }

        //    if (order.OrderStatus != OrderStatus.AssignToSeller)
        //    {
        //        return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
        //    }

        //    if (answerModel.Answer)
        //    {
        //        order.OrderStatus = OrderStatus.SellerAccepted;
        //        order.SellerAcceptedDateTime = DateTime.Now;
        //    }
        //    else
        //    {
        //        order.OrderStatus = OrderStatus.SellerDeny;
        //    }

        //    try
        //    {
        //        _context.Orders.Update(order);
        //        await _context.SaveChangesAsync();
        //        return Ok(new
        //        {
        //            order,
        //            success = true,
        //            EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
        //            {
        //                WebsiteModel = WebsiteModel.Order,
        //                WebsiteEventType = WebsiteEventType.Update,
        //                ObjectId = order.Id,
        //                Description = "SellerDeny",
        //                UserId = ""
        //            })
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest("error in save order " + e.Message);
        //    }
        //}

        //[Authorize]
        //[HttpPost("choose-deliver")]
        //public async Task<IActionResult> ChooseDeliverAsync([FromBody] ChooseUser chooseUser)
        //{
        //    var thisUser = await _context.Users
        //        .Include(u => u.Role)
        //        .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

        //    if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
        //    {
        //        return Unauthorized("Only Admin Can Remove Category");
        //    }

        //    var deliver = await _context.Users
        //        .Include(u => u.Role).FirstAsync(us => us.Id == Guid.Parse(chooseUser.UserId));

        //    if (deliver == null)
        //    {
        //        return BadRequest("Can not find user");
        //    }

        //    //if(deliver.Role==null || deliver.Role.Name.ToLower() != "deliver")
        //    //{
        //    //    return BadRequest("user is not seller");
        //    //}
        //    var order = await _context.Orders
        //        .Where(ord => ord.Id == chooseUser.OrderId).Include(o => o.OrderItems)
        //        .FirstOrDefaultAsync();

        //    if (order == null)
        //    {
        //        return BadRequest("Can not find order");
        //    }

        //    if (order.OrderStatus != OrderStatus.SellerAccepted && order.OrderStatus != OrderStatus.DeliverDeny)
        //    {
        //        return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
        //    }

        //    order.Deliver = deliver;
        //    order.OrderStatus = OrderStatus.AssignToDeliver;
        //    order.AssignToDeliverDateTime = DateTime.Now;

        //    try
        //    {
        //        _context.Orders.Update(order);
        //        await _context.SaveChangesAsync();
        //        return Ok(new
        //        {
        //            order,
        //            success = true,
        //            EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
        //            {
        //                WebsiteModel = WebsiteModel.Order,
        //                WebsiteEventType = WebsiteEventType.Update,
        //                ObjectId = order.Id,
        //                Description = "AssignToDeliver " + deliver.FullName,
        //                UserId = deliver.Id.ToString()
        //            })
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest("error in save order " + e.Message);
        //    }
        //}

        //[Authorize]
        //[HttpPost("deliver-answer")]
        //public async Task<IActionResult> AcceptDeliverAsync([FromBody] AnswerModel answerModel)
        //{
        //    // var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
        //    //if (this_user.Role == null || this_user.Role.Name.ToLower() != "deliver")
        //    //{
        //    //    return Unauthorized("Only Deliver Can Remove Category");
        //    //}
        //    var order = await _context.Orders
        //        .Where(ord => ord.Id == answerModel.OrderId).Include(o => o.OrderItems)
        //        .FirstOrDefaultAsync();

        //    if (order == null)
        //    {
        //        return BadRequest("Can not find order");
        //    }

        //    if (order.OrderStatus != OrderStatus.AssignToDeliver)
        //    {
        //        return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
        //    }

        //    if (answerModel.Answer)
        //    {
        //        order.OrderStatus = OrderStatus.DeliverAccepted;
        //        order.DeliverAcceptedDateTime = DateTime.Now;
        //    }
        //    else
        //    {
        //        order.OrderStatus = OrderStatus.DeliverDeny;
        //    }

        //    try
        //    {
        //        _context.Orders.Update(order);
        //        await _context.SaveChangesAsync();
        //        return Ok(new
        //        {
        //            order,
        //            success = true,
        //            EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
        //            {
        //                WebsiteModel = WebsiteModel.Order,
        //                WebsiteEventType = WebsiteEventType.Update,
        //                ObjectId = order.Id,
        //                Description = "DeliverDeny",
        //                UserId = ""
        //            })
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest("error in save order " + e.Message);
        //    }
        //}


        [Authorize]
        [HttpPost("ready-package")]
        public async Task<IActionResult> PackageIsReady([FromBody] JustId justId)
        {
            var id = Convert.ToInt32(justId.Id);
            var subOrder = await _context.SubOrders.FindAsync(id);
            if (subOrder == null)
            {
                return BadRequest("can not find subOrder!");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (subOrder.SellerId != user.Id)
            {
                return BadRequest("user is not true!");
            }

            subOrder.RequestStatus = RequestStatus.PackageReady;
            _context.SubOrders.Update(subOrder);
            await _context.SaveChangesAsync();

            var subOrders = await _context.SubOrders
                .Where(or => or.SellerId == subOrder.SellerId)
                .Include(so => so.SubOrderItems)
                .Include(so => so.Seller)
                .Select(so => new ClientSubOrder()
                {
                    Id = so.Id,
                    SellerId = so.SellerId,
                    SellerName = so.Seller.FullName,
                    SellerAddress = so.Seller.Address,
                    RequestStatus = (int)so.RequestStatus,
                    OrderId = so.OrderId,
                    Items = so.SubOrderItems.Select(soi => new ClientOrderItem()
                    {
                        Id = soi.Id,
                        Count = soi.Count,
                        ProductId = soi.ProductId,
                        Product = soi.Product.Title,
                        Price = soi.Price,
                        Title = soi.Title
                    }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(new
            {
                success = true,
                subOrder,
                subOrders,
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = user.Id.ToString(),
                    WebsiteModel = WebsiteModel.SubOrder,
                    WebsiteEventType = WebsiteEventType.Update,
                    Description = "Package Is Ready for suborder #" + id + " for user: " + user.FullName
                })
            });
        }

        [Authorize]
        [HttpPost("get-product")]
        public async Task<IActionResult> GetProductAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var orderId = Convert.ToInt32(justId.Id);
            var order = await _context.Orders
                .Where(ord => ord.Id == orderId)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }
            if (order.Deliver != thisUser)
            {
                return Unauthorized("wrong user! " + order.Deliver.Id + " != " + thisUser.Id);
            }

            order.OrderStatus = OrderStatus.DeliveryGetProduct;
            order.DeliverGetProductDateTime = DateTime.Now;

            try
            {
                _context.Orders.Update(order);

                await _context.SaveChangesAsync();

                // SmsServices.Sms2CostumerAfterDeliveryGetProducts(order.Mobile, order.Name, order.Id);
                SmsServices.Sms2CostumerAfterDeliveryGetProducts("09116310982", order.Name, order.Id, order.DeliverConfirmCode);

                var orders = await _context.Orders
                    .Where(ord => ord.DeliverId == thisUser.Id)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .Include(o => o.Deliver)
                    .OrderByDescending(ord => ord.Id)
                    .Select(or => new ClientOrder()
                    {
                        Id = or.Id,
                        State = or.State,
                        City = or.City,
                        Mobile = or.Mobile,
                        Name = or.Name,
                        FormattedAddress = or.FormattedAddress,
                        Description = or.Description,
                        Latitude = or.Latitude,
                        Longitude = or.Longitude,
                        OrderStatus = (int)or.OrderStatus,
                        DeliverAtDoor = or.DeliverAtDoor,

                        DeliveryId = or.DeliverId,
                        Delivery = or.Deliver.FullName,
                        Items = or.OrderItems.Select(oi => new ClientOrderItem()
                        {
                            Id = oi.Id,
                            Count = oi.Count,
                            ProductId = oi.ProductId,
                            Product = oi.Product.Title,
                            Price = oi.Price,
                            Title = oi.Title
                        }).ToList()
                    })
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(new
                {
                    order,
                    orders,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "DeliveryGetProduct",
                        UserId = ""
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        [Authorize]
        [HttpPost("deliver-product")]
        public async Task<IActionResult> DeliverProductAsync([FromBody] DeliverProductModel deliverProductModel)
        {
            var thisUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var orderId = deliverProductModel.OrderId;
            var order = await _context.Orders
                .Where(ord => ord.Id == orderId)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }
            if (order.Deliver != thisUser)
            {
                return Unauthorized("wrong user! " + order.Deliver.Id + " != " + thisUser.Id);
            }

            if (order.DeliverConfirmCode != deliverProductModel.DeliverConfirmCode)
            {
                return BadRequest("Wrong code!");
            }

            order.OrderStatus = OrderStatus.DeliveredProduct;
            order.DeliveredProductDateTime = DateTime.Now;

            try
            {
                _context.Orders.Update(order);

                await _context.SaveChangesAsync();

                SmsServices.Sms2CostumerAfterDeliverProducts(order.Mobile, order.Name, order.Id);

                var orders = await _context.Orders
                    .Where(ord => ord.DeliverId == thisUser.Id)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .Include(o => o.Deliver)
                    .OrderByDescending(ord => ord.Id)
                    .Select(or => new ClientOrder()
                    {
                        Id = or.Id,
                        State = or.State,
                        City = or.City,
                        Mobile = or.Mobile,
                        Name = or.Name,
                        FormattedAddress = or.FormattedAddress,
                        Description = or.Description,
                        Latitude = or.Latitude,
                        Longitude = or.Longitude,
                        OrderStatus = (int)or.OrderStatus,
                        DeliverAtDoor = or.DeliverAtDoor,

                        DeliveryId = or.DeliverId,
                        Delivery = or.Deliver.FullName,
                        Items = or.OrderItems.Select(oi => new ClientOrderItem()
                        {
                            Id = oi.Id,
                            Count = oi.Count,
                            ProductId = oi.ProductId,
                            Product = oi.Product.Title,
                            Price = oi.Price,
                            Title = oi.Title
                        }).ToList()
                    })
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(new
                {
                    order,
                    orders,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "DeliveredProduct",
                        UserId = ""
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        [HttpPost("order-data")]
        public async Task<IActionResult> GetOrderDataForDeliveryAsync([FromBody] JustId justId)
        {
            var code = justId.Id.ToString();
            var id = Helper.DecodeNumber(code);
            var order = await _context.Orders
                .Where(or => or.Id == id)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Deliver)
                .Select(ord => new ClientOrder()
                {
                    Id = ord.Id,
                    State = ord.State,
                    City = ord.City,
                    Mobile = ord.Mobile,
                    Name = ord.Name,
                    FormattedAddress = ord.FormattedAddress,
                    Description = ord.Description,
                    Latitude = ord.Latitude,
                    Longitude = ord.Longitude,
                    OrderStatus = (int)ord.OrderStatus,
                    DeliverAtDoor = ord.DeliverAtDoor,

                    DeliveryId = ord.DeliverId,
                    Delivery = ord.Deliver.FullName,
                    DeliveryMobile = ord.Deliver.Mobile,
                    Items = ord.OrderItems.Select(oi => new ClientOrderItem()
                    {
                        Id = oi.Id,
                        Count = oi.Count,
                        ProductId = oi.ProductId,
                        Product = oi.Product.Title,
                        Price = oi.Price,
                        Title = oi.Title
                    }).ToList()
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            var suborders = await _context.SubOrders
               .Where(or => or.OrderId == id)
               .Include(so => so.SubOrderItems)
               .Include(so => so.Seller)
               .Select(so => new ClientSubOrder()
               {
                   Id = so.Id,
                   SellerId = so.SellerId,
                   SellerName = so.Seller.FullName,
                   SellerAddress = so.Seller.Address,
                   RequestStatus = (int)so.RequestStatus,
                   OrderId = so.OrderId,
                   Items = so.SubOrderItems.Select(soi => new ClientOrderItem()
                   {
                       Id = soi.Id,
                       Count = soi.Count,
                       ProductId = soi.ProductId,
                       Product = soi.Product.Title,
                       Price = soi.Price,
                       Title = soi.Title
                   }).ToList()
               })
               .AsNoTracking()
               .ToListAsync();

            if (order == null)
            {
                return BadRequest("order not found");
            }

            return Ok(new
            {
                order,
                suborders,
                success = true,
                EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    WebsiteModel = WebsiteModel.Order,
                    WebsiteEventType = WebsiteEventType.Other,
                    ObjectId = order.Id,
                    Description = "Show order",
                    UserId = ""
                })
            });
        }

                [HttpPost("my-order-data")]
        public async Task<IActionResult> GetOrderDataForCustomerAsync([FromBody] JustId justId)
        {
            var code = justId.Id.ToString();
            var id = Helper.DecodeNumber(code);
            var order = await _context.Orders
                .Where(or => or.Id == id)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Deliver)
                .Select(ord => new ClientOrder()
                {
                    Id = ord.Id,
                    State = ord.State,
                    City = ord.City,
                    Mobile = ord.Mobile,
                    Name = ord.Name,
                    FormattedAddress = ord.FormattedAddress,
                    Description = ord.Description,
                    Latitude = ord.Latitude,
                    Longitude = ord.Longitude,
                    OrderStatus = (int)ord.OrderStatus,
                    DeliverAtDoor = ord.DeliverAtDoor,

                    DeliveryId = ord.DeliverId,
                    Delivery = ord.Deliver.FullName,
                    DeliveryMobile = ord.Deliver.Mobile,
                    Items = ord.OrderItems.Select(oi => new ClientOrderItem()
                    {
                        Id = oi.Id,
                        Count = oi.Count,
                        ProductId = oi.ProductId,
                        Product = oi.Product.Title,
                        Price = oi.Price,
                        Title = oi.Title
                    }).ToList()
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("order not found");
            }

            return Ok(new
            {
                order,
                // suborders,
                success = true,
                EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    WebsiteModel = WebsiteModel.Order,
                    WebsiteEventType = WebsiteEventType.Other,
                    ObjectId = order.Id,
                    Description = "Show order",
                    UserId = ""
                })
            });
        }

        [HttpPost("suborder-data")]
        public async Task<IActionResult> GetSubOrderDataAsync([FromBody] JustId justId)
        {
            var code = justId.Id.ToString();
            var id = Helper.DecodeNumber(code);
            var subOrder = await _context.SubOrders
                .Where(or => or.Id == id)
                .Include(so => so.SubOrderItems)
                .Include(so => so.Seller)
                .Select(so => new ClientSubOrder()
                {
                    Id = so.Id,
                    SellerId = so.SellerId,
                    SellerName = so.Seller.FullName,
                    SellerAddress = so.Seller.Address,
                    RequestStatus = (int)so.RequestStatus,
                    OrderId = so.OrderId,
                    Items = so.SubOrderItems.Select(soi => new ClientOrderItem()
                    {
                        Id = soi.Id,
                        Count = soi.Count,
                        ProductId = soi.ProductId,
                        Product = soi.Product.Title,
                        Price = soi.Price,
                        Title = soi.Title
                    }).ToList()
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (subOrder == null)
            {
                return BadRequest("subOrder not found");
            }

            return Ok(new
            {
                subOrder,
                success = true,
                EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    WebsiteModel = WebsiteModel.SubOrder,
                    WebsiteEventType = WebsiteEventType.Other,
                    ObjectId = subOrder.Id,
                    Description = "Show order",
                    UserId = ""
                })
            });
        }

        //[Authorize]
        //[HttpPost("customer-delivered")]

        //[Authorize]
        //[HttpPost("customer-vote")]

    }
}
