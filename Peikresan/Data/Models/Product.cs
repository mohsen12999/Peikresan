using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Peikresan.Data.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } = "";

        [Column(TypeName = "decimal(10,3)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(10,0)")]
        public decimal? Barcode { get; set; }

        public string Img { get; set; }
        // public string Pic => string.IsNullOrEmpty(Img) ? "/img/no-image.png" : "/" + Img;

        public int Max { get; set; }
        public int Order { get; set; } = 0;

        public bool SoldByWeight { get; set; } = false;
        public int MinWeight { get; set; } = 0;

        public int? CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public virtual IList<SellerProduct> SellerProducts { get; set; }
        [NotMapped] public int SellerCount => SellerProducts?.Count() ?? 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
