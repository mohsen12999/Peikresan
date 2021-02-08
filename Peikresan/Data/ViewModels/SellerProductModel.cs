namespace Peikresan.Data.ViewModels
{
    public class SellerProductModel
    {
        public string Id { get; set; }
        public string Product { get; set; }
        public int Count { get; set; }
        public decimal Price { get; set; }

        // admin add for users
        public string UserId { get; set; }
    }
}
