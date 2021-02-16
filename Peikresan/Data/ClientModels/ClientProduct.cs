
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

        public decimal? Barcode { get; set; }
        public int Order { get; set; }

        public int? CategoryId { get; set; }
        public string Category { get; set; }
    }
}
