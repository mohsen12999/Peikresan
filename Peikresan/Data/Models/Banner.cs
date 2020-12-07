using System;

namespace Peikresan.Data.Models
{
    public class Banner
    {
        public int Id { get; set; }
        
        public string Title { get; set; }
        public string Img { get; set; }

        public BannerType BannerType { get; set; } = BannerType.Little;

        public string Url { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }

    public enum BannerType{ Big=1, Little=2, Small=3 };
}