using Microsoft.EntityFrameworkCore;
using backend.Database.Models;

namespace backend.Repository
{
    public class AnswerRepository : IAnswerRepository
    {
        protected readonly DbContext Context;

        public AnswerRepository(DbContext context)
        {
            Context = context;
        }

        public Answer? GetById(Guid id)
        {
            return Context.Set<Answer>().Find(id);
        }

        public IEnumerable<Answer> GetAll()
        {
            return Context.Set<Answer>().ToList();
        }

        public void Add(Answer answer)
        {
            Context.Set<Answer>().Add(answer);
            Context.SaveChanges();
        }

        public void Delete(Answer answer)
        {
            if (answer == null)
            {
                throw new ArgumentNullException(nameof(answer));
            }
            Context.Set<Answer>().Remove(answer);
            Context.SaveChanges();
        }

        public void Update(Answer answer)
        {
            if (answer == null)
            {
                throw new ArgumentNullException(nameof(answer));
            }

            Context.Set<Answer>().Attach(answer);
            var entry = Context.Entry(answer);
            entry.State = EntityState.Modified;
            Context.SaveChanges();
        }

        public IEnumerable<Answer> GetAllOfQuestion(Guid questionId)
        {
            return Context.Set<Answer>().Where(a => a.Question.Id.CompareTo(questionId) == 0).ToList();
        }
    }
}
