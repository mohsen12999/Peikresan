using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.ClientModels
{
    public class ClientSellerProduct
    {
        public int ProductId { get; set; }
        public string ProductTitle { get; set; }

        public int Count { get; set; }
        public decimal Price { get; set; }
    }
}
