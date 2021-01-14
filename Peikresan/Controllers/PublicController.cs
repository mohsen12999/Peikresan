using System.Linq;
using System.Threading.Tasks;
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
    public class PublicController : ControllerBase
    {

        private readonly ILogger<PublicController> _logger;
        private readonly ApplicationDbContext _context;
        // private readonly IMemoryCache _cache;

        // public PublicController(ILogger<PublicController> logger, ApplicationDbContext context, IMemoryCache cache)
        // {
        //     _logger = logger;
        //     _context = context;
        //     _cache = cache;
        // }

        public PublicController(ILogger<PublicController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await _context.Products
                // .Include(pr => pr.SellerProducts).Where(prd => prd.SellerCount > 0)
                .Select(p => new { p.Id, p.Title, p.Description, p.Price, p.Img, p.Max, p.Order, p.SoldByWeight, p.MinWeight, p.CategoryId })
                .ToListAsync();

            var categories = await _context.Categories
                .Select(c => new { c.Id, c.Title, c.Description, c.Img, c.ParentId, c.HaveChild, c.Order })
                .ToListAsync();

            var sliders = await _context.Sliders.ToListAsync();
            var banners = await _context.Banners.ToListAsync();


            int[] suggestions = products.OrderBy(el => el.Id).Select(o => o.Id).Take(10).ToArray();

            int[] newest = products.OrderByDescending(el => el.Id).Select(o => o.Id).Take(10).ToArray();

            var mostSell = await _context.OrderItems.Include(item => item.Order).Where(it => it.Order.OrderStatus >= OrderStatus.CustomerDelivered)
                .GroupBy(ite => ite.ProductId).Select(o => new { id = o.Key, count = o.Sum(el => el.Count) }).OrderByDescending(ele => ele.count)
                .Select(elem => elem.id ?? 0).Take(10).ToListAsync();
            if (mostSell == null || mostSell.Count == 0)
            {
                mostSell = products.OrderBy(el => el.Id).Select(o => o.Id).Take(10).ToList();
            }

            var times = new[]{
                new TimeModel(){Id=8,Time=8, Title="8-10"},
                new TimeModel(){Id=10,Time=10, Title="10-12"},
                new TimeModel(){Id=12,Time=12, Title="12-14"},
                new TimeModel(){Id=14,Time=14, Title="14-16"},

                new TimeModel(){Id=16,Time=16, Title="16-18"},
                new TimeModel(){Id=18,Time=18, Title="18-20"},
                new TimeModel(){Id=20,Time=20, Title="20-22"},
                new TimeModel(){Id=22,Time=22, Title="22-24"},
            };

            return Ok(new
            {
                products,
                categories,
                sliders,
                banners,
                suggestions,
                newest,
                mostSell,
                times,
                PriceService.MinimumCart,
                PriceService.DeliverPrice,
                PriceService.DeliverAtDoor
            });
        }

        // private async Task<JsonResult> PublicData()
        // {
        //     var products = await _context.Products.ToListAsync();
        //     var categories = await _context.Categories.ToListAsync();
        //     var sliders = await _context.Sliders.ToListAsync();
        //     var banners = await _context.Banners.ToListAsync();


        //     int[] suggestions = products.OrderBy(el => el.Id).Select(o => o.Id).Take(10).ToArray();

        //     int[] newest = products.OrderByDescending(el => el.Id).Select(o => o.Id).Take(10).ToArray();

        //     var mostSell = await _context.OrderItems.Include(item => item.Order).Where(it => it.Order.OrderStatus >= OrderStatus.CustomerDelivered)
        //         .GroupBy(ite => ite.ProductId).Select(o => new { id = o.Key, count = o.Sum(el => el.Count) }).OrderByDescending(ele => ele.count)
        //         .Select(elem => elem.id ?? 0).Take(10).ToListAsync();
        //     if (mostSell == null || mostSell.Count == 0)
        //     {
        //         mostSell = products.OrderBy(el => el.Id).Select(o => o.Id).Take(10).ToList();
        //     }

        //     var times = new[]{
        //         new TimeModel(){id=8, title="8-10"},
        //         new TimeModel(){id=10, title="10-12"},
        //         new TimeModel(){id=12, title="12-14"},
        //         new TimeModel(){id=14, title="14-16"},

        //         new TimeModel(){id=16, title="16-18"},
        //         new TimeModel(){id=18, title="18-20"},
        //         new TimeModel(){id=20, title="20-22"},
        //         new TimeModel(){id=22, title="22-24"},
        //     };

        //     return new JsonResult(new
        //     {
        //         products,
        //         categories,
        //         sliders,
        //         banners,
        //         suggestions,
        //         newest,
        //         mostSell,
        //         times,
        //         PriceService.MinimumCart,
        //         PriceService.DeliverPrice,
        //         PriceService.DeliverAtDoor
        //     });
        // }

        // [HttpGet]
        // [ResponseCache(Duration = 600)]
        // public async Task<IActionResult> Get()
        // {
        //     var cachePublicData = _cache.GetOrCreate("publicData", async entry =>
        //     {
        //         entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(3600);
        //         return await PublicData();
        //     });
        //     return Ok(await cachePublicData);
        // }
    }
}
