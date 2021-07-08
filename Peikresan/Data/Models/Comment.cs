using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int Text { get; set; }

        public bool Accept { get; set; } = false;
        public DateTime CreateDateTime { get; set; } = DateTime.Now;

        public int ProductId { get; set; }
        public virtual Product Product { get; set; }
    }
}
