using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.Models
{
    public class SellerProduct
    {
        public Guid? UserId { get; set; }
        public User User { get; set; }

        public int? ProductId { get; set; }
        public Product Product { get; set; }

        public int Count { get; set; }
    }
}
