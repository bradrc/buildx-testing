using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BuildX.Application.Interfaces;
using System.Net;

namespace BuildX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] BuildX.Application.Dtos.LoginRequest request)
    {
        var response = await _authService.LoginAsync(request.Username, request.Password);
        if (response == null)
        {
            return Unauthorized("Invalid username or password");
        }
        return Ok(response);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] BuildX.Application.Dtos.RefreshTokenRequest request)
    {
        var response = await _authService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);
        if (response == null)
        {
            return Unauthorized("Invalid refresh token");
        }
        return Ok(response);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
    {
        await _authService.LogoutAsync(request.RefreshToken);
        return Ok();
    }

    public class LogoutRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
