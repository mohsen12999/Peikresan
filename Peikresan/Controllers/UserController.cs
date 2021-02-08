using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly ApplicationDbContext _context;

        public UserController(ILogger<UserController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Authorize]
        [HttpPost]
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

                if (registerModel.Id == "" || registerModel.Id.ToLower() == "undefined")
                {
                    var user = new User() { UserName = registerModel.Username, Email = registerModel.Email };
                    var role = await _context.Roles.Where(r => r.Id.ToString() == registerModel.RoleId.Trim()).FirstAsync();
                    if (role != null) user.Role = role;

                    if (string.IsNullOrEmpty(registerModel.FirstName) == false &&
                        registerModel.FirstName.ToLower() != "undefined")
                    {
                        user.FirstName = registerModel.FirstName.Trim();
                    }

                    if (string.IsNullOrEmpty(registerModel.LastName) == false &&
                        registerModel.LastName.ToLower() != "undefined")
                    {
                        user.LastName = registerModel.LastName.Trim();
                    }

                    if (string.IsNullOrEmpty(registerModel.Mobile) == false &&
                        registerModel.Mobile.ToLower() != "undefined")
                    {
                        user.Mobile = registerModel.Mobile.Trim();
                    }

                    if (string.IsNullOrEmpty(registerModel.Address) == false &&
                        registerModel.Address.ToLower() != "undefined")
                    {
                        user.Address = registerModel.Address.Trim();
                    }

                    var passwordHasher = new PasswordHasher<User>();
                    var passwordHash = passwordHasher.HashPassword(user, registerModel.Password);
                    user.PasswordHash = passwordHash;

                    await _context.Users.AddAsync(user);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        success = true,
                        user = new
                        {
                            user.Id,
                            user.FirstName,
                            role = user.Role?.Name ?? "",
                            user.UserName,
                            user.LastName,
                            user.Mobile
                        },
                        eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                        {
                            UserId = thisUser.Id.ToString(),
                            WebsiteModel = WebsiteModel.User,
                            WebsiteEventType = WebsiteEventType.Insert,
                            Description = "Admin " + thisUser.FullName + " Register User " + user.FullName + " - role: " +
                                          (role?.Name ?? "")
                        })
                    });
                }
                else
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == registerModel.Id);
                    if (user == null)
                    {
                        return BadRequest("can not find user to change");
                    }
                    var role = await _context.Roles.Where(r => r.Id.ToString() == registerModel.RoleId.Trim()).FirstAsync();
                    if (role != null) user.Role = role;

                    if (string.IsNullOrEmpty(registerModel.FirstName) == false &&
                        registerModel.FirstName.ToLower() != "undefined")
                    {
                        user.FirstName = registerModel.FirstName.Trim();
                    }

                    if (string.IsNullOrEmpty(registerModel.LastName) == false &&
                        registerModel.LastName.ToLower() != "undefined")
                    {
                        user.LastName = registerModel.LastName.Trim();
                    }

                    if (string.IsNullOrEmpty(registerModel.Mobile) == false &&
                        registerModel.Mobile.ToLower() != "undefined")
                    {
                        user.Mobile = registerModel.Mobile.Trim();
                    }

                    if (string.IsNullOrEmpty(registerModel.Address) == false &&
                        registerModel.Address.ToLower() != "undefined")
                    {
                        user.Address = registerModel.Address.Trim();
                    }

                    if (string.IsNullOrEmpty(registerModel.Password) == false &&
                        registerModel.Password.ToLower() != "undefined")
                    {
                        var passwordHasher = new PasswordHasher<User>();
                        var passwordHash = passwordHasher.HashPassword(user, registerModel.Password);
                        user.PasswordHash = passwordHash;
                    }

                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        success = true,
                        user = new
                        {
                            user.Id,
                            user.FirstName,
                            role = user.Role?.Name ?? "",
                            user.UserName,
                            user.LastName,
                            user.Mobile
                        },
                        eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                        {
                            UserId = thisUser.Id.ToString(),
                            WebsiteModel = WebsiteModel.User,
                            WebsiteEventType = WebsiteEventType.Update,
                            Description = "Admin " + thisUser.FullName + " Update User " + user.FullName + " - role: " +
                                          (role?.Name ?? "")
                        })
                    });
                }
            }
            catch (Exception e)
            {
                return BadRequest("error in add or update user " + e.Message);
            }

        }

        [Authorize]
        [HttpPost("remove")]
        public async Task<IActionResult> RemoveUserAsync([FromBody] JustId justId)
        {
            var thisUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            if (thisUser.Role == null || thisUser.Role.Name.ToLower() != "admin")
            {
                return Unauthorized("Only Admin Can Remove User");
            }

            var id = justId.Id.ToString();
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

    }
}

