using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using Microsoft.Extensions.Logging;
using Peikresan.Data;
using Peikresan.Data.Dto;
using Peikresan.Data.Models;
using Peikresan.Data.ViewModels;
using Peikresan.Services;

namespace Peikresan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger, ApplicationDbContext context, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _context = context;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.Role?.Name??""),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_configuration.GetSection("JWT:SecretKey").Value));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(3),
                SigningCredentials = credentials,
                Issuer = _configuration.GetSection("Jwt:Issuer").Value,
                Audience = _configuration.GetSection("Jwt:Audience").Value,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private async Task<IActionResult> AdminAccessData(User thisUser, string tokenString)
        {
            var users = await UserServices.GetAllUsers(_context);

            var roles = await _context.Roles
                .ToListAsync();

            var orders = await _context.Orders
                .Where(or => or.OrderStatus != OrderStatus.Init)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Deliver)
                .OrderByDescending(ord => ord.Id)
                .Select(order => order.ToDto())
                .AsNoTracking()
                .ToListAsync();

            orders = orders.Select(ord =>
            {
                ord.InitDateTimeString = ord.InitDateTime.ToJalali();
                return ord;

            }).ToList();

            var subOrders = await _context.SubOrders
                .Include(so => so.SubOrderItems)
                .Include(so => so.Seller)
                .Select(so => new SubOrderDto()
                {
                    Id = so.Id,
                    SellerId = so.SellerId,
                    SellerName = so.Seller.FullName,
                    SellerAddress = so.Seller.Address,
                    RequestStatus = (int)so.RequestStatus,
                    OrderId = so.OrderId,
                    Items = so.SubOrderItems.Select(soi => new OrderItemDto()
                    {
                        Id = soi.Id,
                        Count = soi.Count,
                        ProductId = soi.ProductId,
                        Product = soi.Product.Title,
                        Price = soi.Price,
                        Title = soi.Title
                    }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();

            var products = await _context.Products
                .Include(p => p.Category)
                .Select(p => p.ToDto())
                .AsNoTracking()
                .ToListAsync();

            var categories = await _context.Categories.AsNoTracking().ToListAsync();
            var banners = await _context.Banners.AsNoTracking().ToListAsync();
            var sliders = await _context.Sliders.AsNoTracking().ToListAsync();
            var comments = await CommentServices.GetAllComments(_context);

            return Ok(new
            {
                success = true,
                msg = "Logging successfully",
                token = tokenString,
                id = thisUser.Id,
                username = thisUser.UserName,
                role = thisUser.Role?.Name ?? "",
                users,
                roles,
                orders,
                subOrders,
                products,
                categories,
                banners,
                sliders,
                comments,
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.User,
                    WebsiteEventType = WebsiteEventType.Logging,
                    Description = "logging admin " + thisUser.FullName
                })
            });
        }

        private async Task<IActionResult> SellerAccessData(User thisUser, string tokenString)
        {
            var sellerProducts = await _context.SellerProducts
                .Where(sp => sp.UserId == thisUser.Id)
                .Include(sp => sp.Product)
                .Select(sp => new SellerProductDto() { ProductId = sp.ProductId ?? 0, Price = sp.Price, Count = sp.Count, ProductTitle = sp.Product.Title, ProductBarcode = sp.Product.Barcode })
                .ToListAsync();

            var subOrders = await _context.SubOrders
                .Where(so => so.SellerId == thisUser.Id)
                .Include(so => so.SubOrderItems)
                .Include(so => so.Seller)
                .Select(so => new SubOrderDto()
                {
                    Id = so.Id,
                    SellerId = so.SellerId,
                    SellerName = so.Seller.FullName,
                    SellerAddress = so.Seller.Address,
                    RequestStatus = (int)so.RequestStatus,
                    OrderId = so.OrderId,
                    Items = so.SubOrderItems.Select(soi => new OrderItemDto()
                    {
                        Id = soi.Id,
                        Count = soi.Count,
                        ProductId = soi.ProductId,
                        Product = soi.Product.Title,
                        Price = soi.Price,
                        Title = soi.Title
                    }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(new
            {
                success = true,
                msg = "Logging successfully",
                token = tokenString,
                id = thisUser.Id,
                userName = thisUser.UserName,
                role = thisUser.Role?.Name ?? "",
                subOrders,
                sellerProducts,
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.User,
                    WebsiteEventType = WebsiteEventType.Logging,
                    Description = "logging user " + thisUser.FullName
                })
            });
        }

        private async Task<IActionResult> DeliveryAccessData(User thisUser, string tokenString)
        {
            var orders = await _context.Orders
                .Where(ord => ord.DeliverId == thisUser.Id)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Deliver)
                .OrderByDescending(ord => ord.Id)
                .Select(order => order.ToDto())
                .AsNoTracking()
                .ToListAsync();

            orders = orders.Select(ord =>
            {
                ord.InitDateTimeString = ord.InitDateTime.ToJalali();
                return ord;

            }).ToList();

            var subOrders = await _context.SubOrders
                .Include(so => so.Order)
                .Where(so => so.Order.DeliverId == thisUser.Id)
                .Include(so => so.SubOrderItems)
                .Include(so => so.Seller)
                .Select(so => new SubOrderDto()
                {
                    Id = so.Id,
                    SellerId = so.SellerId,
                    SellerName = so.Seller.FullName,
                    SellerAddress = so.Seller.Address,
                    RequestStatus = (int)so.RequestStatus,
                    OrderId = so.OrderId,
                    Items = so.SubOrderItems.Select(soi => new OrderItemDto()
                    {
                        Id = soi.Id,
                        Count = soi.Count,
                        ProductId = soi.ProductId,
                        Product = soi.Product.Title,
                        Price = soi.Price,
                        Title = soi.Title
                    }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(new
            {
                success = true,
                msg = "Logging successfully",
                token = tokenString,
                id = thisUser.Id,
                userName = thisUser.UserName,
                role = thisUser.Role?.Name ?? "",
                orders,
                subOrders,
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.User,
                    WebsiteEventType = WebsiteEventType.Logging,
                    Description = "logging user " + thisUser.FullName
                })
            });
        }

        private async Task<IActionResult> AccessData(User thisUser)
        {
            var tokenString = GenerateJwtToken(thisUser);
            if (thisUser.Role != null && thisUser.Role.Name.ToLower() == "admin")
            {
                return await AdminAccessData(thisUser, tokenString);
            }

            if (thisUser.Role != null && thisUser.Role.Name.ToLower() == "seller")
            {
                return await SellerAccessData(thisUser, tokenString);
            }

            if (thisUser.Role != null && thisUser.Role.Name.ToLower() == "delivery")
            {
                return await DeliveryAccessData(thisUser, tokenString);
            }

            return Ok(new
            {
                success = true,
                msg = "Logging successfully",
                token = tokenString,
                id = thisUser.Id,
                userName = thisUser.UserName,
                role = thisUser.Role?.Name ?? "",
                eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                {
                    UserId = thisUser.Id.ToString(),
                    WebsiteModel = WebsiteModel.User,
                    WebsiteEventType = WebsiteEventType.Logging,
                    Description = "logging user " + thisUser.FullName
                })
            });
        }



        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel loginModel)
        {
            var thisUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == loginModel.Username || u.Email == loginModel.Username); //await _context.Users.FirstOrDefaultAsync(x => x.Username.ToLower().Equals(username.ToLower()));

            if (thisUser == null)
            {
                return NotFound("This user not found");
            }

            var passwordHasher = new PasswordHasher<User>();

            if (passwordHasher.VerifyHashedPassword(thisUser, thisUser.PasswordHash, loginModel.Password) !=
                PasswordVerificationResult.Success)
            {
                return Unauthorized("Wrong Username or Password");
            }

            return await AccessData(thisUser);
        }

        [Authorize]
        [HttpPost("access")]
        public async Task<IActionResult> Access()
        {
            var thisUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            return await AccessData(thisUser);
        }

        //[AllowAnonymous]
        //[HttpPost("register")]
        //public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel registerModel)
        //{
        //    try
        //    {
        //        var user = new User() { UserName = registerModel.Username, Email = registerModel.Email };
        //        var role = await _context.Roles.Where(r => r.Id.ToString() == registerModel.RoleId.Trim()).FirstAsync();
        //        if (role != null) user.Role = role;

        //        if (string.IsNullOrEmpty(registerModel.FirstName) == false && registerModel.FirstName.ToLower() != "undefined")
        //        {
        //            user.FirstName = registerModel.FirstName.Trim();
        //        }
        //        if (string.IsNullOrEmpty(registerModel.LastName) == false && registerModel.LastName.ToLower() != "undefined")
        //        {
        //            user.LastName = registerModel.LastName.Trim();
        //        }
        //        if (string.IsNullOrEmpty(registerModel.Mobile) == false && registerModel.Mobile.ToLower() != "undefined")
        //        {
        //            user.Mobile = registerModel.Mobile.Trim();
        //        }
        //        if (string.IsNullOrEmpty(registerModel.Address) == false && registerModel.Address.ToLower() != "undefined")
        //        {
        //            user.Address = registerModel.Address.Trim();
        //        }

        //        var passwordHasher = new PasswordHasher<User>();
        //        var passwordHash = passwordHasher.HashPassword(user, registerModel.Password);
        //        user.PasswordHash = passwordHash;

        //        await _context.Users.AddAsync(user);
        //        await _context.SaveChangesAsync();

        //        var tokenString = GenerateJwtToken(user);

        //        return Ok(new
        //        {
        //            token = tokenString,
        //            userDetails = user,
        //            eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
        //            {
        //                UserId = user.Id.ToString(),
        //                WebsiteModel = WebsiteModel.User,
        //                WebsiteEventType = WebsiteEventType.Insert,
        //                Description = "add user " + user.FullName
        //            })
        //        });
        //    }
        //    catch
        //    {
        //        return BadRequest();
        //    }
        //}

        //[Authorize("Admin")]
        //[HttpPost("admin-access")]
        //public IActionResult AdminAccess()
        //{
        //    return Ok(new { success = true, msg = "admin access granted" });
        //}

        //[HttpGet("fake-rename")]
        //public async Task<IActionResult> RenameUser()
        //{
        //    var users = await _context.Users
        //        .Where(u => u.UserName.ToLower() != "admin")
        //        .Include(u => u.Role)
        //        .ToListAsync();

        //    var passwordHasher = new PasswordHasher<User>();
        //    foreach (var user in users)
        //    {
        //        user.PasswordHash = passwordHasher.HashPassword(user, "p123456");
        //    }
        //    _context.Users.UpdateRange(users);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { success = true, msg = "admin access granted" });
        //}
    }
}