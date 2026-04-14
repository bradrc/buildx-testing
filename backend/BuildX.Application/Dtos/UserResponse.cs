namespace BuildX.Application.Dtos;

public record UserResponse(
    Guid Id,
    string Username,
    string Email,
    string Role
);
