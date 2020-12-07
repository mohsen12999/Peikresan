using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Peikresan.Models;
using Peikresan.services;
using Peikresan.Models.ViewModels;

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
                Name = cartModel.Name,
                State = cartModel.State,
                City = cartModel.City,
                Description = cartModel.Description,
                Mobile = cartModel.Mobile,
                Level = cartModel.Level,
                Number = cartModel.Number,
                Unit = cartModel.Unit,
                PostalCode = cartModel.PostalCode,

                // time
                Day = cartModel.Day,
                Time = cartModel.Time,
                Value = cartModel.Value,
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
            var orderItemList = new List<OrderItem>();
            foreach (var item in cartModel.ShopCart)
            {
                var productId = item.Key;
                var product = await _context.Products.FindAsync(productId);
                if (product != null && item.Value > 0)
                {
                    var orderItem = new OrderItem() { Order = order, Product = product, Title = product.Title, Price = product.Price, Count = item.Value };
                    orderItemList.Add(orderItem);
                }
            }

            try
            {
                await _context.OrderItems.AddRangeAsync(orderItemList);
                order.TotalPrice = PriceService.CalculatePrice(orderItemList, order.DeliverAtDoor);
                _context.Orders.Update(order);
                await _context.EventLogs.AddAsync(new EventLog()
                {
                    EventLogModel = EventLogModel.Order, EventLogType = EventLogType.Insert,
                    Description = "make order with " + orderItemList.Count + " item", ObjectId = order.Id, UserId = ""
                });
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                BadRequest("error in save order " + e.Message);
            }


            // Connect to bank
            return await GetTokenFromSepehr(order.Id);

            // Send Url
            // return Ok(new { order,orderItemlist});
        }

        private async Task<IActionResult> GetTokenFromSepehr(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            using (var client = new HttpClient())
            {
                // client.BaseAddress = new Uri(_sepehrUrl);
                var dataAsString = JsonConvert.SerializeObject(new { Amount = order.TotalPrice * 10, invoiceID = orderId, terminalID = SepehrTid, callbackURL = CallbackUrl });
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
        }


        /*
        private async Task<IActionResult> VerifyToSepehr(int orderId)
        {
            var order = _context.Orders.Find(orderId);
            using (var client = new HttpClient())
            {
                var dataAsString = JsonConvert.SerializeObject(new { digitalreceipt = "", Tid = _sepehrTID });
                var dataContent = new StringContent(dataAsString, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(_sepehrAdviceUrl, dataContent);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var resultContent = JsonConvert.DeserializeObject<Dictionary<string, object>>(content);
                    var status = (resultContent)["Status"].ToString();
                    if (status == "OK")
                    {
                        try
                        {
                            order.VerifyStatus = status;
                            order.VerifyReturnId = (resultContent)["ReturnId"].ToString();
                            order.VerifyMessage = (resultContent)["Message"].ToString();
                            await _context.SaveChangesAsync();

                            return Ok(new { resultContent });
                        }
                        catch (Exception)
                        {
                            return BadRequest("Can not find data " + content);
                        }
                    }
                }
                else
                {
                    return BadRequest("bank error: " + response.StatusCode);
                }
            }
            return BadRequest("bank ");
        }
        */

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

            using (var client = new HttpClient())
            {
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

                    return Redirect("/comeback/" + order.Id + "/?return_id=" + order.VerifyReturnId + "&message=" + order.VerifyMessage + "&trace_number=" + order.Tracenumber);
                }
                catch (Exception ex)
                {

                    return Redirect("/comeback/0/?error=save_order_after_advice&msg=" + ex.Message);
                }
            }

        }

        // public static async Task<(int, string, string)> Verification(string token)
        // {
        //     using (var client = new HttpClient())
        //     {
        //         client.BaseAddress = new Uri("https://pay.ir/");
        //         var verifyParam = new VerifyParam { api = _api, token = token };
        //         var dataAsString = JsonConvert.SerializeObject(verifyParam);
        //         var dataContent = new StringContent(dataAsString, Encoding.UTF8, "application/json");
        //         var postTask = client.PostAsync("pg/verify", dataContent);
        //         HttpResponseMessage postResult;
        //         try
        //         {
        //             postResult = await postTask;
        //         }
        //         catch (Exception)
        //         {
        //             return (-202, "", "");
        //         }

        //         if (postResult.IsSuccessStatusCode)
        //         {
        //             var content = postResult.Content.ReadAsStringAsync().Result;
        //             var resultContent = JsonConvert.DeserializeObject<Dictionary<string, object>>(content);
        //             var status = int.Parse((resultContent)["status"].ToString());
        //             if (status == 1)
        //             {
        //                 return (100, (resultContent)["transId"].ToString(), (resultContent)["factorNumber"].ToString());
        //             }
        //             if (status <= 0)
        //             {
        //                 return (0, (resultContent)["errorMessage"].ToString(), "");
        //             }
        //         }

        //         return (-101, "", "");
        //     }

        // }
    }
}
