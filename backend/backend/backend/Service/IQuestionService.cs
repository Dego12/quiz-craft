using backend.Database.Models;
using backend.Repository;

namespace backend.Service
{
    public interface IQuestionService
    {
        Question? FindById(Guid id);
        IEnumerable<Question> GetAllQuestions(Guid quizId);
        void AddQuestion(Question question, Guid quizId);
        void DeleteQuestion(Guid id);
        void UpdateQuestion(Question question);
    }
}
