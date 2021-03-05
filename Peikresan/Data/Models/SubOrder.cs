using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Peikresan.Data.Models
{
    public class SubOrder
    {
        public int Id { get; set; }

        public virtual User Seller { get; set; }
        public virtual Guid? SellerId { get; set; }

        public int OrderId { get; set; }
        public virtual Order Order { get; set; }

        public bool Sms2Seller { get; set; } = false;

        public RequestStatus RequestStatus { get; set; } = RequestStatus.Pending;
        [NotMapped] public string RequestStatusDescription => Enum.GetName(typeof(RequestStatus), RequestStatus);

        public virtual IList<SubOrderItem> SubOrderItems { get; set; }
    }

    public enum RequestStatus
    {
        Pending = 0,
        PackageReady = 10,
        // Accept = 10,
        // Deny = 30,
        // DenyByAdmin = 40
    }
}