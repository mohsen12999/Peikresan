using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.ClientModels
{
    public class ClientOrderItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Count { get; set; }
        public int? ProductId { get; set; }
        public string Product { get; set; }
        public decimal Price { get; set; }
    }
}
