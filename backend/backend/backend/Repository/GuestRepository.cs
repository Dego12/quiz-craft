using backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class GuestRepository: IGuestRepository
    {
        protected readonly DbContext Context;

        public GuestRepository(DbContext context)
        {
            Context = context;
        }
        public void Add(Guest guest)
        {
            if(guest.Room is null || guest is null)
            {
                throw new ArgumentNullException(nameof(guest));
            }
            Context.Set<Guest>().Add(guest);
            Context.SaveChanges();
        }

        public void Delete(Guest guest)
        {
            if (guest is null)
            {
                throw new ArgumentNullException(nameof(guest));
            }
            Context?.Set<Guest>().Remove(guest);
            Context?.SaveChanges();
        }

        public IEnumerable<Guest> GetAll()
        {
            return Context.Set<Guest>().ToList();
        }

        public Guest? GetById(Guid id)
        {
            return Context.Set<Guest>().Find(id);
        }

        public IEnumerable<Guest> GetGuestsFromRoom(Guid roomId)
        {
            return Context.Set<Guest>().Where(g => g.Room.Id == roomId);
        }

        public void Update(Guest guest)
        {
            if (guest is null)
            {
                throw new ArgumentNullException(nameof(guest));
            }
            Context.Set<Guest>().Attach(guest);
            var entry = Context.Entry(guest);
            entry.State=EntityState.Modified;
            Context.SaveChanges();
        }
    }
}
