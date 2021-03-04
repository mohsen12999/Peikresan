using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.ClientModels
{
    public class ClientOrder
    {
        public int Id { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Mobile { get; set; }
        public string Name { get; set; }
        public string FormattedAddress { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int OrderStatus { get; set; }
        public bool DeliverAtDoor { get; set; }

        public Guid? DeliveryId { get; set; }
        public string Delivery { get; set; }
        public string DeliveryMobile { get; set; }

        public List<ClientOrderItem> Items { get; set; }
    }
}
