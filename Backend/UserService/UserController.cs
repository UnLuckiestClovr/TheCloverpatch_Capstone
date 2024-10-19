using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
	private readonly DatabaseFunctions _databaseFunctions;

	public UserController()
    {
        _databaseFunctions = new DatabaseFunctions(new UserDBContext(), new PasswordDBContext(), new HigherPermUserContent());
    }

    // Unprotected Endpoints
    [HttpPost("register")]
    public async Task<IActionResult> Register(NewUser newUser)
    {
        var response = await _databaseFunctions.RegisterUser<string>(newUser);

        return StatusCode(response.code, response.message);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAttempt(LoginAttempt loginAttempt)
    {
        var response = await _databaseFunctions.Login<User>(loginAttempt);

        if (response.code == 200)
        {
            return Ok(response);
        }
        else 
        {
            return StatusCode(response.code, response);
        }
    }
}
