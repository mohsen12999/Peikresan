using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Peikresan.Data;
using Peikresan.Data.ClientModels;

namespace Peikresan.Services
{
    public static class ProductServices
    {
        public static async Task<List<ClientProduct>> GetAllProducts(ApplicationDbContext context)
            => await context.Products
                .Include(p=>p.Category)
                .Select(product => product.ConvertToClientProduct())
                .AsNoTracking()
                .ToListAsync();
    }
}
