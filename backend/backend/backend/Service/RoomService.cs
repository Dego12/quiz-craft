using backend.Database.Models;
using backend.Repository;
using Microsoft.AspNetCore.Connections.Features;

namespace backend.Service
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _repository;
        private readonly IQuizRepository _quizRepository;
        private readonly IGuestRepository _guestRepository;

        public RoomService(IRoomRepository repository, IQuizRepository quizRepository, IGuestRepository guestRepository)
        {
            _repository = repository;
            _quizRepository = quizRepository;
            _guestRepository = guestRepository;
        }

        public Room CreateRoom(Guid quizId)
        {
            var quiz = _quizRepository.GetById(quizId);
            var room = new Room();

            room.State = RoomState.Waiting;
            room.Quiz = quiz;

            var pinGenerator = new Random();
            int pin;
            Room foundRoom;
            do
            {
                pin = pinGenerator.Next(100000, 1000000);
                foundRoom = _repository.GetAll().FirstOrDefault(x => (x.State == RoomState.Waiting || x.State == RoomState.Started) && x.Pin == pin);
            } while (foundRoom != null);

            room.Pin = pin;
            _repository.Add(room);

            quiz.readOnly = true;
            quiz.NumberOfPlays++;
            _quizRepository.Update(quiz);

            return room;
        }

        public void DeleteRoom(Guid id)
        {
            var room = _repository.GetById(id);
            if (room != null)
            {
                _repository.Delete(room);
            }
        }

        public Room? FindById(Guid id)
        {
            return _repository.GetById(id);
        }

        public Room? FindByIdWithData(Guid id)
        {
            return _repository.GetByIdWithData(id);
        }

        public Room? FindByHostConnectionId(string hostConnectionId)
        {
            return _repository.GetRoomByHostConnectionId(hostConnectionId);
        }

        public Room? FindByPIN(int pin)
        {
            return _repository.GetRoomByPIN(pin);
        }

        public IEnumerable<Room> GetAllRooms()
        {
            return _repository.GetAll();
        }

        public Room? UpdateRoom(Room room)
        {
            var existingRoom = _repository.GetById(room.Id);
            if (existingRoom != null)
            {
                existingRoom.Pin = room.Pin;
                existingRoom.State = room.State;
                existingRoom.HostConnectionId = room.HostConnectionId;
                existingRoom.Guests = room.Guests;
                _repository.Update(existingRoom);
            }
            return existingRoom;
        }

        public Room UpdateRoomState(Guid roomId, RoomState state)
        {
            Room room = _repository.GetById(roomId);
            if (room != null)
            {
                room.State = state;
                _repository.Update(room);
            }
            return room;
        }

        public Room? UpdateLimitOfPlayers(Guid roomId, int limitOfPlayers)
        {
            Room room = _repository.GetById(roomId);
            int guestsInRoom = _guestRepository.GetGuestsFromRoom(roomId).Count();

            if (room != null)
            {
                if (limitOfPlayers <= 0)
                {
                    room.limitOfPlayers = 1;
                    _repository.Update(room);
                }
                if (limitOfPlayers < guestsInRoom)
                {
                    room.limitOfPlayers = guestsInRoom;
                    _repository.Update(room);
                }
                else
                {
                    room.limitOfPlayers = limitOfPlayers;
                    _repository.Update(room);
                }
            }
            if (room == null)
            {
                return null;
            }
            return room;
        }

        public Room? FindByQuizId(Guid quizId)
        {
            return _repository.GetByQuizId(quizId);
        }

        public Boolean CanGuestEnter(Guid roomId)
        {
            var room = _repository.GetById(roomId);
            int numberOfGuests = _guestRepository.GetGuestsFromRoom(roomId).Count();
            if (room != null)
            {
                if (room.limitOfPlayers == null)
                {
                    return true;
                }
                if (room.limitOfPlayers != numberOfGuests)
                    return true;
            }
            return false;
        }

    }
}
