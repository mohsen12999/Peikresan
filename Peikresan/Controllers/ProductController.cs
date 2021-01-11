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

namespace Peikresan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILogger<ProductController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly string _webRootPath;

        public ProductController(ILogger<ProductController> logger, ApplicationDbContext context, IWebHostEnvironment appEnvironment)
        {
            _logger = logger;
            _context = context;
            _webRootPath = appEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), appEnvironment.IsDevelopment() ? "ClientApp\\public" : "ClientApp\\build");
        }

        [HttpGet]
        public async Task<IActionResult> ProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(new { products });
        }

        [Authorize]
        [HttpPost]
        [DisableRequestSizeLimit]
        //public async Task<IActionResult> productAsync(string id, IFormFile file, string title, string description, decimal price, string category, string soldByWeight, int minWeight)
        public async Task<IActionResult> ProductAsync([FromForm] ProductModel productModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Add Product");
            }

            var filename = 
                await ImageServices.SaveAndConvertImage(productModel.file, _webRootPath, WebsiteModel.Product, 500, 500);
            
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
                    element= product,
                    cat = cat == null ? null : new { cat.Id, cat.Title, cat.Description, cat.Img, cat.ParentId, cat.HaveChild, cat.Order },
                    product = new { product.Id, product.Title, product.Description, product.Price, product.Img, product.Max, product.Order, product.SoldByWeight, product.MinWeight, product.CategoryId },
                    success = true,
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog()
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
        [HttpPost("remove")]
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

    }
}
