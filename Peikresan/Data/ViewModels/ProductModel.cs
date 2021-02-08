using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace Peikresan.Data.ViewModels
{
    public class ProductModel{
        public string Id { get; set; }
        public IFormFile File { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        
        [Column(TypeName = "decimal(10,3)")]
        public decimal Price { get; set; }
        public string Order { get; set; }
        public int Max { get; set; }
        public bool SoldByWeight { get; set; } = false;
        public string MinWeight { get; set; } = "";
        public string Category { get; set; }
    }
}
