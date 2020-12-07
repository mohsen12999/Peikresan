using System;
using System.Collections.Generic;

namespace Peikresan.Data.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } = "";

        public int ParentId { get; set; } = 0;
        public bool HaveChild { get; set; } = false;

        public string Img { get; set; }
        // public string Pic => string.IsNullOrEmpty(Img) ? "/img/no-image.png" : "/" + Img;

        public int Order { get; set; } = 0;

        public virtual IList<Product> Products { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
