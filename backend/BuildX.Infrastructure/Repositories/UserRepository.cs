using BuildX.Application.Interfaces;
using BuildX.Domain.Entities;

namespace BuildX.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly List<User> _users = new();

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await Task.FromResult(_users.FirstOrDefault(u => u.Username == username));
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await Task.FromResult(_users.FirstOrDefault(u => u.Email == email));
    }

    public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
    {
        return await Task.FromResult(_users.FirstOrDefault(u => u.RefreshToken == refreshToken && u.RefreshTokenExpiryTime > DateTime.UtcNow));
    }

    public async Task AddAsync(User user)
    {
        _users.Add(user);
        await Task.CompletedTask;
    }

    public async Task UpdateAsync(User user)
    {
        var index = _users.FindIndex(u => u.Id == user.Id);
        if (index != -1)
        {
            _users[index] = user;
        }
        await Task.CompletedTask;
    }
}
