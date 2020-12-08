using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
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
    public class AdminController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<AdminController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly string _webRootPath;

        public AdminController(ILogger<AdminController> logger, ApplicationDbContext context, IWebHostEnvironment appEnvironment)
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
        [HttpGet]
        public IEnumerable<string> Get()
        {
            // var rng = new Random();
            // return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            // {
            //     Date = DateTime.Now.AddDays(index),
            //     TemperatureC = rng.Next(-20, 55),
            //     Summary = Summaries[rng.Next(Summaries.Length)]
            // })
            // .ToArray();
            return Summaries.ToArray();
        }

        [HttpPost]
        [Authorize]
        public IActionResult Post()
        {
            return Ok(new { success = true, msg = "access granted", name = User.Identity.Name });
            // var products = await _context.Products.ToListAsync();
            // var categories = await _context.Categories.ToListAsync();
            // var sliders = await _context.Sliders.Select(s => s.Img).ToListAsync();
            // var banners = await _context.Banners.ToListAsync();


            // int[] suggestions = products.OrderBy(el => el.Id).Select(o => o.Id).Take(10).ToArray();
            // int[] newest = products.OrderByDescending(el => el.Id).Select(o=>o.Id).Take(10).ToArray();
            // int[] mostSell = products.OrderBy(el => el.Id).Select(o => o.Id).Take(10).ToArray();

            // return Ok(new { products, categories ,sliders, banners, suggestions, newest, mostSell });
        }

        #region Category

        [HttpGet("categories")]
        public async Task<IActionResult> CategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(new { categories });
        }

        [Authorize]
        [HttpPost("category")]
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
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Category,
                        WebsiteEventType = WebsiteEventType.Insert,
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
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Category,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = cat.Id,
                        Description = "Update Category " + cat.Title
                    })
                });
            }
        }

        [Authorize]
        [HttpPost("remove-category")]
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
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.Category,
                    WebsiteEventType = WebsiteEventType.Delete,
                    ObjectId = cat.Id,
                    Description = "Delete Category " + cat.Title
                })
            });
        }

        #endregion

        #region Product

        [HttpGet("products")]
        public async Task<IActionResult> ProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(new { products });
        }

        [Authorize]
        [HttpPost("product")]
        [DisableRequestSizeLimit]
        //public async Task<IActionResult> productAsync(string id, IFormFile file, string title, string description, decimal price, string category, string soldByWeight, int minWeight)
        public async Task<IActionResult> ProductAsync([FromForm] ProductModel productModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Add Product");
            }

            string filename;
            try
            {
                using (var fileStream = productModel.file.OpenReadStream())
                {
                    using (Image<Rgba32> image = Image.Load<Rgba32>(fileStream))
                    {
                        image.Mutate(x => x
                                .Resize(500, 500)
                        //.Grayscale()
                        );
                        var filepath = "img\\product\\product-" + DateTime.Now.Ticks + ".jpg";
                        await image.SaveAsync(Path.Combine(_webRootPath, filepath)); // Automatic encoder selected based on extension.
                        filename = filepath;
                    }
                }
            }
            catch (Exception)
            {
                filename = "";
            }
            var productCategory = string.IsNullOrEmpty(productModel.category) ? null : productModel.category.Trim();
            if (productCategory != null && productCategory.IndexOf('/') > 0)
            {
                productCategory = productCategory.Substring(0, productCategory.IndexOf('/')).Trim();
            }

            var cat = productCategory == null ? null : await _context.Categories.Where(el => el.Title == productModel.category.Trim()).FirstOrDefaultAsync();
            // var cattId = cat != null ? cat.Id : 0;

            if (productModel.id == "" || productModel.id.ToLower() == "undefined")
            {

                var product = new Product
                {
                    Title = productModel.title,
                    Description = string.IsNullOrEmpty(productModel.description) || productModel.description.ToLower() == "undefined" ? "" : productModel.description,
                    Price = productModel.price,
                    Max = productModel.max,
                    SoldByWeight = productModel.soldByWeight,
                };

                if (int.TryParse(productModel.order, out int order))
                {
                    product.Order = order;
                }

                if (int.TryParse(productModel.minWeight, out int minWeight))
                {
                    product.MinWeight = minWeight;
                }

                if (filename.Length > 0)
                {
                    product.Img = filename;
                }
                product.CategoryId = cat?.Id ?? 1;
                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    cat = cat == null ? null : new { cat.Id, cat.Title, cat.Description, cat.Img, cat.ParentId, cat.HaveChild, cat.Order },
                    product = new { product.Id, product.Title, product.Description, product.Price, product.Img, product.Max, product.Order, product.SoldByWeight, product.MinWeight, product.CategoryId },
                    success = true,
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Product,
                        WebsiteEventType = WebsiteEventType.Insert,
                        ObjectId = product.Id,
                        Description = "add product " + product.Title
                    })
                });
            }
            else
            {
                var product = await _context.Products.FindAsync(int.Parse(productModel.id));
                if (product == null)
                {
                    return NotFound("Product not Found: " + productModel.id);
                }

                product.Title = productModel.title;
                product.Description = string.IsNullOrEmpty(productModel.description) || productModel.description.ToLower() == "undefined" ? "" : productModel.description;
                product.Price = productModel.price;
                if (int.TryParse(productModel.order, out int order))
                {
                    product.Order = order;
                }
                product.Max = productModel.max;
                product.SoldByWeight = productModel.soldByWeight;

                if (int.TryParse(productModel.minWeight, out int minWeight))
                {
                    product.MinWeight = minWeight;
                }

                if (filename.Length > 0)
                {
                    product.Img = filename;
                }
                if (cat != null)
                {
                    product.CategoryId = cat.Id;
                }
                _context.Products.Update(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    cat = cat == null ? null : new { cat.Id, cat.Title, cat.Description, cat.Img, cat.ParentId, cat.HaveChild, cat.Order },
                    product = new { product.Id, product.Title, product.Description, product.Price, product.Img, product.Max, product.Order, product.SoldByWeight, product.MinWeight, product.CategoryId },
                    success = true,
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Product,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = product.Id,
                        Description = "Update product " + product.Title
                    })
                });
            }
        }

        [Authorize]
        [HttpPost("remove-product")]
        public async Task<IActionResult> RemoveProductAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove Product");
            }

            var id = Convert.ToInt32(justId.id);
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound("Product not Found: " + justId.id);
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            var products = await _context.Products
                .Select(p => new { p.Id, p.Title, p.Description, p.Price, p.Img, p.Max, p.Order, p.SoldByWeight, p.MinWeight, p.CategoryId })
                .ToListAsync();

            return Ok(new
            {
                products,
                success = true,
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.Product,
                    WebsiteEventType = WebsiteEventType.Delete,
                    ObjectId = product.Id,
                    Description = "Delete product " + product.Title
                })
            });
        }

        #endregion

        #region Banner

        [Authorize]
        [HttpPost("banner")]
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
        [HttpPost("remove-banner")]
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

        #endregion

        #region Slider

        [Authorize]
        [HttpPost("slider")]
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
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Slider,
                        WebsiteEventType = WebsiteEventType.Insert,
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
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.Slider,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = slider.Id,
                        Description = "Update Slider " + slider.Title
                    })
                });
            }
        }

        [Authorize]
        [HttpPost("remove-slider")]
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
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.Slider,
                    WebsiteEventType = WebsiteEventType.Delete,
                    ObjectId = slider.Id,
                    Description = "Delete Slider " + slider.Title
                })
            });
        }

        #endregion

        #region User

        [Authorize]
        [HttpPost("user")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UserAsync([FromForm] RegisterModel registerModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Add User");
            }

            try
            {
                var user = new User() { UserName = registerModel.username, Email = registerModel.email };
                var role = await _context.Roles.Where(r => r.Id.ToString() == registerModel.roleId.Trim()).FirstAsync();
                if (role != null) user.Role = role;

                if (string.IsNullOrEmpty(registerModel.firstName) == false && registerModel.firstName.ToLower() != "undefines")
                {
                    user.FirstName = registerModel.firstName.Trim();
                }
                if (string.IsNullOrEmpty(registerModel.lastName) == false && registerModel.lastName.ToLower() != "undefines")
                {
                    user.LastName = registerModel.lastName.Trim();
                }
                if (string.IsNullOrEmpty(registerModel.mobile) == false && registerModel.mobile.ToLower() != "undefines")
                {
                    user.Mobile = registerModel.mobile.Trim();
                }

                var passwordHasher = new PasswordHasher<User>();
                var passwordHash = passwordHasher.HashPassword(user, registerModel.password);
                user.PasswordHash = passwordHash;

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    user = new { user.Id, user.FirstName, role = user.Role?.Name ?? "", user.UserName, user.LastName, user.Mobile },
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.User,
                        WebsiteEventType = WebsiteEventType.Insert,
                        Description = "Admin " + thisUser.FullName + " Register User " + user.FullName + " - role: " + (role?.Name ?? "")
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in add user " + e.Message);
            }

        }

        [Authorize]
        [HttpPost("remove-user")]
        public async Task<IActionResult> RemoveUserAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove User");
            }

            var id = justId.id.ToString();
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                return Unauthorized("Can not find User");
            }

            if (user.Id == thisUser.Id)
            {
                return BadRequest("Can not remove yourself");
            }


            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            var users = await _context.Users.Include(u => u.Role).Select(us => new { us.Id, us.UserName, us.FirstName, us.LastName, us.Role, us.Mobile }).ToListAsync();

            return Ok(new
            {
                users,
                success = true,
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.User,
                    WebsiteEventType = WebsiteEventType.Insert,
                    Description = "Admin " + thisUser.FullName + " Remove User " + user.FullName
                })
            });
        }

        #endregion

        #region SellerProduct

        [Authorize]
        [HttpPost("seller-product")]
        public async Task<IActionResult> SellerProductAsync(SellerProductModel sellerProductModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "seller")
            {
                return Unauthorized("Only Seller Can Remove User");
            }

            var product = await _context.Products.Where(p => p.Title == sellerProductModel.product.Trim()).FirstAsync();
            if (product == null)
            {
                return BadRequest("product not Found! " + sellerProductModel.product);
            }

            if (string.IsNullOrEmpty(sellerProductModel.id) || sellerProductModel.id.ToLower() == "undefined")
            {
                var sellerProduct = new SellerProduct { UserId = thisUser.Id, Count = sellerProductModel.count, ProductId = product.Id };
                await _context.SellerProducts.AddAsync(sellerProduct);
                try
                {
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        success = true,
                        sellerProduct,
                        product,
                        eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                        {
                            UserId = thisUser.Id.ToString(),
                            WebsiteModel = WebsiteModel.SellerProduct,
                            WebsiteEventType = WebsiteEventType.Insert,
                            Description = "add " + product.Title + " for " + thisUser.FullName
                        })
                    });
                }
                catch (Exception e)
                {
                    return BadRequest("Can not save new SellerProducts! " + e.Message);
                }
            }
            else
            {
                var sellerProduct = await _context.SellerProducts.FindAsync(int.Parse(sellerProductModel.id));
                if (sellerProduct == null)
                {
                    return NotFound("Slidder not Found: " + sellerProductModel.id);
                }

                sellerProduct.UserId = thisUser.Id;
                sellerProduct.Count = sellerProductModel.count;
                sellerProduct.ProductId = product.Id;
                _context.SellerProducts.Update(sellerProduct);
                try
                {
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        success = true,
                        sellerProduct,
                        product,
                        eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                        {
                            UserId = thisUser.Id.ToString(),
                            WebsiteModel = WebsiteModel.SellerProduct,
                            WebsiteEventType = WebsiteEventType.Update,
                            Description = "Update " + product.Title + " for " + thisUser.FullName
                        })
                    });
                }
                catch (Exception e)
                {
                    return BadRequest("Can not Edit SellerProducts! " + e.Message);
                }
            }

        }

        [Authorize]
        [HttpPost("remove-seller-product")]
        public async Task<IActionResult> RemoveSellerProductAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "seller")
            {
                return Unauthorized("Only Admin Can Remove SellerProduct");
            }

            var id = Convert.ToInt32(justId.id);
            var sellerProduct = await _context.SellerProducts.FindAsync(id);
            if (sellerProduct == null)
            {
                return BadRequest("sellerProduct not found");
            }

            if (sellerProduct.UserId != thisUser.Id)
            {
                return Unauthorized("You can not remove this user: " + sellerProduct.UserId + " != " + thisUser.Id);
            }

            _context.SellerProducts.Remove(sellerProduct);

            try
            {
                await _context.SaveChangesAsync();

                var sellerProducts = await _context.SellerProducts.ToListAsync();

                return Ok(new
                {
                    sellerProducts,
                    success = true,
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.SellerProduct,
                        WebsiteEventType = WebsiteEventType.Delete,
                        Description = "Delete SellerProduct" + id
                    })
                });
            }
            catch (Exception)
            {
                return BadRequest("can not remove sellerProduct");
            }
        }

        #endregion
    }
}

/*
 * 
 * if (sliderModel.id == "" || sliderModel.id.ToLower() == "undefined")
            {
                var slider = new Slider { Title = sliderModel.title };
                if (filename.Length > 0)
                {
                    slider.Img = filename;
                }
                _context.Sliders.Add(slider);
                await _context.SaveChangesAsync();
                return Ok(new { slider, success = true, imgError, _webRootPath, sliderModel, msg = "new slider" });
            }
            else
            {
                var slider = _context.Sliders.Find(int.Parse(sliderModel.id));
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
                return Ok(new { slider, success = true, imgError, _webRootPath, sliderModel, msg = "edit slider" });
            }
*/