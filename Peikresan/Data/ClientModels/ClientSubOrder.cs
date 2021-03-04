using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.ClientModels
{
    public class ClientSubOrder
    {
        public int Id { get; set; }
        public Guid? SellerId { get; set; }
        public string SellerName { get; set; }
        public string SellerAddress { get; set; }
        public int RequestStatus { get; set; }
        public int OrderId { get; set; }
        public List<ClientOrderItem> Items { get; set; }
    }
}
