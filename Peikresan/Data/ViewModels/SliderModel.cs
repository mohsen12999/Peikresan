using Microsoft.AspNetCore.Http;

namespace Peikresan.Data.ViewModels
{
    public class SliderModel
    {
        public string id { get; set; }
        public IFormFile file { get; set; }
        public string title { get; set; }
    }
}
