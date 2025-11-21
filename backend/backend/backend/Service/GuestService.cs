using backend.Database.Models;
using backend.Repository;

namespace backend.Service
{
    public class GuestService : IGuestService
    {
        private readonly IGuestRepository _repository;
        private readonly IAnswerRepository _answerRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly IRoomRepository _roomRepository;

        public GuestService(IGuestRepository repository, IAnswerRepository answerRepository, IQuestionRepository questionRepository, IRoomRepository roomRepository)
        {
            _repository=repository;
            _answerRepository=answerRepository;
            _questionRepository=questionRepository;
            _roomRepository=roomRepository;

        }
        public void AddGuest(Guest guest,Guid roomId)
        {
            Room room = _roomRepository.GetById(roomId);
            room.Guests?.Add(guest);
            guest.Room=room;
            _repository.Add(guest);
        }

        public int AnswerQuestion(Guid guestId, Guid questionId, Guid answerId, int time)
        {
            var guest = _repository.GetById(guestId);
            var question = _questionRepository.GetById(questionId);
            var chosenAnswer = _answerRepository.GetById(answerId);
            var allAnswersOfQuestion = _answerRepository.GetAllOfQuestion(questionId);

            if (allAnswersOfQuestion.FirstOrDefault(a => a.Id == answerId) is null)
            {
                throw new ArgumentNullException();
            }

            if (!chosenAnswer.isCorrect || time >= question.Timer)
            {
                return 0;
            }

            float calculatedScore = (1 - ((float)time / question.Timer / 2)) * 1000 + 0.5f; // kahoot formula
            guest.Score = guest.Score + (int)calculatedScore;
            UpdateGuest(guest);
            return (int)calculatedScore;
        }

        public void DeleteGuest(Guid guestId)
        {
            var guest = _repository.GetById(guestId);
            _repository.Delete(guest);
        }

        public Guest? FindById(Guid guestId)
        {
            return _repository.GetById(guestId);
        }

        public IEnumerable<Guest> GetAllGuests()
        {
            return _repository.GetAll();
        }

        public IEnumerable<Guest> GetGuestsFromRoom(Guid roomId)
        {
            return _repository.GetGuestsFromRoom(roomId);
        }

        public void UpdateGuest(Guest guest)
        {
            var existingGuest = _repository.GetById(guest.Id);
            if(existingGuest != null)
            {
                existingGuest.Score = guest.Score;
                existingGuest.Name = guest.Name;
                _repository.Update(existingGuest);
            }
        }

        public Room? FindRoomByGuest(Guid guestRoomId, Guid roomId)
        {
            var room = _roomRepository.GetById(roomId);
            if (guestRoomId != roomId || room is null)
            {
                return null;
            }
            return room;
        }
    }
}
