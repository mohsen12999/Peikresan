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
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ILogger<OrderController> _logger;
        private readonly ApplicationDbContext _context;

        public OrderController(ILogger<OrderController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Authorize]
        [HttpPost("choose-seller")]
        public async Task<IActionResult> ChooseSellerAsync([FromBody] ChooseUser chooseUser)
        {
            var thisUser = await _context.Users
                .Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove Category");
            }

            var seller = await _context.Users
                .Include(u => u.Role).FirstAsync(us => us.Id == Guid.Parse(chooseUser.userId));
            if (seller == null)
            {
                return BadRequest("Can not find user");
            }

            //if(seller.Role==null || seller.Role.Name.ToLower() != "seller")
            //{
            //    return BadRequest("user is not seller");
            //}

            var order = await _context.Orders
                .Where(ord => ord.Id == chooseUser.orderId).Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }

            if (order.OrderStatus != OrderStatus.Verified && order.OrderStatus != OrderStatus.SellerDeny)
            {
                return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
            }

            order.Seller = seller;
            order.OrderStatus = OrderStatus.AssignToSeller;
            order.AssignToSellerDateTime = DateTime.Now;

            try
            {
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    element= order,
                    order,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "AssignToSeller " + seller.FullName,
                        UserId = seller.Id.ToString()
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        [Authorize]
        [HttpPost("seller-answer")]
        public async Task<IActionResult> AcceptSellerAsync([FromBody] AnswerModel answerModel)
        {
            // var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            //if (this_user.Role == null || this_user.Role.Name.ToLower() != "seller")
            //{
            //    return Unauthorized("Only Seller Can Remove Category");
            //}
            var order = await _context.Orders
                .Where(ord => ord.Id == answerModel.orderId).Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }

            if (order.OrderStatus != OrderStatus.AssignToSeller)
            {
                return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
            }

            if (answerModel.answer)
            {
                order.OrderStatus = OrderStatus.SellerAccepted;
                order.SellerAcceptedDateTime = DateTime.Now;
            }
            else
            {
                order.OrderStatus = OrderStatus.SellerDeny;
            }

            try
            {
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    order,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "SellerDeny",
                        UserId = ""
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        [Authorize]
        [HttpPost("choose-deliver")]
        public async Task<IActionResult> ChooseDeliverAsync([FromBody] ChooseUser chooseUser)
        {
            var thisUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove Category");
            }

            var deliver = await _context.Users
                .Include(u => u.Role).FirstAsync(us => us.Id == Guid.Parse(chooseUser.userId));

            if (deliver == null)
            {
                return BadRequest("Can not find user");
            }

            //if(deliver.Role==null || deliver.Role.Name.ToLower() != "deliver")
            //{
            //    return BadRequest("user is not seller");
            //}
            var order = await _context.Orders
                .Where(ord => ord.Id == chooseUser.orderId).Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }

            if (order.OrderStatus != OrderStatus.SellerAccepted && order.OrderStatus != OrderStatus.DeliverDeny)
            {
                return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
            }

            order.Deliver = deliver;
            order.OrderStatus = OrderStatus.AssignToDeliver;
            order.AssignToDeliverDateTime = DateTime.Now;

            try
            {
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    order,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "AssignToDeliver " + deliver.FullName,
                        UserId = deliver.Id.ToString()
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        [Authorize]
        [HttpPost("deliver-answer")]
        public async Task<IActionResult> AcceptDeliverAsync([FromBody] AnswerModel answerModel)
        {
            // var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            //if (this_user.Role == null || this_user.Role.Name.ToLower() != "deliver")
            //{
            //    return Unauthorized("Only Deliver Can Remove Category");
            //}
            var order = await _context.Orders
                .Where(ord => ord.Id == answerModel.orderId).Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }

            if (order.OrderStatus != OrderStatus.AssignToDeliver)
            {
                return BadRequest("Can not chooser " + order.OrderStatus + " - " + order.OrderStatusDescription);
            }

            if (answerModel.answer)
            {
                order.OrderStatus = OrderStatus.DeliverAccepted;
                order.DeliverAcceptedDateTime = DateTime.Now;
            }
            else
            {
                order.OrderStatus = OrderStatus.DeliverDeny;
            }

            try
            {
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    order,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "DeliverDeny",
                        UserId = ""
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        [Authorize]
        [HttpPost("get-product")]
        public async Task<IActionResult> GetProductAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var orderId = Convert.ToInt32(justId.id);
            var order = await _context.Orders
                .Where(ord => ord.Id == orderId)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }
            if (order.Deliver != thisUser)
            {
                return Unauthorized("wrong user! " + order.Deliver.Id + " != " + thisUser.Id);
            }

            order.OrderStatus = OrderStatus.DeliveryGetProduct;
            order.DeliverGetProductDateTime = DateTime.Now;

            try
            {
                _context.Orders.Update(order);

                await _context.SaveChangesAsync();
                return Ok(new
                {
                    order,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "DeliveryGetProduct",
                        UserId = ""
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        [Authorize]
        [HttpPost("deliver-product")]
        public async Task<IActionResult> DeliverProductAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var orderId = Convert.ToInt32(justId.id);
            var order = await _context.Orders
                .Where(ord => ord.Id == orderId)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return BadRequest("Can not find order");
            }
            if (order.Deliver != thisUser)
            {
                return Unauthorized("wrong user! " + order.Deliver.Id + " != " + thisUser.Id);
            }

            order.OrderStatus = OrderStatus.DeliveredProduct;
            order.DeliveredProductDateTime = DateTime.Now;

            try
            {
                _context.Orders.Update(order);

                await _context.SaveChangesAsync();
                return Ok(new
                {
                    order,
                    success = true,
                    EventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        WebsiteModel = WebsiteModel.Order,
                        WebsiteEventType = WebsiteEventType.Update,
                        ObjectId = order.Id,
                        Description = "DeliveredProduct",
                        UserId = ""
                    })
                });
            }
            catch (Exception e)
            {
                return BadRequest("error in save order " + e.Message);
            }
        }

        //[Authorize]
        //[HttpPost("customer-delivered")]

        //[Authorize]
        //[HttpPost("customer-vote")]

    }
}
