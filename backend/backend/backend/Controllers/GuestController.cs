using backend.Database.Models;
using backend.Service;
using Microsoft.AspNetCore.Mvc;
using backend.DTO;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GuestController : ControllerBase
    {
        private readonly IGuestService _guestService;
        private readonly IRoomService _roomService;

        public GuestController(IGuestService guestService, IRoomService roomService)
        {
            _guestService = guestService;
            _roomService = roomService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<List<Guest>> GetAll()
        {
            var result=_guestService.GetAllGuests();
            return Ok(result);
        }

        [HttpPost]
        [Route("{roomId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Guest> AddGuest([FromBody]Guest guest, [FromRoute]Guid roomId)
        {
            if (guest == null || !_roomService.CanGuestEnter(roomId))
            {
                return BadRequest();
            }
            _guestService.AddGuest(guest,roomId);
            return Ok(guest);
        }

        [HttpGet]
        [Route("{roomId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<List<Guest>> GetGuestsFromRoom([FromRoute]Guid roomId)
        {
            var result=_guestService.GetGuestsFromRoom(roomId).OrderByDescending(g => g.Score);
            return Ok(result);
        }

        [HttpPut]
        [Route("{guestId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<int> AnswerQuestion([FromRoute]Guid guestId, [FromBody]AnswerDTO answer)
        {
            try
            {
                var score = _guestService.AnswerQuestion(guestId, answer.QuestionId, answer.AnswerId, answer.Time);
                return Ok(score);
            }
            catch(ArgumentNullException exception)
            {
                return BadRequest("Invalid answer");
            }
        }

        [HttpDelete]
        [Route("{guestId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteGuest([FromRoute] Guid guestId)
        {
            var guest = _guestService.FindById(guestId);
            if (guest is null)
            {
                return NotFound();
            }
            _guestService.DeleteGuest(guestId);
            return Ok();
        }


        [HttpGet]
        [Route("connect/{pin}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Room> ConnectUsingPIN([FromRoute] int pin)
        {
            var room = _roomService.FindByPIN(pin);
            if (room is null)
            {
                return NotFound();
            }
            if (room.State is RoomState.Started)
            {
                return Conflict();
            }
            return Ok(room);
        }
        [HttpGet]
        [Route("rooms/{roomId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Room> FindRoomById([FromRoute] Guid roomId, [FromHeader] Guid guestRoomId)
        {
            var room = _guestService.FindRoomByGuest(guestRoomId, roomId);
            if (room is null)
            {
                return NotFound();
            }
            return Ok(room);
        }
    }
}