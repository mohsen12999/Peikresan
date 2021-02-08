using Microsoft.AspNetCore.Http;

namespace Peikresan.Data.ViewModels
{
    public class SliderModel
    {
        public string Id { get; set; }
        public IFormFile File { get; set; }
        public string Title { get; set; }
    }
}
