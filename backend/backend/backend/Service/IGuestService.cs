using backend.Database.Models;

namespace backend.Service
{
    public interface IGuestService
    {
        void AddGuest(Guest guest,Guid roomId);
        IEnumerable<Guest> GetAllGuests();
        Guest FindById(Guid guestId);
        void DeleteGuest(Guid guestId);
        void UpdateGuest(Guest guest);
        int AnswerQuestion(Guid guestId,Guid questionId,Guid answerId,int time);
        IEnumerable<Guest> GetGuestsFromRoom(Guid roomId);
        Room? FindRoomByGuest(Guid guestRoomId, Guid roomId);
    }
}
