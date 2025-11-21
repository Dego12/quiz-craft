using backend.Database.Models;

namespace backend.Repository
{
    public interface IUserRepository:IRepository<User>
    {
        public User? GetByEmail(String email);

        public IEnumerable<User>? GetByName(String name);
    }
}
