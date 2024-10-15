using System;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
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
		public int code;
		public string message;

		public ResponseObject(int code, string message)
		{
			this.code = code;
			this.message = message;
		}
	}


	public async Task<ResponseObject> RegisterUser(NewUser newuser)
	{
		if (newuser == null) { return new ResponseObject(500, "Invalid User Object: Found to be Null"); }

		try
		{
			string newID = Guid.NewGuid().ToString();

            User userobject = new User(newID, newuser.Username, newuser.Email);
            UserPassword passwordObject = new UserPassword(newID, newuser.Password);

			// Create new User in Context
			await _usercontext.Users.AddAsync(userobject);
			await _passwordcontext.Passwords.AddAsync(passwordObject);
			await _usercontext.SaveChangesAsync();
			await _passwordcontext.SaveChangesAsync();

            return new ResponseObject(200, "User Registered Successfully");
        } 
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
			var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception.";
			Console.WriteLine($"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
            return new ResponseObject(500, $"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
        }
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex.Message);
            return new ResponseObject(500, $"An error occurred: {ex.Message}");
        }
	}
}
