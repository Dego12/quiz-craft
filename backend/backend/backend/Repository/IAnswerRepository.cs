using backend.Database.Models;

namespace backend.Repository
{
    public interface IAnswerRepository : IRepository<Answer>
    {
        IEnumerable<Answer> GetAllOfQuestion(Guid questionId);
    }
}
