using System;
using System.Runtime.InteropServices;
using backend.Database;
using backend.Database.Models;
using backend.Service;
using hubConfig = Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IRoomService _roomService;
        private readonly IQuizService _quizService;

        public MessageHub(IRoomService roomService, IQuizService quizService)
        {
            _roomService = roomService;
            _quizService = quizService;
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var room = _roomService.FindByHostConnectionId(Context.ConnectionId);
            if (room is not null)
            {
                await SendMessageToRoom(room.Id, RoomState.HostLeft);
            }
        }

        public async Task JoinHostRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            var room = _roomService.FindById(Guid.Parse(roomId));

            if (room.HostConnectionId != null)
            {
                await SendMessageToRoom(Guid.Parse(roomId), RoomState.hostJoin);
            }
            room.HostConnectionId = Context.ConnectionId;
            _roomService.UpdateRoom(room);
        }

        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        }

        public async Task SendMessageToRoom(Guid roomId, RoomState message)
        {
            switch (message)
            {
                case RoomState.Started:
                    _roomService.UpdateRoomState(roomId, message);
                    break;
                case RoomState.Finished:
                    _roomService.UpdateRoomState(roomId, RoomState.Finished);
                    var quiz = _roomService.FindByIdWithData(roomId)!.Quiz;
                    quiz.readOnly = false;
                    _quizService.UpdateQuiz(quiz);
                    return;
            }
            await Clients.Groups(roomId.ToString()).SendAsync("SendMessageToRoom", message);

        }

        public async Task SendMessageQuestionToSpecificUser(string connectionId,RoomState message, Question question)
        {
            await Clients.Client(connectionId).SendAsync("SendMessageQuestionToSpecificUser", message, question);
        }

        public async Task SendMessageToSpecificUser(string connectionId, RoomState message)
        {
            await Clients.Client(connectionId).SendAsync("SendMessageToSpecificUser", message);
        }

        public async Task SendGuestJoinedToRoom(Guid roomId)
        {
            await Clients.Groups(roomId.ToString()).SendAsync("SendGuestJoinedToRoom", Context.ConnectionId);
        }

        public async Task SendMessageQuestionToRoom(string roomId, RoomState message, Question question)
        {
            await Clients.Groups(roomId).SendAsync("SendMessageQuestionToRoom", message, question);
        }
        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        }
    }
}
