using Microsoft.AspNetCore.Mvc;
using System;

public class UserController : ControllerBase
{
	private readonly DatabaseFunctions _databaseFunctions;

	public UserController(DatabaseFunctions databaseFunctions)
    {
        _databaseFunctions = databaseFunctions;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(NewUser newUser)
    {
        var response = await _databaseFunctions.RegisterUser(newUser);

        return StatusCode(response.code, response.message);
    }
}
