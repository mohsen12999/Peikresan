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

        private async Task<IActionResult> AccessData(User thisUser)
        {
            var tokenString = GenerateJwtToken(thisUser);
            if (thisUser.Role != null && thisUser.Role.Name.ToLower() == "admin")
            {
                var users = await _context.Users
                    .Include(u => u.Role)
                    .Select(us => new { us.Id, us.UserName, us.FirstName, us.LastName, us.Mobile, us.Email, us.Role })
                    .ToListAsync();

                var roles = await _context.Roles
                    .ToListAsync();

                // TODO: select order info for not send too much data to client
                var orders = await _context.Orders
                    .Where(or => or.OrderStatus != OrderStatus.Init)
                    .Include(o => o.OrderItems)
                    .OrderByDescending(ord => ord.Id).ToListAsync();

                // TODO: Send all products
                // TODO: Send all categories

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
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.User,
                        WebsiteEventType = WebsiteEventType.Logging,
                        Description = "logging admin " + thisUser.FullName
                    })
                });
            }

            var userOrders = await _context.Orders
                .Where(ord => ord.DeliverId == thisUser.Id )
                //.Where(ord => ord.DeliverId == thisUser.Id || ord.SellerId == thisUser.Id)
                .Include(o => o.OrderItems).ToListAsync();
            var sellerProducts = await _context.SellerProducts
                .Where(sp => sp.UserId == thisUser.Id)
                .Include(sellp => sellp.Product).ToListAsync();

            return Ok(new
            {
                success = true,
                msg = "Logging successfully",
                token = tokenString,
                id = thisUser.Id,
                userName = thisUser.UserName,
                role = thisUser.Role?.Name ?? "",
                orders = userOrders,
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

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel registerModel)
        {
            try
            {
                var user = new User() { UserName = registerModel.Username, Email = registerModel.Email };
                var role = await _context.Roles.Where(r => r.Id.ToString() == registerModel.RoleId.Trim()).FirstAsync();
                if (role != null) user.Role = role;

                if (string.IsNullOrEmpty(registerModel.FirstName) == false && registerModel.FirstName.ToLower() != "undefined")
                {
                    user.FirstName = registerModel.FirstName.Trim();
                }
                if (string.IsNullOrEmpty(registerModel.LastName) == false && registerModel.LastName.ToLower() != "undefined")
                {
                    user.LastName = registerModel.LastName.Trim();
                }
                if (string.IsNullOrEmpty(registerModel.Mobile) == false && registerModel.Mobile.ToLower() != "undefined")
                {
                    user.Mobile = registerModel.Mobile.Trim();
                }
                if (string.IsNullOrEmpty(registerModel.Address) == false && registerModel.Address.ToLower() != "undefined")
                {
                    user.Address = registerModel.Address.Trim();
                }

                var passwordHasher = new PasswordHasher<User>();
                var passwordHash = passwordHasher.HashPassword(user, registerModel.Password);
                user.PasswordHash = passwordHash;

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                var tokenString = GenerateJwtToken(user);

                return Ok(new
                {
                    token = tokenString,
                    userDetails = user,
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = user.Id.ToString(),
                        WebsiteModel = WebsiteModel.User,
                        WebsiteEventType = WebsiteEventType.Insert,
                        Description = "add user " + user.FullName
                    })
                });
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize("Admin")]
        [HttpPost("admin-access")]
        public IActionResult AdminAccess()
        {
            return Ok(new { success = true, msg = "admin access granted" });
        }
    }
}