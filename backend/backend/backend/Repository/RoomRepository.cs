using backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class RoomRepository : IRoomRepository
    {
        protected readonly DbContext Context;

        public RoomRepository(DbContext context)
        {
            Context = context;
        }

        public void Add(Room entity)
        {
            Context.Set<Room>().Add(entity);
            Context.SaveChanges();
        }

        public void Delete(Room entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            Context.Set<Room>().Remove(entity);
            Context.SaveChanges();
        }

        public IEnumerable<Room> GetAll()
        {
            return Context.Set<Room>().ToList();
        }

        public Room? GetById(Guid id)
        {
            return Context.Set<Room>().Find(id);
        }

        public Room? GetByIdWithData(Guid id)
        {
            return Context.Set<Room>().Where(r => r.Id == id).Include(r => r.Quiz).ThenInclude(q => q.Questions).ThenInclude(q => q.Answers).FirstOrDefault();
        }

        public Room? GetRoomByHostConnectionId(string hostConnectionId)
        {
            return Context.Set<Room>().Where(r => r.HostConnectionId == hostConnectionId).Include(r => r.Quiz).ThenInclude(q => q.Questions).ThenInclude(q => q.Answers).FirstOrDefault();
        }

        public Room? GetByQuizId(Guid quizId)
        {
            return Context.Set<Room>().Where(r => r.Quiz!.Id == quizId && r.State != RoomState.Finished).FirstOrDefault();
        }

        public Room? GetRoomByPIN(int pin)
        {
            var result = Context.Set<Room>().Where(r => r.Pin == pin && r.State != RoomState.Finished).Include(r => r.Quiz).ThenInclude(q => q.Questions).ThenInclude(q => q.Answers);

            if (result.Count() != 1)
            {
                return null;
            }
            else
            {
                return result.FirstOrDefault();
            }
        }

        public void Update(Room entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            Context.Set<Room>().Attach(entity);
            var entry = Context.Entry(entity);
            entry.State = EntityState.Modified;
            Context.SaveChanges();
        }
    }
}
