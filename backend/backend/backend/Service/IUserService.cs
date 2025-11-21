using backend.Database.Models;
using backend.DTO;

namespace backend.Service
{
    public interface IUserService
    {
        IEnumerable<User> getAllUsers();
        User? FindById(Guid id);
        User? FindByEmail(string email);
        string? AddUser(User user);
        void UpdateUser(User user);
        void DeleteUser(Guid id);
        public AuthResultDTO Login(LoginCredentialsDTO credentials);

        public AuthResultDTO Signup(User user);
        bool Logout(string token);
        void SendForgotPasswordMail(string toEmail);

        bool ValidateResetPassword(string token);
        string? ChangePassword(string token, string newPassword);
    }
}
