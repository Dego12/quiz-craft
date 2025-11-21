using backend.Database.Models;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerService _answerService;

        public AnswerController(IAnswerService answerService)
        {
            _answerService = answerService;
        }

        [HttpGet]
        [Route("{questionId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public ActionResult<List<Answer>> Get([FromRoute] Guid questionId, [FromHeader] string token)
        {
            var answers = _answerService.GetAllAnswers(questionId).ToList();
            return Ok(answers);
        }

        [HttpPost]
        [Route("{questionId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public ActionResult<Answer> Add([FromBody] Answer answer, [FromRoute] Guid questionId, [FromHeader] string token)
        {
            if (answer is null)
            {
                return BadRequest();
            }
            _answerService.AddAnswer(answer, questionId);
            return Ok(); 
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Delete([FromRoute] Guid id, [FromHeader] string token)
        {
            if (_answerService.FindById(id) is null)
            {
                return NotFound();
            }
            _answerService.DeleteAnswer(id);
            return Ok();
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Answer> Update([FromBody] Answer answer, [FromHeader] string token)
        {
            if (answer is null)
            {
                return BadRequest();
            }
            _answerService.UpdateAnswer(answer);
            return Ok();
        }
    }
}
