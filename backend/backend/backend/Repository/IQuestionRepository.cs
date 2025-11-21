using backend.Database.Models;

namespace backend.Repository
{
    public interface IQuestionRepository : IRepository<Question>
    {
        IEnumerable<Question> GetAllQuestionsOfQuiz(Guid quizId);
    }
}
