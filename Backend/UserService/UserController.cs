using Microsoft.AspNetCore.Mvc;
using System;
using System.Runtime.CompilerServices;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
	private readonly DatabaseFunctions _databaseFunctions;

	public UserController()
    {
        _databaseFunctions = new DatabaseFunctions(new UserDBContext(), new PasswordDBContext(), new HigherPermUserContext());
    }

    // Unprotected Endpoints
    [HttpPost("register")]
    public async Task<IActionResult> Register(NewUser newUser)
    {
        var response = await _databaseFunctions.RegisterUser<string>(newUser);

        return StatusCode(response.code, response.message);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAttempt(Auth_Request loginAttempt)
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

    [HttpPut("update-user-info")]
    public async Task<IActionResult> UpdateUser_Info(User updateInfo)
    {
        var response = await _databaseFunctions.Update_UserInfo(updateInfo);

        return StatusCode(response.code, response);
    }

    [HttpPatch("update-user-password/{email}")]
    public async Task<IActionResult> UpdateUser_Password(string email, UserPasswordChangeInfo newInfo)
    {
        var response = await _databaseFunctions.Update_UserPassword(email, newInfo);

        return StatusCode(response.code, response);
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteUser(Auth_Request authInfo)
    {
        var response = await _databaseFunctions.Delete_Profile(authInfo);

        return StatusCode(response.code, response);
    }

    [HttpGet("retrieve-data/{userid}")]
    public async Task<IActionResult> RetrieveUserInfo(string userid) 
    {
        var response = await _databaseFunctions.RetrieveUserInfo(userid);

        return StatusCode(response.code, response);
    }
}
