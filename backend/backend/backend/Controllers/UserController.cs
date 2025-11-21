using Microsoft.AspNetCore.Mvc;
using backend.Service;
using backend.Database.Models;
using backend.DTO;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<User>> Get()
        {
            var users = _userService.getAllUsers().ToList();
            return Ok(users);
        }

        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<User> GetById([FromRoute] Guid id)
        {
            var user = _userService.FindById(id);
            if (user == null)
                return NotFound();
            return Ok(user);

        }


        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Delete(Guid id)
        {
            var user = _userService.FindById(id);
            if (user == null)
                return NotFound();
            _userService.DeleteUser(id);
            return Ok();
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<User> Update([FromBody] User user)
        {
            if (user == null)
                return BadRequest();
            _userService.UpdateUser(user);
            return Ok();
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("login")]
        public ActionResult<AuthResultDTO> Login([FromBody] LoginCredentialsDTO credentials)
        {
            if (credentials == null)
            {
                return BadRequest();
            }

            var result = _userService.Login(credentials);

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("logout")]
        public ActionResult Logout([FromHeader] string token)
        {
            if (_userService.Logout(token))
            {
                return Forbid();
            }
            return BadRequest();
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("add")]
        public ActionResult<AuthResultDTO> Signup([FromBody] User user)
        {
            var result = _userService.Signup(user);

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Route("passwordReset")]
        public IActionResult ForgotPassword([FromHeader] string email)
        {
            var user = _userService.FindByEmail(email);
            if (user == null)
            {
                return NotFound();
            }
            _userService.SendForgotPasswordMail(email);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [Route("validateResetPassword")]
        public IActionResult ValidateResetPassword([FromHeader] string resetPasswordToken)
        {
            if (_userService.ValidateResetPassword(resetPasswordToken))
            {
                return Ok();
            }
            else
            {
                return Forbid();
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Route("changePassword")]
        public IActionResult ChangePassword([FromHeader] string token,[FromHeader] string newPassword)
        {
            var changedPassword = _userService.ChangePassword(token, newPassword);
            if(changedPassword == null)
            {
                return BadRequest();
            }
            return Ok();
        }
    }
}
