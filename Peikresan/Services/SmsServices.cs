using System;
using System.Collections.Generic;
using SmsIrRestful;

namespace Peikresan.Services
{
    public static class SmsServices
    {
        private const string SecretKey = "Peikresan@SmsIr";
        private const string UserApiKey = "24667f7e22d733a35d607f7e";
        private const string LineNumber = "3000235173";
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


        public static bool Sms2CostumerAfterBuy(string mobile, string name, int orderId)
        {
            var message =
                "پیک‌رسان\n" + name +
                " عزیز\nسفارش تان ثبت شد و در حال پردازش آن هستیم شما می‌توانید وضعیت آن را از نشانی زیر پیگیری کنید.\nشماره سفارش : " + orderId +
                "\nلینک پیگیری : https://peikresan.com/my-order/" + Helper.EncodeNumber(orderId);
            return SendSms(mobile, message);
        }

        public static bool Sms2AdminAfterBuy(int orderId, int price)
        {
            var message = "مدیر محترم سایت،\n سفارشی با شماره پیگیری " + orderId + " به مبلغ " + price + " تومان ثبت گردید.\nپیک رسان ";
            return SendSms(AdminNumber, message);
        }

        public static bool Sms2SellerAfterBuy(string mobile, int subOrderId, string time)
        {
            var message = "پیک‌رسان\nفروشنده گرامی سلام\nدر حساب کاربری شما یک سفارش به شماره " + subOrderId +
                          " برای تحویل " + time +
                          " به ثبت رسیده است. جهت آماده‌سازی و ارسال آن به مشتری به لینک زیر مراجعه کنید: https://peikresan.com/suborder/" + Helper.EncodeNumber(subOrderId);
            return SendSms(mobile, message);
        }

        public static bool Sms2DeliveryAfterBuy(string mobile, int orderId, string time)
        {
            var message = "پیک‌رسان\nراننده گرامی سلام\nسفارشی با کد پیگیری " + orderId + " برای تحویل " + time +
                          " برای شما ثبت شده است.برای اطلاع بیشتر به لینک زیر مراجعه کنید : https://peikresan.com/suborder/[code] " + Helper.EncodeNumber(orderId);
            return SendSms(mobile, message);
        }

        public static bool Sms2CostumerAfterDeliveryGetProducts(string mobile, string name, int orderId)
        {
            var message = "پیک رسان\n" + name +
            " عزیز\nسفارش تان را به مامور ارسال تحویل دادیم این سفارش تا لحظاتی دیگر به دست تان می‌رسد.\nلطفا برای تکمیل فرآیند تحویل سفارش تان کد تحویل را به مامور ارسال ارائه کنید.\n شماره سفارش :" + orderId;
            return SendSms(mobile, message);
        }

        public static bool Sms2CostumerAfterDeliverProducts(string mobile, string name, int orderId)
        {
            var message = "پیک رسان\n" + name +
                          " عزیز\nاز خریدتان ممنونیم.از شما دعوت میکنیم تا از طریق نشانی زیر به پرسش های ما پاسخ دهید و با بیان نظرهای خود کمک کنید تا کیفیت خدمات مان را بهبود دهیم.\nلینک :";
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
