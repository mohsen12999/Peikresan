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

        public RequestStatus RequestStatus { get; set; } = RequestStatus.Pending;
        [NotMapped] public string RequestStatusDescription => Enum.GetName(typeof(RequestStatus), RequestStatus);

        public virtual IList<OrderItem> OrderItems { get; set; }
    }

    public enum RequestStatus
    {
        Pending = 0,
        Accept = 10,
        Deny = 20,
        DenyByAdmin = 40
    }
}