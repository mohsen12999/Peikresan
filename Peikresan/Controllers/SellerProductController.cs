using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Peikresan.Data;
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
                        eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                        {
                            UserId = thisUser.Id.ToString(),
                            EventLogModel = EventLogModel.SellerProduct,
                            EventLogType = EventLogType.Insert,
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
                    return NotFound("Slider not Found: " + sellerProductModel.id);
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
                        eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                        {
                            UserId = thisUser.Id.ToString(),
                            EventLogModel = EventLogModel.SellerProduct,
                            EventLogType = EventLogType.Update,
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
                    eventId = await EventLogServices.SaveEventLog(_context, new EventLog
                    {
                        UserId = thisUser.Id.ToString(),
                        EventLogModel = EventLogModel.SellerProduct,
                        EventLogType = EventLogType.Delete,
                        Description = "Delete SellerProduct" + id
                    })
                });
            }
            catch (Exception)
            {
                return BadRequest("can not remove sellerProduct");
            }
        }
    }
}