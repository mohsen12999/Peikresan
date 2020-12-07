using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.Models
{
    public class AwesomeProduct
    {
        public int Id { get; set; }

        public int Count { get; set; }

        [Column(TypeName = "decimal(10,3)")]
        public decimal NewPrice { get; set; }
        [Column(TypeName = "decimal(3,2)")]
        public decimal Percent { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
