using System;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class Helper
    {
        public static string EncodeNumber(int number) =>
            Microsoft.AspNetCore.WebUtilities.Base64UrlTextEncoder.Encode(BitConverter.GetBytes(number));

        public static int DecodeNumber(string code) =>
            BitConverter.ToInt32(Microsoft.AspNetCore.WebUtilities.Base64UrlTextEncoder.Decode(code));

        //public static string EncodeNumber(int number)
        //{
        //    var bytes = BitConverter.GetBytes(number);
        //    var base64String = Convert.ToBase64String(bytes);
        //    var encodedString = System.Web.HttpUtility.UrlEncode(base64String);
        //    Microsoft.AspNetCore.WebUtilities.Base64UrlTextEncoder.Encode(BitConverter.GetBytes(number));
        //    return encodedString;
        //}

        //public static int DecodeNumber(string code)
        //{
        //    var decodedString = System.Web.HttpUtility.UrlDecode(code);
        //    var bytes = Convert.FromBase64String(decodedString);
        //    var number = BitConverter.ToInt32(bytes, 0);

        //    return number;
        //}

        public static string MakeTimeFromNullableNumber(double? number) => number == null ? "" : MakeTimeFromNumber((double)number);

        public static string MakeTimeFromNumber(double number) =>
            ChangeNumberToClockNumber((int)(number - number % 1)) + ":" +
            ChangeNumberToClockNumber((int)(number * 60 % 60));

        public static string ChangeNumberToClockNumber(int number) => number < 10 ? "0" + number : number.ToString();

        public static double ChangeDateTimeToNumber(DateTime date) => date.Hour + (date.Minute / 60.0);

        public static bool IsOpenNullableUser(User? user, DateTime dateTime) =>
            user != null && IsOpenUser(user, dateTime);

        public static bool IsOpenUser(User user, DateTime dateTime) =>
            (user.OpenTime == null || user.CloseTime == null) ||
            (ChangeDateTimeToNumber(dateTime) > user.OpenTime &&
            ChangeDateTimeToNumber(dateTime) < user.CloseTime) ||
            (user.OpenTime2 != null && user.CloseTime2 != null &&
             ChangeDateTimeToNumber(dateTime) > user.OpenTime2 &&
             ChangeDateTimeToNumber(dateTime) < user.CloseTime2);

        // public static bool IsOpenUserNow(User user) => IsOpenUser(user, DateTime.Now);

        public static string OrderDeliverTime(Order order) =>
            order.DeliverTime == 0 ?
                "فوری" :
                (order.DeliverDay == "TODAY" ? "امروز" : "فردا") + " ساعت " + order.DeliverTime;

    }
}
