using backend.Database.Models;
using backend.Repository;
using backend.Authorization;
using backend.Model.Authorization;
using backend.DTO;
using System.Text.RegularExpressions;
using System.Net;
using MimeKit;
using Microsoft.AspNet.SignalR;
using System.Numerics;
using MailKit.Security;
using MailKit.Net.Smtp;

namespace backend.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IJwtUtils _jwtUtils;
        IConfiguration _configuration;

        public UserService(IUserRepository repository, IJwtUtils jwtUtils, IConfiguration configuration)
        {
            _repository = repository;
            _jwtUtils = jwtUtils;
            _configuration = configuration;
        }

        public IEnumerable<User> getAllUsers()
        {
            return _repository.GetAll();
        }

        public User? FindById(Guid id)
        {
            var user = _repository.GetById(id);
            return user;
        }

        public User? FindByEmail(string email)
        {
            var user = _repository.GetByEmail(email);
            return user;
        }

        public string? AddUser(User user)
        {
            var password = user.Password;
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            user.Password = hashedPassword;
            _repository.Add(user);
            var userToken = _jwtUtils.GenerateJwt(user, 180);
            _repository.Update(user);
            return userToken;
        }

        public void UpdateUser(User user)
        {
            var existingUser = _repository.GetById(user.Id);
            if (existingUser != null)
            {
                existingUser.Email = user.Email;
                existingUser.Name = user.Name;
                existingUser.Password = user.Password;
                _repository.Update(existingUser);
            }
        }

        public void DeleteUser(Guid id)
        {
            var existingUser = _repository.GetById(id);
            if (existingUser != null)
            {
                _repository.Delete(existingUser);
            }
        }

        public AuthResultDTO Login(LoginCredentialsDTO credentials)
        {
            User? user = null;
            bool success = false;

            user = _repository.GetByEmail(credentials.Email);
            if (user == null)
            {
                return AuthResultDTO.FactoryMethod(new List<string> { "E-mail or password is incorrect. Please try again "}, null);
            }

            success = BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password);
            if (success)
            {
                var userToken = _jwtUtils.GenerateJwt(user, 180);

                return AuthResultDTO.FactoryMethod(new List<string>(), userToken);
            }
            else
            {
                return AuthResultDTO.FactoryMethod(new List<string> { "E-mail or password is incorrect. Please try again" }, null);
            }
        }

        public AuthResultDTO Signup(User user)
        {

            var found = _repository.GetByEmail(user.Email);
            if (found == null)
            {
                var auth = AddUser(user);
                if (auth != null)
                    return AuthResultDTO.FactoryMethod(new List<string>(), auth);
                else
                    return AuthResultDTO.FactoryMethod(new List<string> { "Invalid token" }, null);
            }
            else
                return AuthResultDTO.FactoryMethod(new List<string> { "Email taken" }, null);
        }

        public bool Logout(string token)
        {
            var userId = _jwtUtils.ValidateJwt(token);
            if (userId is not null)
            {
                var user = _repository.GetById((Guid)userId);
                return user is not null;
            }
            return false;
        }

        public void SendForgotPasswordMail(string toEmail)
        {
            var user = FindByEmail(toEmail);
            if (user != null)
            {
                var resetPasswordToken = _jwtUtils.GenerateJwt(user, 1440);
                user.ResetPasswordToken = resetPasswordToken;
                _repository.Update(user);
                var url = "https://quizcraft.azurewebsites.net/reset_password/" + user.ResetPasswordToken;
                var username = _configuration.GetSection("SmtpClient").GetSection("Username").Value;
                var key = _configuration.GetSection("SmtpClient").GetSection("Key").Value;
                var host = _configuration.GetSection("SmtpClient").GetSection("Host").Value;
                var mailMessage = new MimeMessage();
                mailMessage.From.Add(new MailboxAddress("QuizCraft", "noreply@quizcraft.eu"));
                mailMessage.To.Add(new MailboxAddress("Password", toEmail));
                mailMessage.Subject = "Password reset";
                mailMessage.Body = new TextPart("plain")
                {
                    Text = "Hello " + user.Name + ",\r\n\r\n" + "We received a request to reset the password for your account. \r\nTo reset your password, please click " + String.Format("<a href=" + url + ">here</a>") + "."
                };

                using var smtp = new SmtpClient();
                smtp.Connect(host, 587, false);
                smtp.Authenticate(username, key);
                smtp.Send(mailMessage);
                smtp.Disconnect(true);
            }
        }

        public bool ValidateResetPassword(string token)
        {
            Guid userId;
            try
            {
                userId = (Guid)_jwtUtils.ValidateJwt(token);
            } 
            catch(Exception e)
            {
                return false;
            }
            
            User user = _repository.GetById(userId);

            if (user.ResetPasswordToken != null)
            {
                if (user.ResetPasswordToken == token)
                {
                    return true;
                }
            }

            return false;
        }

        public string? ChangePassword(string token, string newPassword)
        {
            var userId = (Guid)_jwtUtils.ValidateJwt(token);
            var user = _repository.GetById(userId);

            if (user is not null)
            {
                var checkOldPassword = BCrypt.Net.BCrypt.Verify(newPassword, user.Password);
                var checkOlderPassword = false;
                if (user.PrevPassword != null)
                {
                    checkOlderPassword = BCrypt.Net.BCrypt.Verify(newPassword, user.PrevPassword);
                }
                if (checkOldPassword is false && checkOlderPassword is false)
                {
                    user.PrevPassword = user.Password;
                    user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                    user.ResetPasswordToken = null;
                    UpdateUser(user);
                    return user.Password;
                }
            }
            return null;
        }
    }
}