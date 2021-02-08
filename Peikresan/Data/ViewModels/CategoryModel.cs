using Microsoft.AspNetCore.Http;

namespace Peikresan.Data.ViewModels
{
    public class CategoryModel{
        public string Id { get; set; }
        public IFormFile File { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
    }
}
