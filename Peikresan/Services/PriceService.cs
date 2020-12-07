using System.Collections.Generic;
using System.Linq;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class PriceService
    {
        // TODO: Read from Setting
        public static readonly decimal MinimumCart  = 70000;
        public static readonly decimal DeliverPrice  = 5000;
        public static readonly decimal DeliverAtDoor = 2000;

        public static decimal CalculatePrice(List<OrderItem> orderItems, bool deliverAtDoor)
        {
            var totalPrice = orderItems.Sum(item => item.ItemsPrice);

            if (totalPrice < MinimumCart) totalPrice += DeliverPrice;
            if (deliverAtDoor) totalPrice += DeliverAtDoor;

            return totalPrice;
        }
    }
}
