using backend.Database.Models;
using backend.Database;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class UserRepository : IUserRepository
    {
        protected readonly DbContext Context;

        public UserRepository(DbContext context)
        {
            Context = context;
        }

        public User? GetById(Guid id)
        {
            return Context.Set<User>().Find(id);
        }

        public IEnumerable<User> GetAll()
        {
            return Context.Set<User>().ToList();
        }

        public void Add(User entity)
        {
            Context.Set<User>().Add(entity);
            Context.SaveChanges();
        }

        public void Update(User entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            Context.Set<User>().Attach(entity);
            var entry = Context.Entry(entity);
            entry.State = EntityState.Modified;
            Context.SaveChanges();
        }

        public void Delete(User entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            Context.Set<User>().Remove(entity);
            Context.SaveChanges();
        }

        public User? GetByEmail(String email)
        {
            var result = Context.Set<User>().Where(u => u.Email == email);
            
            if(result.Count() != 1)
            {
                return null;
            }
            else
            {
                return result.FirstOrDefault();
            }
        }

        public IEnumerable<User>? GetByName(String name)
        {
            return Context.Set<User>().Where(u => u.Name == name).ToList();
        }

    }
}
