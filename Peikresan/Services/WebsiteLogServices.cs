using System;
using System.Threading.Tasks;
using Peikresan.Data;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class WebsiteLogServices
    {
        public static async Task<int> SaveEventLog(ApplicationDbContext context, WebsiteLog eventLog)
        {
            try
            {
                await context.WebsiteLog.AddAsync(eventLog);
                await context.SaveChangesAsync();
                return eventLog.Id;
            }
            catch (Exception)
            {
                return 0;
            }
        }
    }
}
