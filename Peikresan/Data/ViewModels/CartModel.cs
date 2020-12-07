using System.Collections.Generic;

namespace Peikresan.Data.ViewModels
{
    public class CartModel
    {
        public IDictionary<int,int> ShopCart { get; set; }

        // address
        public string Name { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Description { get; set; }
        public string Mobile { get; set; }
        public string Level { get; set; }
        public string Number { get; set; }
        public string Unit { get; set; }
        public string PostalCode { get; set; }

        // time
        public string Day { get; set; }
        public int Time { get; set; }
        public string Value { get; set; }
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