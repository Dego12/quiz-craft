using backend.Repository;
using backend.Database.Models;
using backend.Model.Authorization;

namespace backend.Service
{
    public class AnswerService : IAnswerService
    {
        private readonly IAnswerRepository _repository;
        private readonly IQuestionRepository _questionRepository;
        private readonly IJwtUtils _jwtUtils;

        public AnswerService(IAnswerRepository repository, IQuestionRepository questionRepository, IJwtUtils jwtUtils)
        {
            _repository = repository;
            _questionRepository = questionRepository;
            _jwtUtils = jwtUtils;
        }

        public Answer? FindById(Guid id)
        {
            return _repository.GetById(id);
        }

        public IEnumerable<Answer> GetAllAnswers()
        {
            return _repository.GetAll();
        }

        public IEnumerable<Answer> GetAllAnswers(Guid questionId)
        {
            return _repository.GetAllOfQuestion(questionId);
        }

        public void AddAnswer(Answer answer, Guid questionId)
        {
            Question question = _questionRepository.GetById(questionId);
            answer.Question = question;
            _repository.Add(answer);
        }

        public void DeleteAnswer(Guid id)
        {
            var existingAnswer = _repository.GetById(id);
            if (existingAnswer != null)
            {
                _repository.Delete(existingAnswer);
            }
        }

        public void UpdateAnswer(Answer answer)
        {
            var existingAnswer = _repository.GetById(answer.Id);
            if (existingAnswer != null)
            {
                existingAnswer.Text = answer.Text;
                existingAnswer.isCorrect = answer.isCorrect;
                _repository.Update(existingAnswer);
            }
        }
    }
}
