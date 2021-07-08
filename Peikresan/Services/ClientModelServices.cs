using System.Linq;
using Peikresan.Data.ClientModels;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class ClientModelServices
    {
        public static ClientOrder ConvertToClientOrder(this Order order)
            => new ClientOrder
            {
                Id = order.Id,
                State = order.State,
                City = order.City,
                Mobile = order.Mobile,
                Name = order.Name,
                FormattedAddress = order.FormattedAddress,
                Description = order.Description,
                Latitude = order.Latitude,
                Longitude = order.Longitude,
                OrderStatus = (int)order.OrderStatus,
                DeliverAtDoor = order.DeliverAtDoor,

                DeliveryId = order.DeliverId,
                Delivery = order.Deliver.FullName,
                DeliveryMobile = order.Deliver.Mobile,
                InitDateTime = order.InitDateTime,
                Items = order.OrderItems.Select(oi => new ClientOrderItem()
                {
                    Id = oi.Id,
                    Count = oi.Count,
                    ProductId = oi.ProductId,
                    Product = oi.Product.Title,
                    Price = oi.Price,
                    Title = oi.Title
                }).ToList()
            };

        public static ClientProduct ConvertToClientProduct(this Product product)
            => new ClientProduct
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Img = product.Pic, // product.Img
                Max = product.Max,
                SoldByWeight = product.SoldByWeight,
                MinWeight = product.MinWeight,
                Barcode = product.Barcode,
                Order = product.Order,
                CategoryId = product.CategoryId,
                Category = product.Category?.Title ?? "",
                Confirm = product.Confirm
            };

        public static ClientUser ConvertToClientUser(this User user)
            => new ClientUser
            {
                Id = user.Id.ToString(),
                Title = user.Title,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                Mobile = user.Mobile,
                Tel = user.Tel,
                Address = user.Address,
                Role = user.Role.Name,
                RoleId = user.Role.Id.ToString(),
                Latitude = user.Latitude,
                Longitude = user.Longitude,
                OpenTimeStr = Helper.MakeTimeFromNullableNumber(user.OpenTime),
                CloseTimeStr = Helper.MakeTimeFromNullableNumber(user.CloseTime),
                OpenTime2Str = Helper.MakeTimeFromNullableNumber(user.OpenTime2),
                CloseTime2Str = Helper.MakeTimeFromNullableNumber(user.CloseTime2),

                IdNumber = user.IdNumber,
                IdPic = user.IdPic,
                LicenseNumber = user.LicenseNumber,
                LicensePic = user.LicensePic,
                Staff = user.Staff,
                BankNumber = user.BankNumber,
                State = user.State,
                City = user.City,
            };

        public static ClientCategory ConvertToClientCategory(this Category category)
        => new ClientCategory
        {
            Id = category.Id,
            Title = category.Title,
            Description = category.Description,
            Img = category.Img,
            ParentId = category.ParentId
        };
    }
}
