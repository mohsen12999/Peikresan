using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
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
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly string _webRootPath;

        public UserController(ILogger<UserController> logger, ApplicationDbContext context, IWebHostEnvironment appEnvironment)
        {
            _logger = logger;
            _context = context;
            _webRootPath = appEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), appEnvironment.IsDevelopment() ? "ClientApp\\public" : "ClientApp\\build");

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
                var newUser = true;
                User user;

                if (registerModel.Id == "" || registerModel.Id.ToLower() == "undefined")
                {
                    user = new User() { UserName = registerModel.Username, Email = registerModel.Username.Replace(" ", "_") + "@mail.com" };
                }
                else
                {
                    user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == registerModel.Id);
                    if (user == null)
                    {
                        return BadRequest("can not find user to change");
                    }
                }

                if (string.IsNullOrEmpty(registerModel.RoleId) == false &&
                        registerModel.RoleId.ToLower() != "undefined")
                {
                    var role = await _context.Roles.Where(r => r.Id.ToString() == registerModel.RoleId.Trim()).FirstAsync();
                    if (role != null) user.Role = role;
                }

                if (string.IsNullOrEmpty(registerModel.Title) == false &&
                    registerModel.Title.ToLower() != "undefined")
                {
                    user.Title = registerModel.Title.Trim();
                }

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

                if (string.IsNullOrEmpty(registerModel.Tel) == false &&
                    registerModel.Tel.ToLower() != "undefined")
                {
                    user.Tel = registerModel.Tel.Trim();
                }

                if (registerModel.Longitude != null || registerModel.Longitude != 0)
                {
                    user.Longitude = (double)registerModel.Longitude;
                }

                if (registerModel.Latitude != null || registerModel.Latitude != 0)
                {
                    user.Latitude = (double)registerModel.Latitude;
                }

                if (string.IsNullOrEmpty(registerModel.IdNumber) == false &&
                    registerModel.IdNumber.ToLower() != "undefined")
                {
                    user.IdNumber = registerModel.IdNumber.Trim();
                }

                if (registerModel.IdPicFile != null && registerModel.IdPicFile.Length > 0)
                {
                    var filename =
                        await ImageServices.SaveAndConvertImage(registerModel.IdPicFile, _webRootPath, WebsiteModel.Product, 500, 500);
                    if (filename.Length > 0)
                    {
                        user.IdPic = filename;
                    }
                }

                if (string.IsNullOrEmpty(registerModel.LicenseNumber) == false &&
                    registerModel.LicenseNumber.ToLower() != "undefined")
                {
                    user.LicenseNumber = registerModel.LicenseNumber.Trim();
                }

                if (registerModel.LicensePicFile != null && registerModel.LicensePicFile.Length > 0)
                {
                    var filename =
                        await ImageServices.SaveAndConvertImage(registerModel.LicensePicFile, _webRootPath, WebsiteModel.Product, 500, 500);
                    if (filename.Length > 0)
                    {
                        user.LicensePic = filename;
                    }
                }

                if (string.IsNullOrEmpty(registerModel.StaffNumber) == false &&
                    registerModel.StaffNumber.ToLower() != "undefined")
                {
                    int.TryParse(registerModel.StaffNumber, out int staffNumber);
                    user.StaffNumber = staffNumber;
                }

                if (string.IsNullOrEmpty(registerModel.BankNumber) == false &&
                    registerModel.BankNumber.ToLower() != "undefined")
                {
                    user.BankNumber = registerModel.BankNumber.Trim();
                }

                if (string.IsNullOrEmpty(registerModel.State) == false &&
                    registerModel.State.ToLower() != "undefined")
                {
                    user.State = registerModel.State.Trim();
                }

                if (string.IsNullOrEmpty(registerModel.City) == false &&
                    registerModel.City.ToLower() != "undefined")
                {
                    user.City = registerModel.City.Trim();
                }

                if (newUser)
                {
                    var passwordHasher = new PasswordHasher<User>();
                    var passwordHash = passwordHasher.HashPassword(user, registerModel.Password);
                    user.PasswordHash = passwordHash;

                    await _context.Users.AddAsync(user);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        success = true,
                        users = await UserServices.GetAllUsers(_context),
                        eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                        {
                            UserId = thisUser.Id.ToString(),
                            WebsiteModel = WebsiteModel.User,
                            WebsiteEventType = WebsiteEventType.Insert,
                            Description = "Admin " + thisUser.FullName + " Register User " + user.FullName + " - role: " +
                                          (thisUser.Role?.Name ?? "")
                        })
                    });
                }

                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    users = await UserServices.GetAllUsers(_context),
                    eventId = await WebsiteLogServices.SaveEventLog(_context, new WebsiteLog
                    {
                        UserId = thisUser.Id.ToString(),
                        WebsiteModel = WebsiteModel.User,
                        WebsiteEventType = WebsiteEventType.Update,
                        Description = "Admin " + thisUser.FullName + " Update User " + user.FullName + " - role: " +
                                      (user.Role?.Name ?? "")
                    })
                });

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

            return Ok(new
            {
                users = await UserServices.GetAllUsers(_context),
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

