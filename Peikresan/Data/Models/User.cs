using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Peikresan.Services;

namespace Peikresan.Data.Models
{
    public class User : IdentityUser<Guid>
    {
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [NotMapped] public string FullName => FirstName + " " + LastName;

        public string Mobile { get; set; }
        public string Tel { get; set; }
        public string Address { get; set; }

        public bool Active { get; set; } = true;

        public double? OpenTime { get; set; }
        public double? CloseTime { get; set; }
        public double? OpenTime2 { get; set; }
        public double? CloseTime2 { get; set; }

        public string IdNumber { get; set; }
        public string IdPic { get; set; }

        public string LicenseNumber { get; set; }
        public string LicensePic { get; set; }

        public int StaffNumber { get; set; }
        public string BankNumber { get; set; }

        public string State { get; set; }
        public string City { get; set; }

        // public bool IsOpenNow => Helper.IsOpenUser(this,DateTime.Now);

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public virtual Role Role { get; set; }
        // public RoleStatus RoleStatus { get; set; } = RoleStatus.User;

        public virtual IList<SellerProduct> SellerProducts { get; set; }

        // for seller user
        // public virtual IList<Order> SellOrders { get; set; }
        public virtual IList<SubOrder> SellSubOrders { get; set; }

        // for deliver user
        public virtual IList<Order> DeliverOrders { get; set; }
    }

    // public enum RoleStatus
    // {
    //     User=0, Seller=10, Deliver=20, Admin = 100,
    // }
}
