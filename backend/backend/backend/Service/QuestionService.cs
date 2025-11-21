using backend.Repository;
using backend.Database.Models;
using backend.Model.Authorization;

namespace backend.Service
{
    public class QuestionService : IQuestionService
    {
        protected readonly IQuestionRepository _repository;
        protected readonly IJwtUtils _jwtUtils;
        protected readonly IQuizRepository _quizRepository;

        public QuestionService(IQuestionRepository repository, IJwtUtils jwtUtils, IQuizRepository quizRepository)
        {
            _repository = repository;
            _jwtUtils = jwtUtils;
            _quizRepository = quizRepository;
        }

        public Question? FindById(Guid id)
        {
            return _repository.GetById(id);
        }

        public IEnumerable<Question> GetAllQuestions(Guid quizId)
        {
            return _repository.GetAllQuestionsOfQuiz(quizId);
        }

        public void AddQuestion(Question question, Guid quizId)
        {
            var quiz = _quizRepository.GetById(quizId);
            question.Quiz = quiz;
            _repository.Add(question);
        }

        public void DeleteQuestion(Guid id)
        {
            var existingQuestion = _repository.GetById(id);
            if (existingQuestion != null)
            {
                _repository.Delete(existingQuestion);
            }
        }

        public void UpdateQuestion(Question question)
        {
            var existingQuestion = _repository.GetById(question.Id);
            if (existingQuestion != null)
            {
                existingQuestion.Text = question.Text;
                _repository.Update(existingQuestion);
            }
        }
    }
}
