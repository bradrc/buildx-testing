namespace BuildX.Application.Dtos;

public record AuthResponse(string Token, string RefreshToken, string Username);
