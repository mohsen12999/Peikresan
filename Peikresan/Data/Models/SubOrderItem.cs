using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Peikresan.Data.Models
{
    public class SubOrderItem
    {
        public int Id { get; set; }
        public string Title { get; set; }

        [Column(TypeName = "decimal(10,3)")]
        public decimal Price { get; set; }
        public int Count { get; set; }

        public int? ProductId { get; set; }
        public virtual Product Product { get; set; }

        public virtual int SubOrderId { get; set; }
        public virtual SubOrder SubOrder { get; set; }

        [NotMapped]
        public decimal ItemsPrice => Count * Price;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
    
}