using backend.Database.Models;

namespace backend.Repository
{
    public interface IRoomRepository : IRepository<Room>
    {
        public Room? GetRoomByPIN(int pin);
        public Room? GetRoomByHostConnectionId(string hostConnectionId);
        public Room? GetByIdWithData(Guid id);
        public Room? GetByQuizId(Guid quizId);
    }
}
