using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Peikresan.Data;
using Peikresan.Data.Models;
using Peikresan.Data.ViewModels;
using Peikresan.Services;

namespace Peikresan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BankController : ControllerBase
    {
        private const string SepehrUrl = "https://mabna.shaparak.ir:8081/V1/PeymentApi/GetToken";
        private const string SepehrAdviceUrl = "https://mabna.shaparak.ir:8081/V1/PeymentApi/Advice";
        // private static string _sepehrMID = "693427549900325";
        private const string SepehrTid = "69006159";
        private const string SepehrPayUrl = "https://mabna.shaparak.ir:8080/Pay";
        private const string CallbackUrl = "https://www.peikresan.com/api/bank/";

        private readonly ILogger<BankController> _logger;
        private readonly ApplicationDbContext _context;

        public BankController(ILogger<BankController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Bank controller");
        }

        [HttpPost("save-cart")]
        public async Task<IActionResult> SaveCartAndGetUrl([FromBody] CartModel cartModel)
        {
            if (cartModel.ShopCart == null || cartModel.ShopCart.Count == 0)
            {
                return BadRequest("Empty shop cart");
            }

            // Save Order
            var order = new Order()
            {
                Name = cartModel.Address.Name,
                State = cartModel.Address.State,
                City = cartModel.Address.City,
                FormattedAddress = cartModel.Address.FormattedAddress,
                Description = cartModel.Address.Description,
                Mobile = cartModel.Address.Mobile,
                Latitude = cartModel.Address.Latitude,
                Longitude = cartModel.Address.Longitude,


                // time

                DeliverTimeId = cartModel.DeliverTime.Id,
                DeliverTime = cartModel.DeliverTime.Time,
                DeliverTimeTitle = cartModel.DeliverTime.Title,
                DeliverDay = cartModel.DeliverTime.DeliverDay,

                DeliverAtDoor = cartModel.DeliverAtDoor
            };

            try
            {
                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                BadRequest("error in save order " + e.Message);
            }

            // Save Order Item
            var orderItemList = cartModel.ShopCart.Select(item => new OrderItem()
            {
                Order = order,
                ProductId = item.Id,
                Count = item.Count,
                Title = item.Title,
                Price = item.Price
            })
                .ToList();

            try
            {
                await _context.OrderItems.AddRangeAsync(orderItemList);
                order.TotalPrice = PriceServices.CalculatePrice(orderItemList, order.DeliverAtDoor, order.DeliverDay == "EXPRESS");
                _context.Orders.Update(order);
                await _context.WebsiteLog.AddAsync(new WebsiteLog()
                {
                    WebsiteModel = WebsiteModel.Order,
                    WebsiteEventType = WebsiteEventType.Insert,
                    Description = "make order with " + orderItemList.Count + " item",
                    ObjectId = order.Id,
                    UserId = ""
                });
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                BadRequest("error in save order " + e.Message);
            }


            // Connect to bank

            // var order = await _context.Orders.FindAsync(orderId);
            using var client = new HttpClient();
            // client.BaseAddress = new Uri(_sepehrUrl);
            var dataAsString = JsonConvert.SerializeObject(new { Amount = order.TotalPrice * 10, invoiceID = order.Id, terminalID = SepehrTid, callbackURL = CallbackUrl });
            var dataContent = new StringContent(dataAsString, Encoding.UTF8, "application/json");
            try
            {
                var response = await client.PostAsync(SepehrUrl, dataContent);

                if (!response.IsSuccessStatusCode)
                {
                    return BadRequest("bank error: " + response.StatusCode);
                }

                var content = await response.Content.ReadAsStringAsync();
                var resultContent = JsonConvert.DeserializeObject<Dictionary<string, object>>(content);
                var status = (resultContent)["Status"].ToString();
                if (status != "0")
                {
                    return BadRequest("bank error status: " + status);
                }

                try
                {
                    var token = (resultContent)["Accesstoken"].ToString();
                    return Ok(new { success = true, order, token, tid = SepehrTid, url = SepehrPayUrl });
                }
                catch (Exception)
                {
                    return BadRequest("Can not find AccessToken " + content);
                }
            }
            catch (Exception e)
            {
                return BadRequest("bank error in Exception " + e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ComeFromBankAsync([FromForm] ComeBackResponse comeBackResponse)
        {
            if (comeBackResponse.respcode != 0)
            {
                return Redirect("/comeback/0/?error=respcode&code=" + comeBackResponse.respcode);
            }
            var order = await _context.Orders.FindAsync(int.Parse(comeBackResponse.invoiceid.Trim()));
            if (order == null)
            {
                return Redirect("/comeback/0/?error=order_not_find");
            }

            try
            {
                order.Respcode = comeBackResponse.respcode ?? 0;
                order.Respmsg = comeBackResponse.respmsg;
                order.Amount = comeBackResponse.amount ?? 0;
                order.InvoiceId = comeBackResponse.invoiceid;
                order.Payload = comeBackResponse.payload;
                order.Terminalid = comeBackResponse.terminalid ?? 0;
                order.Tracenumber = comeBackResponse.tracenumber ?? 0;
                order.RRN = comeBackResponse.rrn ?? 0;
                order.DatePaid = comeBackResponse.datePaid;
                order.DigitalReceipt = comeBackResponse.digitalreceipt;
                order.IssuerBank = comeBackResponse.issuerbank;
                order.CardNumber = comeBackResponse.cardnumber;

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return Redirect("/comeback/0/?error=save_order_before_advice&msg=" + ex.Message);
            }

            using var client = new HttpClient();

            var dataAsString = JsonConvert.SerializeObject(new { comeBackResponse.digitalreceipt, Tid = SepehrTid });
            var dataContent = new StringContent(dataAsString, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(SepehrAdviceUrl, dataContent);

            if (!response.IsSuccessStatusCode)
            {
                return Redirect("/comeback/0/?error=responseNotSuccess&StatusCode=" + response.StatusCode);
            }

            var content = await response.Content.ReadAsStringAsync();
            var resultContent = JsonConvert.DeserializeObject<Dictionary<string, object>>(content);
            var status = (resultContent)["Status"].ToString();

            if (status == null || status.ToLower() != "ok")
            {
                return Redirect("/comeback/0/?error=status_ok," + status + ", content" + content + ", respcode: " + order.Respcode + "_" + order.Respmsg);
            }

            try
            {
                order.VerifyStatus = status;
                order.VerifyReturnId = (resultContent)["ReturnId"].ToString();
                order.VerifyMessage = (resultContent)["Message"].ToString();

                order.OrderStatus = OrderStatus.Verified;
                order.VerifiedDateTime = DateTime.Now;

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                var suborders = await UserServices.FindSeller(_context, order.Id);

                // Find Deliver
                var deliver = await UserServices.ClosestUser(_context, order.Latitude, order.Longitude, "Delivery");

                if (deliver != null)
                    order.Deliver = deliver;

                //_context.Orders.Update(order);
                //await _context.SaveChangesAsync();

                // order.Sms2Customer = SmsServices.FastSms2CostumerAfterBuy(order.Mobile, order.Id);
                order.Sms2Customer = SmsServices.FastSms2CostumerAfterBuy("09116310982",order.Name, order.Id);
                order.Sms2Admin = SmsServices.FastSms2AdminAfterBuy(order.Id, (int)order.TotalPrice);
                // order.Sms2Delivery = SmsServices.FastSms2DeliveryAfterBuy(deliver.Mobile, order.Id);
                order.Sms2Delivery = SmsServices.FastSms2DeliveryAfterBuy("09116310982", order.Id,Helper.OrderDeliverTime(order));

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                foreach (var suborder in suborders)
                {
                    // var user = await _context.Users.FindAsync(suborder.SellerId);
                    // suborder.Sms2Seller = SmsServices.FastSms2SellerAfterBuy(user.Mobile, suborder.Id);
                    suborder.Sms2Seller = SmsServices.FastSms2SellerAfterBuy("09116310982", suborder.Id, Helper.OrderDeliverTime(order));
                }
                _context.SubOrders.UpdateRange(suborders);
                await _context.SaveChangesAsync();

                return Redirect("/comeback/" + order.Id + "/?return_id=" + order.VerifyReturnId + "&message=" + order.VerifyMessage + "&trace_number=" + order.Tracenumber);
            }
            catch (Exception ex)
            {

                return Redirect("/comeback/0/?error=save_order_after_advice&msg=" + ex.Message);
            }
        }

        // Fake confirm for last order
        //[HttpGet("fake-confirm")]
        //public async Task<IActionResult> FakeConfirm()
        //{
        //    var order = await _context.Orders.OrderBy(or => or.Id).LastAsync();
        //    await UserServices.FindSeller(_context, order.Id);


        //    var suborders = await UserServices.FindSeller(_context, order.Id);

        //    // Find Deliver
        //    var deliver = await UserServices.ClosestUser(_context, order.Latitude, order.Longitude, "Delivery");

        //    if (deliver != null)
        //        order.Deliver = deliver;

        //    //_context.Orders.Update(order);
        //    //await _context.SaveChangesAsync();

        //    order.Sms2Admin = SmsServices.FastSms2AdminAfterBuy(order.Id, (int)order.TotalPrice);
        //    // order.Sms2Customer = SmsServices.FastSms2CostumerAfterBuy(order.Mobile, order.Id);
        //    order.Sms2Customer = SmsServices.FastSms2CostumerAfterBuy("09116310982", order.Id);
        //    // order.Sms2Delivery = SmsServices.FastSms2DeliveryAfterBuy(deliver.Mobile, order.Id);
        //    order.Sms2Delivery = SmsServices.FastSms2DeliveryAfterBuy("09116310982", order.Id);

        //    _context.Orders.Update(order);
        //    await _context.SaveChangesAsync();

        //    foreach (var suborder in suborders)
        //    {
        //        var user = await _context.Users.FindAsync(suborder.SellerId);
        //        // suborder.Sms2Seller = SmsServices.FastSms2SellerAfterBuy(user.Mobile, suborder.Id);
        //        suborder.Sms2Seller = SmsServices.FastSms2SellerAfterBuy("09116310982", suborder.Id);
        //    }
        //    _context.SubOrders.UpdateRange(suborders);
        //    await _context.SaveChangesAsync();

        //    return Redirect("/comeback/" + order.Id + "/?return_id=" + order.VerifyReturnId + "&message=" + order.VerifyMessage + "&trace_number=" + order.Tracenumber);
        //}
    }
}

/*
 * private static async Task<bool> FindingSeller(ApplicationDbContext context, List<OrderItem> orderItems, int orderId, List<Guid> denyUsers)
        {
            var order = await context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId);
            var districtId = order.DistrictId;

            // local markets
            var localSellerList = orderItems
                .SelectMany(oi => oi.Product.SellerProducts)
                .Where(spd => spd.User.DistrictId == districtId && denyUsers.All(du => du != spd.User.Id))
                // .Where(spd => spd.User.DistrictId == districtId && denyUsers.All(du => du != spd.User.Id) && spd.User.UserStatus == UserStatus.Active)
                .Select(sp => sp.UserId);

            if (localSellerList.Any())
            {
                var localSellers = localSellerList
                    .GroupBy(s => s)
                    .Select(id => new { id = id.Key, count = id.Count() }).OrderByDescending(el => el.count)
                    .ToList();

                var firstSeller = localSellers.First();
                if (firstSeller.count == orderItems.Count) // a local market with all product
                {
                    // find the answer: 1 local
                    var subOrder = new SubOrder() { OrderId = orderId, SellerId = firstSeller.id };
                    await context.SubOrders.AddAsync(subOrder);
                    orderItems = orderItems.Select(oi =>
                    {
                        oi.SubOrder = subOrder;
                        return oi;
                    }).ToList();
                    context.OrderItems.UpdateRange(orderItems);

                    order.OrderStatus = OrderStatus.AssignToSeller;
                    context.Orders.Update(order);

                    await context.SaveChangesAsync();
                    return true;
                }

                // try to find second local market
                var remainItem = orderItems
                    .Where(oi => oi.Product.SellerProducts.All(sp => sp.UserId != firstSeller.id))
                    .ToList();
                var remainItemSellerList = remainItem
                    .SelectMany(oi => oi.Product.SellerProducts)
                    .Where(spd => spd.User.DistrictId == districtId && denyUsers.All(du => du != spd.User.Id))
                    // .Where(spd => spd.User.DistrictId == districtId && denyUsers.All(du => du != spd.User.Id) && spd.User.UserStatus == UserStatus.Active)
                    .Select(sp => sp.UserId);
                var remainItemSeller = remainItemSellerList
                    .GroupBy(s => s).Select(id => new { id = id.Key, count = id.Count() })
                    .OrderByDescending(el => el.count)
                    .ToList();
                var secondSeller = remainItemSeller.First();
                if (secondSeller.count == remainItem.Count)
                {
                    // find the answer: 2 local
                    var firstSubOrder = new SubOrder() { OrderId = order.Id, SellerId = firstSeller.id };
                    var secondSubOrder = new SubOrder() { OrderId = order.Id, SellerId = secondSeller.id };
                    await context.SubOrders.AddRangeAsync(firstSubOrder, secondSubOrder);
                    orderItems = orderItems.Select(oi =>
                    {
                        oi.SubOrder = oi.Product.SellerProducts.Any(sp => sp.UserId == firstSeller.id) ?
                            firstSubOrder : secondSubOrder;
                        return oi;
                    }).ToList();
                    context.OrderItems.UpdateRange(orderItems);

                    order.OrderStatus = OrderStatus.AssignToSeller;
                    context.Orders.Update(order);

                    await context.SaveChangesAsync();
                    return true;
                }
            }

            // all market
            var allSellerList = orderItems
                .SelectMany(oi => oi.Product.SellerProducts)
                .Where(spd => denyUsers.All(du => du != spd.User.Id))
                // .Where(spd => denyUsers.All(du => du != spd.User.Id) && spd.User.UserStatus == UserStatus.Active)
                .Select(sp => sp.UserId);
            var allSellers = allSellerList.GroupBy(s => s).Select(id => new { id = id.Key, count = id.Count() }).OrderByDescending(el => el.count).ToList();

            var firstSeller2 = allSellers.First();
            if (firstSeller2.count == orderItems.Count) // a local market with all product
            {
                // find the answer: 1 all
                var subOrder = new SubOrder() { OrderId = order.Id, SellerId = firstSeller2.id };
                await context.SubOrders.AddAsync(subOrder);
                orderItems = orderItems.Select(oi =>
                {
                    oi.SubOrder = subOrder;
                    return oi;
                }).ToList();
                context.OrderItems.UpdateRange(orderItems);

                order.OrderStatus = OrderStatus.AssignToSeller;
                context.Orders.Update(order);

                await context.SaveChangesAsync();
                return true;
            }

            // try to find second market
            var remainItem2 = orderItems
                .Where(oi => oi.Product.SellerProducts.All(sp => sp.UserId != firstSeller2.id))
                .ToList();
            var remainItemSellerList2 = remainItem2
                .SelectMany(oi => oi.Product.SellerProducts)
                .Where(spd => denyUsers.All(du => du != spd.User.Id))
                // .Where(spd => denyUsers.All(du => du != spd.User.Id) && spd.User.UserStatus == UserStatus.Active)
                .Select(sp => sp.UserId);

            var remainItemSeller2 = remainItemSellerList2.GroupBy(s => s).Select(id => new { id = id.Key, count = id.Count() }).OrderByDescending(el => el.count).ToList();
            var secondSeller2 = remainItemSeller2.First();

            if (secondSeller2.count == remainItem2.Count)
            {
                // find the answer: 2 all
                var firstSubOrder = new SubOrder() { OrderId = order.Id, SellerId = firstSeller2.id };
                var secondSubOrder = new SubOrder() { OrderId = order.Id, SellerId = secondSeller2.id };
                await context.SubOrders.AddRangeAsync(firstSubOrder, secondSubOrder);
                orderItems = orderItems.Select(oi =>
                {
                    oi.SubOrder = oi.Product.SellerProducts.Any(sp => sp.UserId == firstSeller2.id) ?
                        firstSubOrder : secondSubOrder;
                    return oi;
                }).ToList();
                context.OrderItems.UpdateRange(orderItems);

                order.OrderStatus = OrderStatus.AssignToSeller;
                context.Orders.Update(order);

                await context.SaveChangesAsync();
                return true;
            }

            return false;
        }
 */
