using backend.Database.Models;
using backend.DTO;
using backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<List<Room>> Get([FromHeader] string token)
        {
            var rooms = _roomService.GetAllRooms().ToList();
            return Ok(rooms);
        }

        [HttpPost]
        [Route("{quizId}")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Room> Create([FromRoute] Guid quizId, [FromHeader] string token)
        {
            var room = _roomService.CreateRoom(quizId);

            if (room is null)
            {
                return BadRequest();
            }

            return Ok(room);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Room> Update([FromBody] Room room, [FromHeader] string token)
        {
            if (room is null)
            {
                return BadRequest();
            }

            Room? newRoom = _roomService.UpdateRoom(room);

            if (newRoom == null)
            {
                return NotFound();
            }

            return Ok(newRoom);
        }

        [HttpDelete]
        [Route("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Delete([FromRoute] Guid id, [FromHeader] string token)
        {
            if (_roomService.FindById(id) is null)
            {
                return NotFound();
            }
            _roomService.DeleteRoom(id);
            return Ok();
        }

        [HttpGet]
        [Route("{roomId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Room> GetById([FromRoute] Guid roomId, [FromHeader] string token)
        {
            var room = _roomService.FindByIdWithData(roomId);
            if (room == null)
                return NotFound();
            return Ok(room);
        }

        [HttpGet]
        [Route("rooms/{quizId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public ActionResult<Room> GetByQuizId([FromRoute] Guid quizId, [FromHeader] string token)
        {
            var room = _roomService.FindByQuizId(quizId);
            if (room == null)
            {
                return NoContent();
            }
            return Ok(room);
        }

        [HttpPut]
        [Route("limitOfPlayers")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Room> UpdateLimitOfPlayers([FromBody] RoomLimitDTO roomDTO, [FromHeader] string token)
        {
            var room = _roomService.FindById(roomDTO.RoomId);
            if (room == null)
            {
                return NotFound();
            }

            Room? newRoom = _roomService.UpdateLimitOfPlayers(roomDTO.RoomId, roomDTO.Limit);

            if (newRoom == null)
            {
                return NotFound();
            }

            return Ok(newRoom);
        }
    }
}
