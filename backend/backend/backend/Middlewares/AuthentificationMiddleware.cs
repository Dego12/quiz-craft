using backend.Model.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace backend.Middlewares
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class AuthentificationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IJwtUtils _jwtUtils;
        private readonly List<string> _availablePaths = new List<string>()
        {
            "Quiz","Question","Answer","Room"
        };

        public AuthentificationMiddleware(RequestDelegate next, IJwtUtils jwtUtils)
        {
            _jwtUtils = jwtUtils;
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            char delimitator = '/';
            var path = httpContext.Request.Path.Value?.Split(delimitator).Where((path) => path != string.Empty).ToList();
            
            if (path is null)
            {
                httpContext.Response.ContentType = "text/plain";
                httpContext.Response.StatusCode = 400;
                await httpContext.Response.WriteAsync("Bad Request");
                return;
            }

            if (path.Any() && path != null)
            {
                if (_availablePaths.Contains(path.First()))
                {
                    var token = httpContext.Request.Headers["token"].ToString();
                    if (token is null || token.Length == 0)
                    {
                        httpContext.Response.ContentType = "text/plain";
                        httpContext.Response.StatusCode = 400;
                        await httpContext.Response.WriteAsync("Bad Request");
                        return;
                    }

                    if (_jwtUtils.ValidateJwt(token) is null)
                    {
                        httpContext.Response.ContentType = "text/plain";
                        httpContext.Response.StatusCode = 403;
                        await httpContext.Response.WriteAsync("Forbidden");
                        return;
                    }
                }
            }
            await _next(httpContext);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class UserMiddlewareExtensions
    {
        public static IApplicationBuilder UseUserMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthentificationMiddleware>();
        }
    }
}
