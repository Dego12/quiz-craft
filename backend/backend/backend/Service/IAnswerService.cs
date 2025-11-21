using backend.Database.Models;
using backend.Repository;

namespace backend.Service
{
    public interface IAnswerService
    {
        Answer? FindById(Guid id);
        IEnumerable<Answer> GetAllAnswers(Guid questionId);
        void AddAnswer(Answer answer, Guid questionId);
        void DeleteAnswer(Guid id);
        void UpdateAnswer(Answer answer);
    }
}
