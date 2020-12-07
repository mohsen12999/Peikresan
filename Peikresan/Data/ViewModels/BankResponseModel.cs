namespace Peikresan.Data.ViewModels
{
    public class BankResponseModel{
        public int respcode { get; set; }
        public string respmsg { get; set; }
        public long amount { get; set; }
        public string invoiceid { get; set; }
        public string payload { get; set; }
        public long terminalid { get; set; }
        public long tracenumber { get; set; }
        public long rrn { get; set; }
        public string datePaid { get; set; }
        public string digitalreceipt { get; set; }
        public string issuerbank { get; set; }
        public string cardnumber { get; set; }
    }
}
