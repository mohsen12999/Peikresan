using System.Linq;
using Peikresan.Data.Dto;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class DtoServices
    {
        public static OrderDto ToDto(this Order order)
            => new OrderDto
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
                Items = order.OrderItems.Select(oi => new OrderItemDto()
                {
                    Id = oi.Id,
                    Count = oi.Count,
                    ProductId = oi.ProductId,
                    Product = oi.Product.Title,
                    Price = oi.Price,
                    Title = oi.Title
                }).ToList()
            };

        public static ProductDto ToDto(this Product product)
            => new ProductDto
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

        public static UserDto ToDto(this User user)
            => new UserDto
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
                StaffNumber = user.StaffNumber,
                BankNumber = user.BankNumber,
                State = user.State,
                City = user.City,
            };

        public static CategoryDto ToDto(this Category category)
            => new CategoryDto
            {
                Id = category.Id,
                Title = category.Title,
                Description = category.Description,
                Img = category.Img,
                ParentId = category.ParentId
            };

        public static CommentDto ToDto(this Comment comment)
            => new CommentDto
            {
                Id = comment.Id,
                Name = comment.Name,
                Mobile = comment.Mobile,
                Email = comment.Email,
                Description = comment.Description,
                Score = comment.Score,
                Accept = comment.Accept,
                CreateDateTime = comment.CreateDateTime.ToJalali(),
                ProductId = comment.ProductId,
                Product = comment.Product.Title,
            };
    }
}
