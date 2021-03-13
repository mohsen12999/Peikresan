using System;

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
    }
}
