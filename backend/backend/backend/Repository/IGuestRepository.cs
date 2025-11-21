using backend.Database.Models;

namespace backend.Repository
{
    public interface IGuestRepository: IRepository<Guest>
    {
        IEnumerable<Guest> GetGuestsFromRoom(Guid roomId);
    }
}
