using Microsoft.AspNetCore.Http;

namespace Peikresan.Data.ViewModels
{
    public class BannerModel
    {
        public string id { get; set; }
        public IFormFile file { get; set; }
        public string title { get; set; }
        public string url { get; set; }
    }
}
