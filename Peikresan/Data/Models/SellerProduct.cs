using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Peikresan.Data.Models
{
    public class SellerProduct
    {
        public Guid? UserId { get; set; }
        public User User { get; set; }

        public int? ProductId { get; set; }
        public Product Product { get; set; }

        public int Count { get; set; }

        [Column(TypeName = "decimal(10,3)")]
        public decimal Price { get; set; }
    }
}
