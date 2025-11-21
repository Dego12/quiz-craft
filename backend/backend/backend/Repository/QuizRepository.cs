using backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class QuizRepository : IQuizRepository
    {

        protected readonly DbContext Context;

        public QuizRepository(DbContext context)
        {
            Context = context;
        }

        public Quiz? GetById(Guid id)
        {
            return Context.Set<Quiz>().Find(id);
        }

        public Quiz? GetByIdWithAllData(Guid id)
        {
            return Context.Set<Quiz>().Where(q => q.Id == id).Include(q => q.Questions).ThenInclude(q => q.Answers).FirstOrDefault();
        }

        public IEnumerable<Quiz> GetAll()
        {
            return Context.Set<Quiz>().ToList();
        }

        public void Add(Quiz quiz)
        {
            Context.Set<Quiz>().Add(quiz);
            Context.SaveChanges();
        }

        public void Delete(Quiz quiz)
        {
            if (quiz == null)
            {
                throw new ArgumentNullException(nameof(quiz));
            }
            Context.Set<Quiz>().Remove(quiz);
            Context.SaveChanges();
        }

        public void Update(Quiz quiz)
        {
            if (quiz == null)
            {
                throw new ArgumentNullException(nameof(quiz));
            }

            Context.Set<Quiz>().Attach(quiz);
            var entry = Context.Entry(quiz);
            entry.State = EntityState.Modified;
            Context.SaveChanges();
        }
        
        public IEnumerable<Quiz> GetAllOfUser(Guid userId)
        {
            return Context.Set<Quiz>().Where(q => q.Owner.Id.CompareTo(userId) == 0).Include(q => q.Questions).ThenInclude(q => q.Answers).ToList();
        }
    }   
}
