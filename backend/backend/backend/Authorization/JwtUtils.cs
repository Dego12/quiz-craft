using backend.Database.Models;
using backend.Model;
using backend.Model.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace backend.Authorization
{
    public class JwtUtils : IJwtUtils
    {
        private readonly IConfiguration _configuration;
        private JwtSecurityTokenHandler _tokenHandler;
        private byte[] _secretKey;

        public JwtUtils(IConfiguration configuration)
        {
            _configuration = configuration;
            _tokenHandler = new JwtSecurityTokenHandler();
            _secretKey = Encoding.ASCII.GetBytes(_configuration.GetSection("Jwt:Secret").ToString());
        }

        public string GenerateJwt(User user, int expireTimeInMinutes)
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(expireTimeInMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_secretKey), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = _tokenHandler.CreateToken(tokenDescriptor);
            return _tokenHandler.WriteToken(token);
        }


        public Guid? ValidateJwt(string token)
        {
            if (token == null)
            {
                return null;
            }

            try
            {
                _tokenHandler.ValidateToken(token, new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = false,
                    IssuerSigningKey = new SymmetricSecurityKey(_secretKey),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = validatedToken as JwtSecurityToken;
                var userId = Guid.Parse(jwtToken.Claims.First(u => u.Type == "id").Value);

                return userId;
            }
            catch (Exception)
            {


            }

            return null;

        }
    }

}
