using Microsoft.AspNetCore.Mvc;
using BuildX.Application.Dtos;
using BuildX.Application.Interfaces;

namespace BuildX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CustomerCreateRequest request)
    {
        try
        {
            var response = await _customerService.CreateCustomerAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var response = await _customerService.GetCustomerByIdAsync(id);
        if (response == null) return NotFound();
        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = await _customerService.GetAllCustomersAsync();
        return Ok(response);
    }
}
