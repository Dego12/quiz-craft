using backend.Database;
using backend.Database.Models;
using backend.Model.Authorization;
using backend.Repository;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly IJwtUtils _jwtUtils;

        public QuizService(IQuizRepository repository, IJwtUtils jwtUtils, IUserRepository userRepository, IQuestionRepository questionRepository)
        {
            _repository = repository;
            _jwtUtils = jwtUtils;
            _userRepository = userRepository;
            _questionRepository = questionRepository;
        }

        public Quiz? FindById(Guid id)
        {
            return _repository.GetById(id);
        }

        public Quiz? FindByIdWithAllData(Guid id)
        {
            return _repository.GetByIdWithAllData(id);
        }

        public void AddQuiz(Quiz quiz, Guid userId)
        {
            quiz.Owner = _userRepository.GetById(userId);
            _repository.Add(quiz);
        }

        public void DeleteQuiz(Guid id)
        {
            var existingQuiz = FindById(id);
            if (existingQuiz != null)
            {
                _repository.Delete(existingQuiz);
            }
        }

        public void UpdateQuiz(Quiz quiz)
        {
            var existingQuiz = FindById(quiz.Id);

            if (existingQuiz.readOnly)
            {
                throw new InvalidOperationException();
            }

            if (existingQuiz != null)
            {
                existingQuiz.Title = quiz.Title;
                existingQuiz.Description = quiz.Description;
                existingQuiz.NumberOfPlays = quiz.NumberOfPlays;
                existingQuiz.readOnly = quiz.readOnly;
                _repository.Update(existingQuiz);
                var questions = _questionRepository.GetAllQuestionsOfQuiz(existingQuiz.Id);
                if (ReferenceEquals(quiz, existingQuiz) == false)
                {
                    if (questions is not null)
                    {
                        foreach (var question in questions)
                        {
                            _questionRepository.Delete(question);
                        }
                    }
                    if (quiz.Questions is not null)
                    {
                        foreach (var newQuestion in quiz.Questions)
                        {
                            newQuestion.Quiz = existingQuiz;
                            _questionRepository.Add(newQuestion);
                        }
                    }
                }
            }
        }

        public IEnumerable<Quiz> GetAllQuizzes(Guid userId)
        {
            return _repository.GetAllOfUser(userId);
        }

        public bool validateToken(string token)
        {
            if (_jwtUtils.ValidateJwt(token) is null)
            {
                return false;
            }
            return true;
        }

        public Guid? getUserId(string token)
        {
            if (validateToken(token))
            {
                return _jwtUtils.ValidateJwt(token);
            }
            return null;
        }
    }
}
