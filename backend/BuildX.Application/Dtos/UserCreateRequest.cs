namespace BuildX.Application.Dtos;

public record UserCreateRequest(
    string Username,
    string Email,
    string Password,
    string Role = "User"
);
