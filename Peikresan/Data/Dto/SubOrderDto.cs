using System;
using System.Collections.Generic;

namespace Peikresan.Data.Dto
{
    public class SubOrderDto
    {
        public int Id { get; set; }
        public Guid? SellerId { get; set; }
        public string SellerName { get; set; }
        public string SellerAddress { get; set; }
        public int RequestStatus { get; set; }
        public int OrderId { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}
