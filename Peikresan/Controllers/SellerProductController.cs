using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Peikresan.Data;
using Peikresan.Data.ClientModels;
using Peikresan.Data.Models;
using Peikresan.Data.ViewModels;
using Peikresan.Services;

namespace Peikresan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SellerProductController : ControllerBase
    {
        private readonly ILogger<SellerProductController> _logger;
        private readonly ApplicationDbContext _context;

        public SellerProductController(ILogger<SellerProductController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SellerProductAsync(SellerProductModel sellerProductModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "seller")
            {
                return Unauthorized("Only Seller Can Remove User");
            }

            var product = await _context.Products.Where(p => p.Title == sellerProductModel.Product.Trim()).FirstAsync();
            if (product == null)
            {
                return BadRequest("product not Found! " + sellerProductModel.Product);
            }

            if (string.IsNullOrEmpty(sellerProductModel.Id) || sellerProductModel.Id.ToLower() == "undefined")
            {
                var sellerProduct = new SellerProduct { UserId = thisUser.Id, Count = sellerProductModel.Count, Price = sellerProductModel.Price, ProductId = product.Id };
                await _context.SellerProducts.AddAsync(sellerProduct);
                try
                {
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        element = sellerProduct,
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
                var sellerProduct = await _context.SellerProducts.FindAsync(int.Parse(sellerProductModel.Id));
                if (sellerProduct == null)
                {
                    return NotFound("Slider not Found: " + sellerProductModel.Id);
                }

                sellerProduct.UserId = thisUser.Id;
                sellerProduct.Count = sellerProductModel.Count;
                sellerProduct.Price = sellerProductModel.Price;
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
        [HttpPost("remove")]
        public async Task<IActionResult> RemoveSellerProductAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "seller")
            {
                return Unauthorized("Only Admin Can Remove SellerProduct");
            }

            var id = Convert.ToInt32(justId.Id);
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

        [Authorize]
        [HttpPost("upload-file")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadExcelFile([FromForm] UploadFileModel uploadFileModel)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var oldSellerProducts = await _context.SellerProducts.Where(sp => sp.UserId == thisUser.Id).ToListAsync();
            if (oldSellerProducts.Any())
            {
                _context.SellerProducts.RemoveRange(oldSellerProducts);
                await _context.SaveChangesAsync();
            }

            var file = uploadFileModel.File;
            await using var fileStream = file.OpenReadStream();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage(fileStream))
            {
                var worksheet = package.Workbook.Worksheets[0];
                var iRowCnt = worksheet.Dimension.End.Row;

                var sellerProducts = new List<SellerProduct>();

                for (var i = 2; i < iRowCnt; i++)
                {
                    var barcodeObj = worksheet.Cells[i, 1].Value;
                    var nameObj = worksheet.Cells[i, 2].Value;
                    var countObj = worksheet.Cells[i, 3].Value;
                    var priceObj = worksheet.Cells[i, 4].Value;

                    if (!decimal.TryParse(barcodeObj.ToString(), out var barcode))
                    {
                        continue;
                    }

                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Barcode == barcode);
                    if (product != null)
                    {
                        sellerProducts.Add(new SellerProduct() { ProductId = product.Id, UserId = thisUser.Id, Count = int.Parse(countObj.ToString() ?? "0"), Price = decimal.Parse(priceObj.ToString() ?? "0") });
                    }
                    else
                    {
                        // new product
                        var newProduct = new Product() { Barcode = barcode, Title = nameObj.ToString() };
                        await _context.Products.AddAsync(newProduct);
                        await _context.SaveChangesAsync();

                        sellerProducts.Add(new SellerProduct() { ProductId = newProduct.Id, UserId = thisUser.Id, Count = int.Parse(countObj.ToString() ?? "0"), Price = decimal.Parse(priceObj.ToString() ?? "0") });
                    }
                }

                await _context.SellerProducts.AddRangeAsync(sellerProducts);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    sellerProducts = sellerProducts
                        .Select(sp => new ClientSellerProduct() { ProductId = sp.ProductId ?? 0, Price = sp.Price, Count = sp.Count, ProductTitle = sp.Product.Title })
                });
            }
        }
    }
}
