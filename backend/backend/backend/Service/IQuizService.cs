using backend.Repository;
using backend.Database.Models;

namespace backend.Service
{
    public interface IQuizService
    {
        Quiz? FindById(Guid id);
        Quiz? FindByIdWithAllData(Guid id);
        IEnumerable<Quiz> GetAllQuizzes(Guid userId);
        void AddQuiz(Quiz quiz, Guid userId);
        void DeleteQuiz(Guid id);
        void UpdateQuiz(Quiz quiz);
        bool validateToken(string token);
        Guid? getUserId(string token);
    }
}
