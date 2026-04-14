namespace BuildX.Application.Dtos;

public record UserUpdateRequest(
    string Username,
    string Email,
    string Role
);
