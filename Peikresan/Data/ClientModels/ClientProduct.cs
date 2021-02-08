using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.ClientModels
{
    public class ClientProduct
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Img { get; set; }

        public decimal Price { get; set; }
        public int Max { get; set; }
        public bool SoldByWeight { get; set; }
        public int MinWeight { get; set; }

        public int Barcode { get; set; }
        public int Order { get; set; }

        public int? CategoryId { get; set; }
        public string Category { get; set; }
    }
}

/*
  id: number;
  title: string;
  description: string;
  img: string;
  price: number;
  max: number;
  soldByWeight: boolean;
  minWeight: number;

  barcode: number;
  order: number;

  categoryId: number;
  category: string;
*/