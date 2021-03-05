using System;
using System.Collections.Generic;
using SmsIrRestful;

namespace Peikresan.Services
{
    public static class SmsServices
    {
        private const string UserApiKey = "Peikresan@SmsIr";
        private const string SecretKey = "df1d8ed01c5e9aa6172b8ed0";
        private const string LineNumber = "30003472012345";
        private const string AdminNumber = "09116310982";

        //public SmsServices()
        //{
        //    SmsIrRestful.Token tk = new SmsIrRestful.Token();
        //    string result = tk.GetToken(UserApiKey, SecretKey);
        //}


        private static bool SendSms(string number, string message)
        {
            var token = new Token().GetToken(UserApiKey, SecretKey);
            var messageSendObject = new MessageSendObject()
            {
                Messages = new List<string> { message }.ToArray(),
                MobileNumbers = new List<string> { number }.ToArray(),
                LineNumber = LineNumber,
                SendDateTime = null,
                CanContinueInCaseOfError = true
            };

            var messageSendResponseObject = new MessageSend().Send(token, messageSendObject);

            return messageSendResponseObject.IsSuccessful;
        }


        public static bool Sms2CostumerAfterBuy(string mobile, int orderId)
        {
            var message =
                "مشتری گرامی،\n سفارش ما با شماره پیگیری " + orderId + " ثبت شد و در زمان تعیین شده ارسال می شود.\nپیک رسان ";
            return SendSms(mobile, message);
        }

        public static bool Sms2AdminAfterBuy(string mobile, int orderId, int price)
        {
            var message = "مدیر محترم سایت،\n سفارشی با شماره پیگیری " + orderId + " به مبلغ " + price + " تومان ثبت گردید.\nپیک رسان ";
            return SendSms(mobile, message);
        }

        public static bool Sms2SellerAfterBuy(string mobile, int subOrderId, string time)
        {
            var message = "فروشنده گرامی،\n سفارشی با کد پیگیری " + subOrderId + " برای فروشگاه شما ثبت گردید. برای اطلاع به لینک زیر مراجعه کنید.\nپیک رسان \n https://peikresan.com/suborder/" + Helper.EncodeNumber(subOrderId);
            return SendSms(mobile, message);
        }

        public static bool Sms2DeliveryAfterBuy(string mobile, int orderId)
        {
            var message = "راننده گرامی،\nسفارشی با کد پیگیری " + orderId + " برای شما ثبت شد. برای اطلاع بیشتر به لینک زیر مراجعه کنید.\n پیک رسان\n https://peikresan.com/suborder/[code] " + Helper.EncodeNumber(orderId);
            return SendSms(mobile, message);
        }

        private static bool UltraFastSms(long mobile, int templateId, List<UltraFastParameters> parameterArray)
        {
            var token = new Token().GetToken(UserApiKey, SecretKey);

            var ultraFastSend = new UltraFastSend()
            {
                Mobile = mobile,
                TemplateId = templateId,
                ParameterArray = parameterArray.ToArray()
            };

            var ultraFastSendResponse = new UltraFast().Send(token, ultraFastSend);

            return ultraFastSendResponse.IsSuccessful;
        }


        public static bool FastSms2CostumerAfterBuy(string mobile, int orderId)
        {
            var mobileLong = Convert.ToInt64(mobile);
            return UltraFastSms(mobileLong, 44302, new List<UltraFastParameters>
            {
                new UltraFastParameters()
                {
                    Parameter = "order_id", ParameterValue = orderId.ToString()
                }
            });
        }

        public static bool FastSms2AdminAfterBuy(int orderId, int price)
        {
            var mobileLong = Convert.ToInt64(AdminNumber);
            return UltraFastSms(mobileLong, 44305, new List<UltraFastParameters>
            {
                new UltraFastParameters()
                {
                    Parameter = "order_id", ParameterValue = orderId.ToString()
                },
                new UltraFastParameters()
                {
                    Parameter = "price", ParameterValue = price.ToString()
                }
            });
        }

        public static bool FastSms2SellerAfterBuy(string mobile, int subOrderId)
        {
            var mobileLong = Convert.ToInt64(mobile);
            return UltraFastSms(mobileLong, 44306, new List<UltraFastParameters>
            {
                new UltraFastParameters()
                {
                    Parameter = "suborder_id", ParameterValue = subOrderId.ToString()
                },
                new UltraFastParameters()
                {
                    Parameter = "code", ParameterValue = Helper.EncodeNumber(subOrderId)
                }
            });
        }

        public static bool FastSms2DeliveryAfterBuy(string mobile, int orderId)
        {
            var mobileLong = Convert.ToInt64(mobile);
            return UltraFastSms(mobileLong, 44329, new List<UltraFastParameters>
            {
                new UltraFastParameters()
                {
                    Parameter = "order_id", ParameterValue = orderId.ToString()
                },
                new UltraFastParameters()
                {
                    Parameter = "code", ParameterValue = Helper.EncodeNumber(orderId)
                }
            });
        }
    }
}
