using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

public class DatabaseFunctions
{
	private readonly UserDBContext _usercontext;
	private readonly PasswordDBContext _passwordcontext;

	public DatabaseFunctions(UserDBContext usercontext, PasswordDBContext passwordcontext)
	{
		_usercontext = usercontext;
		_passwordcontext = passwordcontext;
	}

	public class ResponseObject
	{
		public int Code;
		public string message;

		public ResponseObject(int code, string message)
		{
			this.Code = code;
			this.message = message;
		}
	}

	public async Task<ResponseObject> RegisterUser(NewUser newuser)
	{
		if (newuser == null) { return new ResponseObject(500, "Invalid User Object: Found to be Null"); }

		try
		{
            User userobject = new User(newuser.Username, newuser.Email);
            UserPassword passwordObject = new UserPassword(newuser.Username, newuser.Password);

			// Create new User in Context
			await _usercontext.Users.AddAsync(userobject);
			await _passwordcontext.Passwords.AddAsync(passwordObject);
			await _usercontext.SaveChangesAsync();
			await _passwordcontext.SaveChangesAsync();

            return new ResponseObject(200, "User Registered Successfully");
        } 
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
            return new ResponseObject(500, $"Database error occurred: {ex.Message}");
        }
		catch (Exception ex)  // Handle General Exception
		{
            return new ResponseObject(500, $"An error occurred: {ex.Message}");
        }
	}
}
