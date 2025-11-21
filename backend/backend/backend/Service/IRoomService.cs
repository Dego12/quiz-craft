using backend.Database.Models;

namespace backend.Service
{
    public interface IRoomService
    {
        IEnumerable<Room> GetAllRooms();
        Room? FindById(Guid id);
        Room? FindByHostConnectionId(string hostConnectionId);
        Room CreateRoom(Guid quizId);
        void DeleteRoom(Guid id);
        Room? UpdateRoom(Room room);

        Room? FindByPIN(int pin);
        Room? FindByIdWithData(Guid id);
        public Room UpdateRoomState(Guid roomId, RoomState state);
        public Room? FindByQuizId(Guid quizId);
        Room? UpdateLimitOfPlayers(Guid roomId, int limitOfPlayers);
        Boolean CanGuestEnter(Guid roomId);
    }
}
