using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
        public int Score { get; set; }

        public bool Accept { get; set; } = false;
        public DateTime CreateDateTime { get; set; } = DateTime.Now;

        public int ProductId { get; set; }
        public virtual Product Product { get; set; }
    }
}
