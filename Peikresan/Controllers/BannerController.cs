using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Peikresan.Data;
using Peikresan.Data.Models;
using Peikresan.Data.ViewModels;
using Peikresan.Services;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Peikresan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BannerController : ControllerBase
    {
        private readonly ILogger<BannerController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly string _webRootPath;

        public BannerController(ILogger<BannerController> logger, ApplicationDbContext context, IWebHostEnvironment appEnvironment)
        {
            _logger = logger;
            _context = context;
            _webRootPath = appEnvironment.WebRootPath;
            if (_webRootPath == null)
            {
                if (appEnvironment.IsDevelopment())
                {
                    _webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\public");
                }
                else
                {
                    _webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build");
                }
            }
        }


        [Authorize]
        [HttpPost]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> BannerAsync([FromForm] BannerModel bannerModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Add Banner");
            }

            string filename;
            var imgError = "";
            try
            {
                using (var fileStream = bannerModel.file.OpenReadStream())
                {
                    using (Image<Rgba32> image = Image.Load<Rgba32>(fileStream))
                    {
                        image.Mutate(x => x
                                .Resize(500, 425)
                        //.Grayscale()
                        );
                        var filepath = "img\\banner\\cat" + DateTime.Now.Ticks + ".jpg";
                        await image.SaveAsync(Path.Combine(_webRootPath, filepath)); // Automatic encoder selected based on extension.
                        filename = filepath;
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogWarning(e.Message);
                imgError = e.Message;
                filename = "";
            }

            if (bannerModel.id == "" || bannerModel.id.ToLower() == "undefined")
            {
                var banner = new Banner { Title = bannerModel.title, Url = bannerModel.url.Trim() };
                if (filename.Length > 0)
                {
                    banner.Img = filename;
                }
                await _context.Banners.AddAsync(banner);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    banner,
                    success = true,
                    imgError,
                    _webRootPath,
                    bannerModel,
                    eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                    {
                        UserId = thisUser.Id.ToString(),
                        EventLogModel = EventLogModel.Banner,
                        EventLogType = EventLogType.Insert,
                        ObjectId = banner.Id,
                        Description = "add Banner " + banner.Title
                    })
                });
            }
            else
            {
                var banner = await _context.Banners.FindAsync(int.Parse(bannerModel.id));
                if (banner == null)
                {
                    return NotFound("banner not Found: " + bannerModel.id);
                }

                banner.Title = bannerModel.title;
                banner.Url = bannerModel.url.Trim();

                if (filename.Length > 0)
                {
                    banner.Img = filename;
                }

                _context.Banners.Update(banner);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    banner,
                    success = true,
                    imgError,
                    _webRootPath,
                    bannerModel,
                    eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                    {
                        UserId = thisUser.Id.ToString(),
                        EventLogModel = EventLogModel.Banner,
                        EventLogType = EventLogType.Update,
                        ObjectId = banner.Id,
                        Description = "Update Banner " + banner.Title
                    })
                });
            }
        }

        [Authorize]
        [HttpPost("remove")]
        public async Task<IActionResult> RemoveBannerAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove Banner");
            }

            var id = Convert.ToInt32(justId.id);
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
            {
                return NotFound("Banner not Found: " + id);
            }
            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            var banners = await _context.Banners.ToListAsync();

            return Ok(new
            {
                banners,
                success = true,
                eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                {
                    UserId = thisUser.Id.ToString(),
                    EventLogModel = EventLogModel.Banner,
                    EventLogType = EventLogType.Delete,
                    ObjectId = banner.Id,
                    Description = "Delete Banner " + banner.Title
                })
            });
        }

    }
}
