using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Peikresan.Data.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Peikresan.Services
{
    public static class ImageServices
    {
        public static async Task<string> SaveAndConvertImage(IFormFile file, string webRootPath, WebsiteModel model, int width=500, int height=500)
        {
            try
            {
                using (var fileStream = file.OpenReadStream())
                {
                    using (var image = await Image.LoadAsync<Rgba32>(fileStream))
                    {
                        image.Mutate(x => x.Resize(width, height)
                            //.Grayscale()
                        );
                        var filePath = "img\\pic-" + DateTime.Now.Ticks + ".jpg";
                        if (model == WebsiteModel.Product) filePath = "img\\product\\product-" + DateTime.Now.Ticks + ".jpg";
                        
                        await image.SaveAsync(Path.Combine(webRootPath, filePath));
                        return filePath;
                    }
                }
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}
