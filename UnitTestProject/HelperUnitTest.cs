using System;
using Peikresan.Data.Models;
using Peikresan.Services;
using Xunit;

namespace UnitTestProject
{
    public class HelperUnitTest
    {
        [Theory]
        [InlineData(7)]
        [InlineData(52)]
        [InlineData(120)]
        [InlineData(1457)]
        public void Helper_EnCode_Decode_Test(int number)
        {
            var code = Helper.EncodeNumber(number);
            var decoded = Helper.DecodeNumber(code);

            Assert.Equal(decoded, number);
        }

        [Theory]
        [InlineData(null, "")]
        [InlineData(7, "07:00")]
        [InlineData(12, "12:00")]
        [InlineData(7.5, "07:30")]
        [InlineData(0.5, "00:30")]
        [InlineData(3.25, "03:15")]
        public void MakeTimeFromNullableNumber_Test(double? number, string hour)
        {
            var output = Helper.MakeTimeFromNullableNumber(number);
            Assert.Equal(hour, output);
        }

        [Theory]
        [InlineData(7, 0, 7.0)]
        [InlineData(12, 0, 12.0)]
        [InlineData(7, 30, 7.5)]
        [InlineData(4, 15, 4.25)]
        [InlineData(3, 45, 3.75)]
        public void ChangeDateTimeToNumber_Test(int hour, int minute, double number)
        {
            // Arrange
            var dateNow = DateTime.Now;
            var date = new DateTime(dateNow.Year, dateNow.Month, dateNow.Day, hour, minute, dateNow.Second);

            // Act
            var output = Helper.ChangeDateTimeToNumber(date);

            // Assert
            Assert.Equal(number, output);
        }

        [Fact]
        public void IsOpenNullableUser_NullUser_Test()
        {
            // Arrange & Act
            var isOpen = Helper.IsOpenNullableUser(null, new DateTime());

            // Assert
            Assert.False(isOpen);
        }

        [Fact]
        public void IsOpenUser_nullTimes_Test()
        {
            // Arrange
            var user = new User { OpenTime = null, CloseTime = null };

            // Act
            var isOpen = Helper.IsOpenUser(user, new DateTime());

            // Assert
            Assert.True(isOpen);
        }

        [Theory]
        [InlineData(6, 0, 8, 20, false)]
        [InlineData(8, 45, 8.5, 20, true)]
        [InlineData(10, 0, 8, 20, true)]
        [InlineData(18, 55, 8, 20, true)]
        [InlineData(20, 01, 8, 20, false)]
        public void IsOpenUser_OneOpenTime_Test(int hour, int minute, double openTime, double closeTime, bool result)
        {
            // Arrange
            var dateNow = DateTime.Now;
            var date = new DateTime(dateNow.Year, dateNow.Month, dateNow.Day, hour, minute, dateNow.Second);
            var user = new User { OpenTime = openTime, CloseTime = closeTime };

            // Act
            var output = Helper.IsOpenUser(user, date);

            // Assert
            Assert.Equal(result, output);
        }

        [Theory]
        [InlineData("EXPRESS",0,"فوری")]
        [InlineData("TODAY",8,"امروز")]
        [InlineData("TOMORROW",20,"فردا")]
        public void OrderDeliverTime_Test(string deliverDay, int deliverTime, string result)
        {
            var order = new Order {DeliverDay = deliverDay, DeliverTime = deliverTime};

            var output = Helper.OrderDeliverTime(order);

            Assert.Contains(result, output);
        }
    }
}
