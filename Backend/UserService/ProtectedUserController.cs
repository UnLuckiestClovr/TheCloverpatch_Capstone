using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("[controller]")]
public class ProtectedUserController : ControllerBase
{
	private readonly DatabaseFunctions _databaseFunctions;

	public ProtectedUserController()
    {
        _databaseFunctions = new DatabaseFunctions(new UserDBContext(), new PasswordDBContext(), new HigherPermUserContext());
    }

    // Protected Endpoints
    [HttpGet("")]
    public async Task<IActionResult> TestEndpoint()
    {
        return Ok("Hello, Admin!");
    }

    [Authorize(Policy= "AdminPolicy")]
    [HttpPost("/make-employee")]
    public async Task<IActionResult> MakeEmployee(NewUser newUser)
    {
        var result = await _databaseFunctions.MakeEmployeeUser(newUser);

        return StatusCode(result.code, result);
    }



}
