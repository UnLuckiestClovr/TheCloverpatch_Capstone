using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
	private readonly DatabaseFunctions _databaseFunctions;

	public UserController()
    {
        _databaseFunctions = new DatabaseFunctions(new UserDBContext(), new PasswordDBContext());
    }

    [HttpGet("")]
    public async Task<IActionResult> TestEndpoint()
    {
        return Ok("Hello User!");
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(NewUser newUser)
    {
        var response = await _databaseFunctions.RegisterUser(newUser);

        return StatusCode(response.code, response.message);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAttempt(LoginAttempt loginAttempt)
    {
        var response = await _databaseFunctions.Login(loginAttempt);
        return StatusCode(response.code, response.message);
    }
}
