using backend.Database.Models;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizSerivce)
        {
            _quizService = quizSerivce;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<List<Quiz>> Get([FromHeader] string token)
        {
            Guid userId = (Guid)_quizService.getUserId(token);
            var quizzes = _quizService.GetAllQuizzes(userId).ToList();
            return Ok(quizzes);
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Quiz> Add([FromBody] Quiz quiz, [FromHeader] string token)
        {
            if (quiz is null)
            {
                return BadRequest();
            }
            Guid userId = (Guid)_quizService.getUserId(token);
            _quizService.AddQuiz(quiz, userId);
            return Ok();
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Quiz> Update([FromBody] Quiz quiz, [FromHeader] string token)
        {
            if (quiz is null)
            {
                return BadRequest();
            }

            try
            {
                _quizService.UpdateQuiz(quiz);
            }
            catch (InvalidOperationException e)
            {
                return Conflict();
            }
            
            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public IActionResult Delete([FromRoute] Guid id, [FromHeader] string token)
        {
            var quiz = _quizService.FindById(id);
            if (quiz is null)
            {
                return NotFound();
            }
            if(quiz.readOnly)
            {
                return Conflict();
            }
            _quizService.DeleteQuiz(id);
            return Ok();
        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Quiz> GetById([FromRoute] Guid id, [FromHeader] string token)
        {
            var quiz = _quizService.FindByIdWithAllData(id);
            if (quiz is null)
            {
                return NotFound();
            }
            return Ok(quiz);
        }
    }
}
