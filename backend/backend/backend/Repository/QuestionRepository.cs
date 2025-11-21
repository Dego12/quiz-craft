using Microsoft.EntityFrameworkCore;
using backend.Database.Models;

namespace backend.Repository
{
    public class QuestionRepository : IQuestionRepository
    {
        protected readonly DbContext Context;

        public QuestionRepository(DbContext context)
        {
            Context = context;
        }

        public Question? GetById(Guid id)
        {
            return Context.Set<Question>().Find(id);
        }

        public IEnumerable<Question> GetAll()
        {
            return Context.Set<Question>().ToList();
        }

        public void Add(Question question)
        {
            Context.Set<Question>().Add(question);
            Context.SaveChanges();
        }

        public void Delete(Question question)
        {
            if (question == null)
            {
                throw new ArgumentNullException(nameof(question));
            }
            Context.Set<Question>().Remove(question);
            Context.SaveChanges();
        }

        public void Update(Question question)
        {
            if (question == null)
            {
                throw new ArgumentNullException(nameof(question));
            }

            Context.Set<Question>().Attach(question);
            var entry = Context.Entry(question);
            entry.State = EntityState.Modified;
            Context.SaveChanges();
        }

        public IEnumerable<Question> GetAllQuestionsOfQuiz(Guid quizId)
        {
            return Context.Set<Question>().Where(q => q.Quiz.Id.CompareTo(quizId) == 0).ToList();
        }
    }
}
