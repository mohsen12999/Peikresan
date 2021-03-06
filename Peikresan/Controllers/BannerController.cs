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
            _webRootPath = appEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), appEnvironment.IsDevelopment() ? "ClientApp\\public" : "ClientApp\\build");
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

            var filename =
                await ImageServices.SaveAndConvertImage(bannerModel.File, _webRootPath, WebsiteModel.Banner, 500, 425);
            

            if (bannerModel.Id == "" || bannerModel.Id.ToLower() == "undefined")
            {
                var banner = new Banner { Title = bannerModel.Title, Url = bannerModel.Url.Trim() };
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
                    _webRootPath,
                    bannerModel,
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Banner,
                        WebsiteEventType = WebsiteEventType.Insert,
                        ObjectId = banner.Id,
                        Description = "add Banner " + banner.Title
                    })
                });
            }
            else
            {
                var banner = await _context.Banners.FindAsync(int.Parse(bannerModel.Id));
                if (banner == null)
                {
                    return NotFound("banner not Found: " + bannerModel.Id);
                }

                banner.Title = bannerModel.Title;
                banner.Url = bannerModel.Url.Trim();

                if (filename.Length > 0)
                {
                    banner.Img = filename;
                }

                _context.Banners.Update(banner);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    element= banner,
                    banner,
                    success = true,
                    _webRootPath,
                    bannerModel,
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Banner,
                        WebsiteEventType = WebsiteEventType.Update,
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

            var id = Convert.ToInt32(justId.Id);
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
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.Banner,
                    WebsiteEventType = WebsiteEventType.Delete,
                    ObjectId = banner.Id,
                    Description = "Delete Banner " + banner.Title
                })
            });
        }

    }
}
