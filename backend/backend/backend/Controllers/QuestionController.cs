using backend.Database.Models;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Route("{quizId}")]
        public ActionResult<List<Question>> Get([FromRoute] Guid quizId, [FromHeader] string token)
        {
            var questions = _questionService.GetAllQuestions(quizId).ToList();
            return Ok(questions);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Route("{quizId}")]
        public ActionResult<Question> Add([FromBody] Question question, [FromRoute] Guid quizId, [FromHeader] string token)
        {
            if (question is null)
            {
                return BadRequest();
            }
            _questionService.AddQuestion(question, quizId);
            return Ok();
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Question> Update([FromBody] Question question, [FromHeader] string token)
        {
            if (question is null)
            {
                return BadRequest();
            }
           _questionService.UpdateQuestion(question);
            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Delete([FromRoute] Guid id, [FromHeader] string token)
        {
            if (_questionService.FindById(id) is null)
            {
                return NotFound();
            }
            _questionService.DeleteQuestion(id);
            return Ok();
        }

        [HttpGet]
        [Route("findone/{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Quiz> GetById([FromRoute] Guid id, [FromHeader] string token)
        {
            var quiz = _questionService.FindById(id);
            if (quiz is null)
            {
                return NotFound();
            }
            return Ok(quiz);
        }
    }
}
