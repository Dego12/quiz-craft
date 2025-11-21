using backend.Authorization;
using backend.Model.Authorization;
using backend.Repository;
using backend.Service;
using backend.Database.Models;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Collections.Generic;
using backend.Middlewares;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// Add services to the container.

services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();
services.AddSingleton<IJwtUtils, JwtUtils>();
services.AddScoped<DbContext, MainDbContext>();
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IUserService, UserService>();
services.AddScoped<IQuizRepository, QuizRepository>();
services.AddScoped<IQuizService, QuizService>();
services.AddScoped<IQuestionRepository, QuestionRepository>();
services.AddScoped<IQuestionService, QuestionService>();
services.AddScoped<IAnswerRepository, AnswerRepository>();
services.AddScoped<IAnswerService, AnswerService>();
services.AddScoped<IGuestRepository, GuestRepository>();
services.AddScoped<IGuestService, GuestService>();
services.AddScoped<IRoomRepository, RoomRepository>();
services.AddScoped<IRoomService, RoomService>();
services.AddSignalR();

services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    /*  options.SaveToken = true;
        options.RequireHttpsMetadata = false;*/
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
    };
});

services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("https://quizcraft.azurewebsites.net")
            .WithOrigins("http://localhost:3000")
            .WithMethods("POST")
            .WithMethods("GET")
            .WithMethods("PUT")
            .WithMethods("DELETE")
            .AllowAnyHeader()
            .AllowCredentials();
        });
});


var app = builder.Build();
var config = app.Configuration;
var environment = app.Environment;

// Configure the HTTP request pipeline.
if (environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<MessageHub>("/message");

app.UseMiddleware<AuthentificationMiddleware>();

app.Run();
