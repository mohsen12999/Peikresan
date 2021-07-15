using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Peikresan.Data;
using Peikresan.Data.Dto;

namespace Peikresan.Services
{
    public class CommentServices
    {
        public static async Task<List<CommentDto>> GetAllComments(ApplicationDbContext context)
            => await context.Comments
                .Include(c => c.Product)
                .Select(comment => comment.ToDto())
                .AsNoTracking()
                .ToListAsync();
    }
}
