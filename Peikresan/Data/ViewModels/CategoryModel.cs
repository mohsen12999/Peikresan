using Microsoft.AspNetCore.Http;

namespace Peikresan.Data.ViewModels
{
    public class CategoryModel{
        public string id { get; set; }
        public IFormFile file { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string category { get; set; }
    }
}
