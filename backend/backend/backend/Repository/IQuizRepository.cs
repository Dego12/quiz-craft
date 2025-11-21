using backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public interface IQuizRepository : IRepository<Quiz>
    {
        Quiz GetByIdWithAllData(Guid id);
        IEnumerable<Quiz> GetAllOfUser(Guid userId);
    }
}
