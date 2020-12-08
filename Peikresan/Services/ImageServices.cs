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
                        var filePath = model switch
                        {
                            WebsiteModel.Product => "img\\product\\product_" + DateTime.Now.Ticks + ".jpg",
                            WebsiteModel.Category => "img\\category\\cat_" + DateTime.Now.Ticks + ".jpg",
                            WebsiteModel.Slider => "img\\slider\\slider_" + DateTime.Now.Ticks + ".jpg",
                            WebsiteModel.Banner => "img\\banner\\banner_" + DateTime.Now.Ticks + ".jpg",
                            _ => "img\\pic-" + DateTime.Now.Ticks + ".jpg"
                        };

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
