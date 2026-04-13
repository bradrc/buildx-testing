using BuildX.Application.Dtos;
using BuildX.Application.Interfaces;
using BuildX.Application.Services;
using BuildX.Domain.Entities;
using BuildX.Infrastructure.Repositories;
using BuildX.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
                  .WithMethods("GET", "POST", "OPTIONS")
                  .WithHeaders("Content-Type", "Authorization");
        });
});

// Authentication & Authorization
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]!))
        };
    });

builder.Services.AddAuthorization();

// Dependency Injection
builder.Services.AddSingleton<IUserRepository, UserRepository>();
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Seed a user for testing
using (var scope = app.Services.CreateScope())
{
    var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
    
    var existingUser = await userRepository.GetByUsernameAsync("testuser");
    if (existingUser == null)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = passwordHasher.HashPassword("Password123!"),
        };
        await userRepository.AddAsync(user);
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/weatherforecast", () =>
{
    var summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

// Auth Endpoints
app.MapPost("/login", async (LoginRequest request, IAuthService authService) =>
{
    var response = await authService.LoginAsync(request.Username, request.Password);
    return response is not null ? Results.Ok(response) : Results.Unauthorized();
});

app.MapPost("/refresh-token", async (RefreshTokenRequest request, IAuthService authService) =>
{
    var response = await authService.RefreshTokenAsync("", request.RefreshToken);
    return response is not null ? Results.Ok(response) : Results.BadRequest("Invalid refresh token");
});

app.MapGet("/protected", () =>
{
    return Results.Ok(new { Message = "You are authorized!" });
}).RequireAuthorization();

// Dashboard Stats Endpoint
app.MapGet("/dashboard/stats", () =>
{
    var stats = new DashboardStatsResponse
    {
        TotalUsers = 1284,
        ActiveSessions = 432,
        Revenue = 25000.50,
        SystemHealth = 98,
        ChartData = new ChartDataResponse
        {
            Labels = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun" },
            Values = new[] { 10.0, 25.0, 45.0, 30.0, 55.0, 70.0 }
        }
    };
    return Results.Ok(stats);
}).RequireAuthorization();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public record RefreshTokenRequest(string RefreshToken);
