using System;
using System.IO;
using System.Linq;
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
    public class CategoryController : ControllerBase
    {
        private readonly ILogger<CategoryController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly string _webRootPath;

        public CategoryController(ILogger<CategoryController> logger, ApplicationDbContext context, IWebHostEnvironment appEnvironment)
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

        [HttpGet]
        public async Task<IActionResult> CategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(new { categories });
        }

        [Authorize]
        [HttpPost]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> CategoryAsync([FromForm] CategoryModel categoryModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Add Category");
            }

            string filename;
            var imgError = "";
            try
            {
                using (var fileStream = categoryModel.file.OpenReadStream())
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

            var parent = await _context.Categories.Where(el => el.Title == categoryModel.category.Trim()).FirstOrDefaultAsync();

            if (categoryModel.id == "" || categoryModel.id.ToLower() == "undefined")
            {
                var cat = new Category
                {
                    Title = categoryModel.title,
                    Description = string.IsNullOrEmpty(categoryModel.description) || categoryModel.description.ToLower() == "undefined" ? "" : categoryModel.description
                };
                if (filename.Length > 0)
                {
                    cat.Img = filename;
                }
                cat.ParentId = parent?.Id ?? 0;
                await _context.Categories.AddAsync(cat);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    cat = new { cat.Id, cat.Title, cat.Description, cat.Img, cat.ParentId, cat.HaveChild, cat.Order },
                    success = true,
                    imgError,
                    _webRootPath,
                    categoryModel,
                    eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                    {
                        UserId = thisUser.Id.ToString(),
                        EventLogModel = EventLogModel.Category,
                        EventLogType = EventLogType.Insert,
                        ObjectId = cat.Id,
                        Description = "add Category " + cat.Title
                    })
                });
            }
            else
            {
                var cat = await _context.Categories.FindAsync(int.Parse(categoryModel.id));
                if (cat == null)
                {
                    return NotFound("Category not Found: " + categoryModel.id);
                }
                cat.Title = categoryModel.title;
                cat.Description = string.IsNullOrEmpty(categoryModel.description) || categoryModel.description.ToLower() == "undefined" ? "" : categoryModel.description;
                if (filename.Length > 0)
                {
                    cat.Img = filename;
                }
                if (parent != null)
                {
                    cat.ParentId = parent.Id;
                }
                _context.Categories.Update(cat);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    cat = new { cat.Id, cat.Title, cat.Description, cat.Img, cat.ParentId, cat.HaveChild, cat.Order },
                    success = true,
                    imgError,
                    _webRootPath,
                    categoryModel,
                    eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                    {
                        UserId = thisUser.Id.ToString(),
                        EventLogModel = EventLogModel.Category,
                        EventLogType = EventLogType.Update,
                        ObjectId = cat.Id,
                        Description = "Update Category " + cat.Title
                    })
                });
            }
        }

        [Authorize]
        [HttpPost("remove")]
        public async Task<IActionResult> RemoveCategoryAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove Category");
            }

            var id = Convert.ToInt32(justId.id);
            var cat = await _context.Categories.FindAsync(id);
            if (cat == null)
            {
                return NotFound("Category not Found: " + id);
            }
            _context.Categories.Remove(cat);
            await _context.SaveChangesAsync();

            var categories = await _context.Categories
                .Select(c => new { c.Id, c.Title, c.Description, c.Img, c.ParentId, c.HaveChild, c.Order })
                .ToListAsync();


            return Ok(new
            {
                categories,
                success = true,
                eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                {
                    UserId = thisUser.Id.ToString(),
                    EventLogModel = EventLogModel.Category,
                    EventLogType = EventLogType.Delete,
                    ObjectId = cat.Id,
                    Description = "Delete Category " + cat.Title
                })
            });
        }
 
    }
}