using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Peikresan.Data.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public string Title { get; set; }

        [Column(TypeName = "decimal(10,3)")]
        public decimal Price { get; set; }
        public int Count { get; set; }

        public int? ProductId { get; set; }
        public virtual Product Product { get; set; }

        public virtual int OrderId { get; set; }
        public virtual Order Order { get; set; }

        [NotMapped]
        public decimal ItemsPrice => Count * Price;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}