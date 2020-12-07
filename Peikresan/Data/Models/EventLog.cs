using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.Models
{
    public class EventLog
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public string UserId { get; set; }
        public int? ObjectId { get; set; }

        public EventLogModel EventLogModel { get; set; }
        public EventLogType EventLogType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

    public enum EventLogModel
    {
        User = 1,
        Product = 10,
        Category = 20,
        Banner = 30,
        Slider = 40,
        Factor = 50,
        Order = 60,
        OrderItem = 70,
        SellerProduct = 80,
        AwesomeProduct = 90,
        Other = 200
    }

    public enum EventLogType
    {
        Logging = 1,
        Insert = 10,
        Update = 12,
        Delete = 14,
        Other = 20
    }
}
