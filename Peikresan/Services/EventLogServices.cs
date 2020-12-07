﻿using System;
using System.Threading.Tasks;
using Peikresan.Data;
using Peikresan.Data.Models;

namespace Peikresan.Services
{
    public static class EventLogServices
    {
        public static async Task<int> SaveEventLog(ApplicationDbContext context, EventLog eventLog)
        {
            try
            {
                await context.EventLogs.AddAsync(eventLog);
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
