namespace Peikresan.Data.ViewModels
{
    public class SellerProductModel
    {
        public string id { get; set; }
        public string product { get; set; }
        public int count { get; set; }

        // admin add for users
        public string userId { get; set; }
    }
}
