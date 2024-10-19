using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("[controller]")]
public class ProtectedUserController : ControllerBase
{
	private readonly DatabaseFunctions _databaseFunctions;

	public ProtectedUserController()
    {
        _databaseFunctions = new DatabaseFunctions(new UserDBContext(), new PasswordDBContext(), new HigherPermUserContent());
    }

    // Protected Endpoints
    [HttpGet("")]
    public async Task<IActionResult> TestEndpoint()
    {
        return Ok("Hello, Admin!");
    }

    

}
