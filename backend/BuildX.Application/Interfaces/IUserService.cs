using BuildX.Application.Dtos;

namespace BuildX.Application.Interfaces;

public interface IUserService
{
    Task<UserResponse> CreateAsync(UserCreateRequest request);
    Task<IEnumerable<UserResponse>> GetAllAsync();
    Task<UserResponse?> GetByIdAsync(Guid id);
    Task<UserResponse> UpdateAsync(Guid id, UserUpdateRequest request);
    Task DeleteAsync(Guid id);
    Task UpdatePasswordAsync(Guid id, UserPasswordUpdateRequest request);
}
