using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.Dto
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
        public int Score { get; set; }

        public bool Accept { get; set; } = false;
        public string CreateDateTime { get; set; }

        public int ProductId { get; set; }
        public string Product { get; set; }
    }
}
