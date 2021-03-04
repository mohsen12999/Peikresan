using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Peikresan.Data.Models
{
    public class Order
    {
        public int Id { get; set; }
        // public string Title { get; set; }
        // public string Description { get; set; }

        // address
        public string Name { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Description { get; set; }
        public string Mobile { get; set; }
        public string FormattedAddress { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // time
        public int DeliverTimeId { get; set; }
        public int DeliverTime { get; set; }
        public string DeliverTimeTitle { get; set; }
        public string DeliverDay { get; set; }

        public bool DeliverAtDoor { get; set; }

        [Column(TypeName = "decimal(10,3)")]
        public decimal TotalPrice { get; set; }

        // Bank
        public string BankName { get; set; }
        public string BankCode { get; set; }
        public string BankToken { get; set; }
        // bankresponse
        public int Respcode { get; set; }
        public string Respmsg { get; set; }
        public long Amount { get; set; }
        public string InvoiceId { get; set; }
        public string Payload { get; set; }
        public long Terminalid { get; set; }
        public long Tracenumber { get; set; }
        public long RRN { get; set; }
        public string DatePaid { get; set; }
        public string DigitalReceipt { get; set; }
        public string IssuerBank { get; set; }
        public string CardNumber { get; set; }

        // bank verify
        public string VerifyStatus { get; set; }
        public string VerifyReturnId { get; set; }
        public string VerifyMessage { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.Init;
        [NotMapped]
        public string OrderStatusDescription => Enum.GetName(typeof(OrderStatus), OrderStatus);

        public virtual IList<OrderItem> OrderItems { get; set; }
        public virtual IList<SubOrder> SubOrders { get; set; }

        // public virtual User Seller { get; set; }
        // public virtual Guid? SellerId { get; set; }

        public virtual User Deliver { get; set; }
        public virtual Guid? DeliverId { get; set; }

        public int? VoteNumber { get; set; }
        public string VoteDescription { get; set; }

        public DateTime InitDateTime { get; set; } = DateTime.Now;
        public DateTime? VerifiedDateTime { get; set; } = null;

        //public DateTime? AssignToSellerDateTime { get; set; } = null;
        //public DateTime? SellerAcceptedDateTime { get; set; } = null;

        //public DateTime? AssignToDeliverDateTime { get; set; } = null;
        //public DateTime? DeliverAcceptedDateTime { get; set; } = null;

        public DateTime? DeliverGetProductDateTime { get; set; } = null;
        public DateTime? DeliveredProductDateTime { get; set; } = null;

        public DateTime? CustomerDeliveredDateTime { get; set; } = null;
        public DateTime? CustomerVoteDateTime { get; set; } = null;

        [NotMapped]
        public decimal OrderItemsPrice => OrderItems.Sum(orderItem => orderItem.ItemsPrice);
    }

    public enum OrderStatus
    {
        Init = 1,
        Verified = 10,
        
        // - Choose Market
        //AssignToSeller = 20,
        //SellerDeny = 23,
        //SellerAccepted = 27,
        
        // - Choose Deliver
        // AssignToDeliver = 30,
        // DeliverDeny = 33,
        // DeliverAccepted = 37,

        // - Deliver Action
        DeliveryGetProduct = 40,
        DeliveredProduct = 45,
        
        // - Customer
        CustomerDelivered = 50,
        CustomerVote = 55
    }
}