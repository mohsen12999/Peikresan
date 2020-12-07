using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Peikresan.Data.Models;
using EventLog = System.Diagnostics.EventLog;

namespace Peikresan.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Product & Category
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull).OnDelete(DeleteBehavior.SetNull);

            // Order & OrderItem
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(i => i.Order)
                .HasForeignKey(p => p.OrderId);

            // Seller Product
            modelBuilder.Entity<SellerProduct>()
                .HasKey(sp => new { sp.ProductId, sp.UserId });
            modelBuilder.Entity<SellerProduct>()
                .HasOne(sp => sp.User)
                .WithMany(u => u.SellerProducts)
                .HasForeignKey(sp => sp.UserId);
            modelBuilder.Entity<SellerProduct>()
                .HasOne(sp => sp.Product)
                .WithMany(p => p.SellerProducts)
                .HasForeignKey(sp => sp.ProductId);

            modelBuilder.Entity<Order>().HasOne(o => o.Seller).WithMany(u => u.SellOrders).HasForeignKey(or => or.SellerId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Order>().HasOne(o => o.Deliver).WithMany(u => u.DeliverOrders).HasForeignKey(or => or.DeliverId).OnDelete(DeleteBehavior.NoAction);

        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<Slider> Sliders { get; set; }
        public DbSet<Factor> Factors { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<SellerProduct> SellerProducts { get; set; }
        public DbSet<AwesomeProduct> AwesomeProducts { get; set; }

        public DbSet<EventLog> EventLogs { get; set; }
    }
}
