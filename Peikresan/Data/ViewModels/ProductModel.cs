using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace Peikresan.Data.ViewModels
{
    public class ProductModel{
        public string id { get; set; }
        public IFormFile file { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        
        [Column(TypeName = "decimal(10,3)")]
        public decimal price { get; set; }
        public string order { get; set; }
        public int max { get; set; }
        public bool soldByWeight { get; set; } = false;
        public string minWeight { get; set; } = "";
        public string category { get; set; }
    }
}
