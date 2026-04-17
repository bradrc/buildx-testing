using BuildX.Application.Dtos;

namespace BuildX.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(string username, string password);
    Task<AuthResponse?> RefreshTokenAsync(string token, string refreshToken);
    Task LogoutAsync(string refreshToken);
}
