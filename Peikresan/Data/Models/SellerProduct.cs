using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Peikresan.Data.Models
{
    public class SellerProduct
    {
        public string Title { get; set; }

        public int Count { get; set; }

        [Column(TypeName = "decimal(10,3)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(10,0)")]
        public decimal? Barcode { get; set; }

        public Guid? UserId { get; set; }
        public User User { get; set; }

        public int? ProductId { get; set; }
        public Product Product { get; set; }
    }
}
