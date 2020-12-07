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
    public class SliderController : ControllerBase
    {

        private readonly ILogger<SliderController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly string _webRootPath;

        public SliderController(ILogger<SliderController> logger, ApplicationDbContext context, IWebHostEnvironment appEnvironment)
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
        public async Task<IActionResult> SliderAsync([FromForm] SliderModel sliderModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Add Slider");
            }

            string filename;
            var imgError = "";
            try
            {
                using (var fileStream = sliderModel.file.OpenReadStream())
                {
                    using (Image<Rgba32> image = Image.Load<Rgba32>(fileStream))
                    {
                        image.Mutate(x => x
                                .Resize(500, 425)
                        //.Grayscale()
                        );
                        var filepath = "img\\category\\cat" + DateTime.Now.Ticks + ".jpg";
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

            if (sliderModel.id == "" || sliderModel.id.ToLower() == "undefined")
            {
                var slider = new Slider { Title = sliderModel.title };
                if (filename.Length > 0)
                {
                    slider.Img = filename;
                }
                await _context.Sliders.AddAsync(slider);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    slider,
                    success = true,
                    imgError,
                    _webRootPath,
                    sliderModel,
                    eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                    {
                        UserId = thisUser.Id.ToString(),
                        EventLogModel = EventLogModel.Slider,
                        EventLogType = EventLogType.Insert,
                        ObjectId = slider.Id,
                        Description = "Add slider " + slider.Title
                    })
                });
            }
            else
            {
                var slider = await _context.Sliders.FindAsync(int.Parse(sliderModel.id));
                if (slider == null)
                {
                    return NotFound("Slidder not Found: " + sliderModel.id);
                }
                slider.Title = sliderModel.title;
                if (filename.Length > 0)
                {
                    slider.Img = filename;
                }
                _context.Sliders.Update(slider);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    slider,
                    success = true,
                    imgError,
                    _webRootPath,
                    sliderModel,
                    eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                    {
                        UserId = thisUser.Id.ToString(),
                        EventLogModel = EventLogModel.Slider,
                        EventLogType = EventLogType.Update,
                        ObjectId = slider.Id,
                        Description = "Update Slider " + slider.Title
                    })
                });
            }
        }

        [Authorize]
        [HttpPost("remove")]
        public async Task<IActionResult> RemoveSliderAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove Slider");
            }

            var id = Convert.ToInt32(justId.id);
            var slider = await _context.Sliders.FindAsync(id);
            if (slider == null)
            {
                return NotFound("Slider not Found: " + id);
            }
            _context.Sliders.Remove(slider);
            await _context.SaveChangesAsync();

            var sliders = await _context.Sliders.ToListAsync();

            return Ok(new
            {
                sliders,
                success = true,
                eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                {
                    UserId = thisUser.Id.ToString(),
                    EventLogModel = EventLogModel.Slider,
                    EventLogType = EventLogType.Delete,
                    ObjectId = slider.Id,
                    Description = "Delete Slider " + slider.Title
                })
            });
        }

    }
}
