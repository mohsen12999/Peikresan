using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Peikresan.Data;
using Peikresan.Data.ClientModels;

namespace Peikresan.Services
{
    public static class CategoryServices
    {
        public static async Task<List<ClientCategory>> GetAllCategories(ApplicationDbContext context)
            => await context.Categories
                .Select(category => category.ConvertToClientCategory())
                .AsNoTracking()
                .ToListAsync();
    }
}
