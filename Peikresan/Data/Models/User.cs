using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using System.Spatial;

namespace Peikresan.Data.Models
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [NotMapped] public string FullName => FirstName + " " + LastName;

        public string Mobile { get; set; }
        public string Address { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
        [NotMapped] public GeographyPoint Location => GeographyPoint.Create(Latitude, Longitude);

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
