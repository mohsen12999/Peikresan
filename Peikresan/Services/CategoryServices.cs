using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Peikresan.Data;
using Peikresan.Data.Dto;

namespace Peikresan.Services
{
    public static class CategoryServices
    {
        public static async Task<List<CategoryDto>> GetAllCategories(ApplicationDbContext context)
            => await context.Categories
                .Select(category => category.ToDto())
                .AsNoTracking()
                .ToListAsync();
    }
}
