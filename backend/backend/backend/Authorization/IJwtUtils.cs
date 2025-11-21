using backend.Database.Models;

namespace backend.Model.Authorization
{
    public interface IJwtUtils
    {
        public string GenerateJwt(User user, int expireTimeInMinutes);
        public Guid? ValidateJwt(string token);
    }
}
