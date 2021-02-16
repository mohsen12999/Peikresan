using System.Collections.Generic;

namespace Peikresan.Data.ViewModels
{
    public class ShopCartViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Count { get; set; }
        public decimal Price { get; set; }
    }

    public class AddressViewModel
    {
        public string State { get; set; }
        public string City { get; set; }
        public string Mobile { get; set; }
        public string Name { get; set; }
        public string FormattedAddress { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class DeliverTimeViewModel
    {
        public int Id { get; set; }
        public int Time { get; set; }
        public string Title { get; set; }
        public string DeliverDay { get; set; }
    }

    /*
    export enum DeliverDay {
        TODAY = "TODAY",
        TOMORROW = "TOMORROW",
        EXPRESS = "EXPRESS",
    }
     */

    public class CartModel
    {
        public List<ShopCartViewModel> ShopCart { get; set; }
        public AddressViewModel Address { get; set; }
        public DeliverTimeViewModel DeliverTime { get; set; }
        
        public bool DeliverAtDoor{ get; set; }

    }
}

/*
{
	"data": {
		"city": "رامسر",
		"day": "Today",
		"deliverAtDoor": false,
		"description": "wserwerwe",
		"id": 1,
		"level": "",
		"mobile": "21231231231",
		"name": "mohsen",
		"number": "",
		"postalCode": "",
		"shopCart": {
			"4": 1
		},
		"state": "مازندران",
		"time": 23,
		"unit": "",
		"value": 23
	}
}
*/