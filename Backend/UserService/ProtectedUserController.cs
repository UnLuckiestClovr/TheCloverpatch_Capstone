using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("protected-endpoints")]
public class ProtectedUserController : ControllerBase
{
	private readonly DatabaseFunctions _databaseFunctions;

	public ProtectedUserController()
    {
        _databaseFunctions = new DatabaseFunctions(new UserDBContext(), new PasswordDBContext(), new HigherPermUserContext());
    }

    // Protected Endpoints
    [Authorize(Policy= "AdminPolicy")]
    [HttpPost("make-employee")]
    public async Task<IActionResult> MakeEmployee(NewUser newUser)
    {
        var result = await _databaseFunctions.MakeEmployeeUser(newUser);

        return StatusCode(result.code, result);
    }

    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("update-to-employee/{id}")]
    public async Task<IActionResult> UpdateUserPerms_ToEmployee(string id)
    {
        var result = await _databaseFunctions.TurnUserIntoEmployee(id);

        return StatusCode(result.code, result);
    }
}
