using BuildX.Application.Dtos;
using BuildX.Application.Interfaces;
using BuildX.Domain.Entities;
using BuildX.Domain.Interfaces;
using Mapster;

namespace BuildX.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserResponse> CreateAsync(UserCreateRequest request)
    {
        var existingUserByEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUserByEmail != null)
        {
            throw new Exception("Email already in use.");
        }

        var existingUserByUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingUserByUsername != null)
        {
            throw new Exception("Username already in use.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Role = request.Role
        };

        await _userRepository.AddAsync(user);

        return user.Adapt<UserResponse>();
    }

    public async Task<IEnumerable<UserResponse>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Adapt<IEnumerable<UserResponse>>();
    }

    public async Task<UserResponse?> GetByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        return user.Adapt<UserResponse>();
    }

    public async Task<UserResponse> UpdateAsync(Guid id, UserUpdateRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var existingUserByEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUserByEmail != null && existingUserByEmail.Id != id)
        {
            throw new Exception("Email already in use by another user.");
        }

        var existingUserByUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingUserByUsername != null && existingUserByUsername.Id != id)
        {
            throw new Exception("Username already in use by another user.");
        }

        user.Username = request.Username;
        user.Email = request.Email;
        user.Role = request.Role;

        await _userRepository.UpdateAsync(user);

        return user.Adapt<UserResponse>();
    }

    public async Task DeleteAsync(Guid id)
    {
        await _userRepository.DeleteAsync(id);
    }
}
