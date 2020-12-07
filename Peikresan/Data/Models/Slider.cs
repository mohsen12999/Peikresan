using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.Models
{
    public class Slider
    {
        public int Id { get; set; }
        public string Img { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public string ButtonTitle { get; set; }
        public string ButtonUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
