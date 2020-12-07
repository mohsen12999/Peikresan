using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class SeedData
    {
        public static void SeedCategory(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasData(

                new Category { Id = 1, ParentId = 0, HaveChild = true, Title = "کالاهای اساسی و خواربار", Img = "" },
                new Category { Id = 2, ParentId = 1, HaveChild = false, Title = "روغن پخت و پز، جامد و سرخ کردنی", Img = "/img/category/cat-1.png" },
                new Category { Id = 3, ParentId = 1, HaveChild = false, Title = "قند، شکر و نبات", Img = "/img/category/cat-2.png" },
                new Category { Id = 4, ParentId = 1, HaveChild = false, Title = "برنج", Img = "/img/category/cat-3.png" },
                new Category { Id = 5, ParentId = 1, HaveChild = false, Title = "حبوبات فله و بسته بندی، سویا", Img = "/img/category/cat-4.png" },
                new Category { Id = 6, ParentId = 1, HaveChild = false, Title = "رب گوجه فرنگی و رب انار", Img = "" },
                new Category { Id = 7, ParentId = 1, HaveChild = false, Title = "خیارشور و ترشیجات", Img = "" },
                new Category { Id = 8, ParentId = 1, HaveChild = false, Title = "ماکارانی، پاستا رشته ای", Img = "" },
                new Category { Id = 9, ParentId = 1, HaveChild = false, Title = "رشته سوپی", Img = "" },
                new Category { Id = 10, ParentId = 1, HaveChild = false, Title = "رشته آش و پلویی", Img = "" },
                new Category { Id = 11, ParentId = 1, HaveChild = false, Title = "ماکارانی فرمی و لازانیا", Img = "" },
                // new Category { Id = 12, ParentId = 1, HaveChild = false, Title = "سبزی خشک و پودر جوانه", Img = "" },

                new Category { Id = 13, ParentId = 0, HaveChild = true, Title = "لبنیات", Img = "" },
                new Category { Id = 14, ParentId = 13, HaveChild = false, Title = "شیر پاستوریزه", Img = "/img/category/cat-4.png" },
                new Category { Id = 15, ParentId = 13, HaveChild = false, Title = "کره حیوانی", Img = "/img/category/cat-3.png" },
                new Category { Id = 16, ParentId = 13, HaveChild = false, Title = "دوغ پاستوریزه", Img = "" },
                new Category { Id = 17, ParentId = 13, HaveChild = false, Title = "ماست", Img = "" },
                new Category { Id = 18, ParentId = 13, HaveChild = false, Title = "پنیر", Img = "" },
                new Category { Id = 19, ParentId = 13, HaveChild = false, Title = "خامه و سرشیر شرکتی", Img = "" },
                new Category { Id = 20, ParentId = 13, HaveChild = false, Title = "شیر های طعم دار", Img = "" },
                new Category { Id = 21, ParentId = 13, HaveChild = false, Title = "دسر های لبنی (دنت و ...)", Img = "" },
                new Category { Id = 22, ParentId = 13, HaveChild = false, Title = "کشک پاستوریزه", Img = "" },

                new Category { Id = 23, ParentId = 0, HaveChild = true, Title = "بهداشتی و شوینده", Img = "" },
                new Category { Id = 24, ParentId = 23, HaveChild = true, Title = "شامپو", Img = "" },
                new Category { Id = 25, ParentId = 24, HaveChild = false, Title = "شامپو سر", Img = "" },
                new Category { Id = 26, ParentId = 24, HaveChild = false, Title = "شامپو بدن", Img = "" },
                new Category { Id = 27, ParentId = 24, HaveChild = false, Title = "نرم کننده سر", Img = "" },
                new Category { Id = 28, ParentId = 24, HaveChild = false, Title = "شامپو کودک", Img = "" },
                new Category { Id = 29, ParentId = 23, HaveChild = false, Title = "صابون و پودر صابون", Img = "" },
                new Category { Id = 30, ParentId = 23, HaveChild = true, Title = "بهداشت دهان و دندان", Img = "" },
                new Category { Id = 31, ParentId = 30, HaveChild = false, Title = "خمیر دندان", Img = "" },
                new Category { Id = 32, ParentId = 30, HaveChild = false, Title = "مسواک", Img = "" },
                new Category { Id = 33, ParentId = 30, HaveChild = false, Title = "خلال دندان و نخ دندان", Img = "" },
                new Category { Id = 34, ParentId = 30, HaveChild = false, Title = "دهانشویه", Img = "" },
                new Category { Id = 35, ParentId = 23, HaveChild = true, Title = "لوازم بهداشتی مصرفی", Img = "/img/category/cat-1.png" },
                new Category { Id = 36, ParentId = 35, HaveChild = false, Title = "پوشک بچه", Img = "" },
                new Category { Id = 37, ParentId = 35, HaveChild = false, Title = "نوار بهداشتی", Img = "" },
                new Category { Id = 38, ParentId = 35, HaveChild = false, Title = "دستمال مرطوب (کودک، منزل و آرایش)", Img = "" },
                new Category { Id = 39, ParentId = 35, HaveChild = false, Title = "دستمال نظافت منزل", Img = "" },
                new Category { Id = 40, ParentId = 35, HaveChild = false, Title = "دستمال کاغذی", Img = "" },
                new Category { Id = 41, ParentId = 23, HaveChild = false, Title = "شوینده لباس کودک و نوزاد", Img = "" },
                new Category { Id = 42, ParentId = 23, HaveChild = true, Title = "مواد شوینده", Img = "" },
                new Category { Id = 43, ParentId = 42, HaveChild = false, Title = "مایع ظرفشویی", Img = "" },
                new Category { Id = 44, ParentId = 42, HaveChild = false, Title = "جرم گیر و سفید کننده", Img = "" },
                new Category { Id = 45, ParentId = 42, HaveChild = false, Title = "اسپری پاک کننده", Img = "" },
                new Category { Id = 46, ParentId = 42, HaveChild = false, Title = "مایع دستشویی", Img = "" },
                new Category { Id = 47, ParentId = 42, HaveChild = false, Title = "مایع لباسشویی", Img = "" },
                new Category { Id = 48, ParentId = 42, HaveChild = false, Title = "پودر لباسشویی", Img = "" },
                new Category { Id = 49, ParentId = 42, HaveChild = false, Title = "نرم کننده حوله و لباس", Img = "" },
                new Category { Id = 50, ParentId = 42, HaveChild = false, Title = "شوینده های ماشین ظرفشویی", Img = "" },
                new Category { Id = 51, ParentId = 23, HaveChild = true, Title = "مراقبت از پوست و مو", Img = "" },
                new Category { Id = 52, ParentId = 51, HaveChild = false, Title = "مام، اسپری بدن، ژل، سافت", Img = "" },
                new Category { Id = 53, ParentId = 51, HaveChild = false, Title = "چسب مو", Img = "" },
                new Category { Id = 54, ParentId = 51, HaveChild = false, Title = "لوسیون، کرم، رنگ مو", Img = "" },
                new Category { Id = 55, ParentId = 51, HaveChild = false, Title = "حمام و اصلاح بدن (ژیلت، پودر، کف ریش)", Img = "" },
                new Category { Id = 56, ParentId = 23, HaveChild = true, Title = "انواع یکبار مصرف", Img = "" },
                new Category { Id = 57, ParentId = 56, HaveChild = false, Title = "دستکش لاتیکس یکبار مصرف", Img = "" },
                new Category { Id = 58, ParentId = 56, HaveChild = false, Title = "ظروف یکبار مصرف: قاشق، چنگال، کارد، لیوان، لیوان کاغذی ", Img = "" },
                new Category { Id = 59, ParentId = 56, HaveChild = false, Title = "کیسه زباله", Img = "" },
                new Category { Id = 60, ParentId = 56, HaveChild = false, Title = "کیسه فریزر", Img = "" },
                new Category { Id = 61, ParentId = 23, HaveChild = false, Title = "دستکش ظرفشویی، سیم اسکاج", Img = "" },
                new Category { Id = 62, ParentId = 23, HaveChild = false, Title = "سموم و آفت کش ها", Img = "" },

                new Category { Id = 63, ParentId = 0, HaveChild = true, Title = "صبحانه", Img = "/img/category/cat-2.png" },
                new Category { Id = 64, ParentId = 63, HaveChild = false, Title = "مرباجات", Img = "" },
                new Category { Id = 65, ParentId = 63, HaveChild = false, Title = "حلوا شکری، ارده و کنجد", Img = "" },
                new Category { Id = 66, ParentId = 63, HaveChild = false, Title = "شکلات صبحانه", Img = "" },
                new Category { Id = 67, ParentId = 63, HaveChild = false, Title = "عسل", Img = "" },
                new Category { Id = 68, ParentId = 63, HaveChild = false, Title = "پنیر صبحانه", Img = "" },
                new Category { Id = 69, ParentId = 63, HaveChild = false, Title = "کره بادام زمینی", Img = "" },
                new Category { Id = 70, ParentId = 63, HaveChild = false, Title = "غلات صبحانه و غذای کودک", Img = "" },

                new Category { Id = 71, ParentId = 0, HaveChild = true, Title = "چاشنی و افزودنی", Img = "" },
                new Category { Id = 72, ParentId = 71, HaveChild = false, Title = "سس", Img = "" },
                new Category { Id = 73, ParentId = 71, HaveChild = false, Title = "چاشنی های مایع ترش", Img = "" },
                new Category { Id = 74, ParentId = 71, HaveChild = false, Title = "ادویه و چاشنی و عصاره ها", Img = "" },
                new Category { Id = 75, ParentId = 71, HaveChild = false, Title = "زعفران و زرشک و تزئینات غذا", Img = "" },
                new Category { Id = 76, ParentId = 71, HaveChild = false, Title = "پودر ژله، کرم کارامل و ژلاتین", Img = "" },
                new Category { Id = 77, ParentId = 71, HaveChild = false, Title = "پودر کیک و آرد", Img = "" },
                new Category { Id = 78, ParentId = 71, HaveChild = false, Title = "پودر سوخاری", Img = "" },

                new Category { Id = 79, ParentId = 0, HaveChild = true, Title = "ملزومات خانگی", Img = "" },
                new Category { Id = 80, ParentId = 79, HaveChild = false, Title = "اسپری خوشبو کننده هوا", Img = "" },
                new Category { Id = 81, ParentId = 79, HaveChild = false, Title = "لامپ", Img = "" },
                new Category { Id = 82, ParentId = 79, HaveChild = false, Title = "باطری", Img = "" },
                new Category { Id = 83, ParentId = 79, HaveChild = false, Title = "چسب", Img = "" },
                new Category { Id = 84, ParentId = 79, HaveChild = false, Title = "طناب", Img = "" },
                new Category { Id = 85, ParentId = 79, HaveChild = false, Title = "سایر", Img = "" },

                new Category { Id = 86, ParentId = 0, HaveChild = true, Title = "محصولات پروتئینی", Img = "" },
                new Category { Id = 87, ParentId = 86, HaveChild = false, Title = "تخم مرغ و سایر پرنده ها", Img = "" },
                new Category { Id = 88, ParentId = 86, HaveChild = false, Title = "قارچ", Img = "" },
                new Category { Id = 89, ParentId = 86, HaveChild = false, Title = "فرآورده های منجمد و یخچالی", Img = "" },
                new Category { Id = 90, ParentId = 86, HaveChild = false, Title = "ژامبون، سوسیس و کالباس", Img = "" },
                new Category { Id = 91, ParentId = 86, HaveChild = false, Title = "الویه و ساندویچ سرد", Img = "" },
                new Category { Id = 92, ParentId = 86, HaveChild = false, Title = "گوشت گاو و گوساله", Img = "" },
                new Category { Id = 93, ParentId = 86, HaveChild = false, Title = "گوشت و مرغ", Img = "" },
                new Category { Id = 94, ParentId = 86, HaveChild = false, Title = "گوشت گوسفند", Img = "" },
                new Category { Id = 95, ParentId = 86, HaveChild = false, Title = "ماهی و میگو شرکتی منجمد", Img = "" },

                new Category { Id = 96, ParentId = 0, HaveChild = true, Title = "کنسرو و غذای آماده", Img = "" },
                new Category { Id = 97, ParentId = 96, HaveChild = false, Title = "تن ماهی", Img = "" },
                new Category { Id = 98, ParentId = 96, HaveChild = false, Title = "کنسروها", Img = "" },
                new Category { Id = 99, ParentId = 96, HaveChild = false, Title = "غذاهای آماده و نودل", Img = "" },
                new Category { Id = 100, ParentId = 96, HaveChild = false, Title = "کمپوت میوه", Img = "" },
                new Category { Id = 101, ParentId = 96, HaveChild = false, Title = "زیتون وکیوم و شیشه ای", Img = "" },
                new Category { Id = 102, ParentId = 96, HaveChild = false, Title = "زیتون پرورده", Img = "" },

                new Category { Id = 103, ParentId = 0, HaveChild = true, Title = "دخانیات", Img = "" },
                new Category { Id = 104, ParentId = 103, HaveChild = false, Title = "تنباکو و توتون", Img = "" },
                new Category { Id = 105, ParentId = 103, HaveChild = false, Title = "سیگار", Img = "" },
                new Category { Id = 106, ParentId = 103, HaveChild = false, Title = "ذغال", Img = "" },
                new Category { Id = 107, ParentId = 103, HaveChild = false, Title = "فندک، کبریت، آتش زنه، الکل", Img = "" },
                new Category { Id = 108, ParentId = 103, HaveChild = false, Title = "قلیان و ملزومات", Img = "" },

                new Category { Id = 109, ParentId = 0, HaveChild = true, Title = "تنقلات", Img = "" },
                new Category { Id = 110, ParentId = 109, HaveChild = false, Title = "بیسکوئیت و ویفر", Img = "" },
                new Category { Id = 111, ParentId = 109, HaveChild = false, Title = "شکلات، تافی و آبنبات", Img = "" },
                new Category { Id = 112, ParentId = 109, HaveChild = false, Title = "آدامس، خوشبوکننده دهان", Img = "" },
                new Category { Id = 113, ParentId = 109, HaveChild = false, Title = "پفک و اسنک، پفیلا", Img = "" },
                new Category { Id = 114, ParentId = 109, HaveChild = false, Title = "چیپس", Img = "" },
                new Category { Id = 115, ParentId = 109, HaveChild = false, Title = "کیک و کلوچه", Img = "" },
                new Category { Id = 116, ParentId = 109, HaveChild = false, Title = "تخمه مغز طهم دار", Img = "" },
                new Category { Id = 117, ParentId = 109, HaveChild = true, Title = "بستنی ها", Img = "" },
                new Category { Id = 118, ParentId = 117, HaveChild = false, Title = "خانواده", Img = "" },
                new Category { Id = 119, ParentId = 117, HaveChild = false, Title = "تک نفره", Img = "" },
                new Category { Id = 121, ParentId = 109, HaveChild = false, Title = "پاستیل، نی شیر، ژله آماده", Img = "" },
                new Category { Id = 122, ParentId = 109, HaveChild = false, Title = "لواشک، برگه آلوچه، ترشک و تمبر هندی", Img = "" },
                new Category { Id = 123, ParentId = 109, HaveChild = false, Title = "بیسکوئیت پذیرایی", Img = "" },
                new Category { Id = 124, ParentId = 109, HaveChild = false, Title = "شکلات کادویی", Img = "" },
                new Category { Id = 125, ParentId = 109, HaveChild = false, Title = "جعبه جایزه (سک سک)", Img = "" },

                new Category { Id = 126, ParentId = 0, HaveChild = true, Title = "خشکبار و شیرینی", Img = "" },
                new Category { Id = 127, ParentId = 126, HaveChild = true, Title = "آجیل", Img = "" },
                new Category { Id = 128, ParentId = 127, HaveChild = false, Title = "فله", Img = "" },
                new Category { Id = 129, ParentId = 127, HaveChild = false, Title = "بسته بندی", Img = "" },
                new Category { Id = 130, ParentId = 126, HaveChild = false, Title = "شیرینی (پشمک ها، سوهان، گز و ...)", Img = "" },
                new Category { Id = 131, ParentId = 126, HaveChild = false, Title = "خرما", Img = "" },
                new Category { Id = 132, ParentId = 126, HaveChild = false, Title = "خشکبار", Img = "" },

                new Category { Id = 133, ParentId = 0, HaveChild = true, Title = "نوشیدنی", Img = "" },
                new Category { Id = 134, ParentId = 133, HaveChild = false, Title = "قهوه", Img = "" },
                new Category { Id = 135, ParentId = 133, HaveChild = false, Title = "قهوه فوری و هات چاکلت", Img = "" },
                new Category { Id = 136, ParentId = 133, HaveChild = true, Title = "چای", Img = "" },
                new Category { Id = 137, ParentId = 136, HaveChild = false, Title = "چای خارجی", Img = "" },
                new Category { Id = 138, ParentId = 136, HaveChild = false, Title = "چای فله", Img = "" },
                new Category { Id = 139, ParentId = 136, HaveChild = false, Title = "تی بگ", Img = "" },
                new Category { Id = 140, ParentId = 136, HaveChild = false, Title = "چای ایرانی بسته بندی", Img = "" },
                new Category { Id = 141, ParentId = 133, HaveChild = true, Title = "آبمیوه", Img = "" },
                new Category { Id = 142, ParentId = 141, HaveChild = false, Title = "خانواده", Img = "" },
                new Category { Id = 143, ParentId = 141, HaveChild = false, Title = "تک نفره", Img = "" },
                new Category { Id = 144, ParentId = 133, HaveChild = false, Title = "آب و آب معدنی، آب گازدار", Img = "" },
                new Category { Id = 145, ParentId = 133, HaveChild = true, Title = "نوشابه", Img = "" },
                new Category { Id = 146, ParentId = 145, HaveChild = false, Title = "خانواده", Img = "" },
                new Category { Id = 147, ParentId = 145, HaveChild = false, Title = "تک نفره", Img = "" },
                new Category { Id = 148, ParentId = 133, HaveChild = true, Title = "ماء الشعیر", Img = "" },
                new Category { Id = 149, ParentId = 148, HaveChild = false, Title = "خانواده", Img = "" },
                new Category { Id = 150, ParentId = 148, HaveChild = false, Title = "تک نفره", Img = "" },
                new Category { Id = 151, ParentId = 133, HaveChild = false, Title = "نوشابه انرژی زا", Img = "" },
                new Category { Id = 152, ParentId = 133, HaveChild = false, Title = "شربت", Img = "" },
                new Category { Id = 153, ParentId = 133, HaveChild = false, Title = "چای سبز و دمنوش گیاهی", Img = "" },
                new Category { Id = 154, ParentId = 133, HaveChild = false, Title = "عرقیات و گلاب", Img = "" },

                new Category { Id = 155, ParentId = 0, HaveChild = true, Title = "نان", Img = "" },
                new Category { Id = 156, ParentId = 155, HaveChild = false, Title = "نان تازه", Img = "" },
                new Category { Id = 157, ParentId = 155, HaveChild = false, Title = "نان تست، غنی شده، باگت و ...", Img = "" },
                new Category { Id = 158, ParentId = 155, HaveChild = false, Title = "نان لواش بسته بندی", Img = "" },
                new Category { Id = 159, ParentId = 155, HaveChild = false, Title = "نان خشک گندم و جو", Img = "" },

                new Category { Id = 160, ParentId = 0, HaveChild = true, Title = "عطر و ادکلن", Img = "" },
                new Category { Id = 161, ParentId = 160, HaveChild = false, Title = "ادکلن", Img = "" },
                new Category { Id = 162, ParentId = 160, HaveChild = false, Title = "اسپری بدن", Img = "" },
                new Category { Id = 163, ParentId = 160, HaveChild = false, Title = "اسپری خوشبو کننده هوا", Img = "" },
                new Category { Id = 164, ParentId = 160, HaveChild = false, Title = "عطر بیک", Img = "" },
                new Category { Id = 165, ParentId = 160, HaveChild = false, Title = "عطر خالص بدون الکل", Img = "" },
                new Category { Id = 166, ParentId = 160, HaveChild = false, Title = "عطر در ظروف اسپری", Img = "" }

                //  Category =new Category { Id = 3, ParentId = 0, HaveChild = true, Title = "", Img = ""  },
                );
        }

        public static void SeedProduct(this ModelBuilder modelBuilder)
        {
            var random = new Random();

            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product1.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 2, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product2.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 3, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product3.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 4, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product4.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 5, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product5.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 6, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product6.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 7, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product7.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 8, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product8.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 9, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product9.jpg", CategoryId = 1, Max = 10, Price = random.Next(100) * 1000 },
                new Product { Id = 10, Title = "نام محصول", Description = "توضیح", Img = "/img/product/product10.jpg", CategoryId = 1, Max = 10, SoldByWeight = true, MinWeight = 100, Price = random.Next(100) * 1000 }
            );
        }

        public static void AdminUserProduct(this ModelBuilder modelBuilder)
        {
            var adminId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = adminId, Name = "Admin", NormalizedName = "Admin", Description = "مدیر" },
                new Role { Id = Guid.NewGuid(), Name = "User", NormalizedName = "User", Description = "کاربر" },
                new Role { Id = Guid.NewGuid(), Name = "Seller", NormalizedName = "Seller", Description = "فروشگاه" },
                new Role { Id = Guid.NewGuid(), Name = "Delivery", NormalizedName = "Delivery", Description = "راننده" }
                );

            var passwordHasher = new PasswordHasher<User>();


            var user = new User
            {
                Id = userId,
                UserName = "admin",
                NormalizedUserName = "info@peikresan.com",
                Email = "info@peikresan.com",
                NormalizedEmail = "info@peikresan.com",
                EmailConfirmed = true,
                PasswordHash = passwordHasher.HashPassword(null, "Ali@41416"),
                SecurityStamp = string.Empty,
                //Role = new Role { Id = adminId, Name = "Admin" }
            };
            modelBuilder.Entity<User>().HasData(user);

            //modelBuilder.Entity<IdentityUserRole<Guid>>().HasData(new IdentityUserRole<Guid>
            //{
            //    RoleId = userId,
            //    UserId = adminId
            //});
        }

        public static void SeedSlider(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Slider>().HasData(
                new Slider { Id = 1, Title = "slide-1", Img = "/img/slider/slide-11.png" },
                new Slider { Id = 2, Title = "slide-1", Img = "/img/slider/slide-12.png" },
                new Slider { Id = 3, Title = "slide-1", Img = "/img/slider/slide-13.png" },
                new Slider { Id = 4, Title = "slide-1", Img = "/img/slider/slide-14.png" }
            );
        }

        public static void BannerSlider(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Banner>().HasData(
                // new Banner { Id = 1, Img = "/img/banner/banner-l-kalayeasasi.jpg", BannerType = BannerType.Big, Url = "/category/1" },

                // new Banner { Id = 2, Img = "/img/banner/banner-s-sobhane.jpg", BannerType = BannerType.Little, Url = "/category/63" },
                // new Banner { Id = 3, Img = "/img/banner/banner-s-labaniat.jpg", BannerType = BannerType.Little, Url = "/category/13" },

                // new Banner { Id = 4, Img = "/img/banner/banner-l-behdashti.jpg", BannerType = BannerType.Big, Url = "/category/23" },

                // new Banner { Id = 5, Img = "/img/banner/banner-s-mahsolatproteini.jpg", BannerType = BannerType.Little, Url = "/category/86" },
                // new Banner { Id = 6, Img = "/img/banner/banner-s-noshidani.jpg", BannerType = BannerType.Little, Url = "/category/133" },

                // new Banner { Id = 7, Img = "/img/banner/banner-l-konserv.jpg", BannerType = BannerType.Big, Url = "/category/96" },

                // new Banner { Id = 8, Img = "/img/banner/banner-s-dokhaniat.jpg", BannerType = BannerType.Little, Url = "/category/103" },
                // new Banner { Id = 9, Img = "/img/banner/banner-s-tanagholat.jpg", BannerType = BannerType.Little, Url = "/category/109" },

                // new Banner { Id = 10, Img = "/img/banner/banner-l-chashni.jpg", BannerType = BannerType.Big, Url = "/category/71" },

                // new Banner { Id = 11, Img = "/img/banner/banner-s-khoshkbar.jpg", BannerType = BannerType.Little, Url = "/category/126" },
                // new Banner { Id = 12, Img = "/img/banner/banner-s-naan.jpg", BannerType = BannerType.Little, Url = "/category/155" },

                // new Banner { Id = 13, Img = "/img/banner/banner-l-malzomat.jpg", BannerType = BannerType.Big, Url = "/category/79" }
                new Banner { Id = 1, Img = "/img/banner/banner-1-1.jpg", BannerType = BannerType.Little, Url = "/category/1", Title = "کالاهای اساسی و خواربار" },
                new Banner { Id = 2, Img = "/img/banner/banner-1-2.jpg", BannerType = BannerType.Little, Url = "/category/86", Title = "محصولات پروتئینی" },
                new Banner { Id = 3, Img = "/img/banner/banner-1-3.jpg", BannerType = BannerType.Little, Url = "/category/96", Title = "کنسرو و غذای آماده" },
                new Banner { Id = 4, Img = "/img/banner/banner-2-1.jpg", BannerType = BannerType.Little, Url = "/category/133", Title = "نوشیدنی" },
                new Banner { Id = 5, Img = "/img/banner/banner-2-2.jpg", BannerType = BannerType.Little, Url = "/category/13", Title = "لبنیات" },
                new Banner { Id = 6, Img = "/img/banner/banner-2-3.jpg", BannerType = BannerType.Little, Url = "/category/71", Title = "چاشنی و افزودنی" },
                new Banner { Id = 7, Img = "/img/banner/banner-3-1.jpg", BannerType = BannerType.Little, Url = "/category/23", Title = "بهداشتی و شوینده" },
                new Banner { Id = 8, Img = "/img/banner/banner-3-2.png", BannerType = BannerType.Little, Url = "/category/63", Title = "صبحانه" },
                new Banner { Id = 9, Img = "/img/banner/banner-3-3.jpg", BannerType = BannerType.Little, Url = "/category/155", Title = "نان" },
                new Banner { Id = 10, Img = "/img/banner/banner-4-1.jpg", BannerType = BannerType.Little, Url = "/category/109", Title = "تنقلات" },
                new Banner { Id = 11, Img = "/img/banner/banner-4-2.jpg", BannerType = BannerType.Little, Url = "/category/126", Title = "خشکبار و شیرینی" },
                new Banner { Id = 12, Img = "/img/banner/banner-4-3.jpg", BannerType = BannerType.Little, Url = "/category/103", Title = "دخانیات" },
                new Banner { Id = 13, Img = "/img/banner/banner-5-1.jpg", BannerType = BannerType.Little, Url = "/category/79", Title = "ملزومات خانگی" }
            );
        }
    }
}

