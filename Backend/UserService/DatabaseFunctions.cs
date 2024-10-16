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

	public class ResponseObject<T>
	{
		public int code;
		public string message;
		public T data;


		public ResponseObject(int code, string message)
		{
			this.code = code;
			this.message = message;
		}

		public ResponseObject(int code, string message, T data)
		{
			this.code = code;
			this.message = message;
			this.data = data;
		}
	}


	public async Task<ResponseObject<string>> RegisterUser<T>(NewUser newuser)
	{
		if (newuser == null) { return new ResponseObject<string>(500, "Invalid User Object: Found to be Null"); }

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

            return new ResponseObject<string>(200, "User Registered Successfully");
        } 
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
			var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception.";
			Console.WriteLine($"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
            return new ResponseObject<string>(500, $"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
        }
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex.Message);
            return new ResponseObject<string>(500, $"An error occurred: {ex.Message}");
        }
	}


	public async Task<User> FindUser(string usernameOrEmail)
	{
		using (_usercontext)
		{
			return await _usercontext.Users.FirstOrDefaultAsync(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail);
		}
	}


	public async Task<UserPassword> FindPass(string id)
	{
		using (_passwordcontext)
		{
			return await _passwordcontext.Passwords.FirstOrDefaultAsync(p => p.ID == id);
		}
	}


	public async Task<ResponseObject<User>> Login<T>(LoginAttempt loginAttempt)
	{
		try {
			User foundUser = await FindUser(loginAttempt.UsernameOrEmail);

			if (foundUser == null) { return new ResponseObject<User>(500, "Username/Email or Password is Incorrect"); }  // If no user found with matching Username or Password, return a Generic LoginFailed Message. 

			UserPassword foundPasswordEntry = await FindPass(loginAttempt.Password);

			if (foundPasswordEntry.VerifyPassword(loginAttempt.Password))  // If Password matches the database-stored UserPassword then login can move forward.
			{
				return new ResponseObject<User>(200, "User Login Successful!", foundUser);
			}
			else  // Return Generic Login Failed Message if inserted Password does not match.
			{
				return new ResponseObject<User>(500, "Username/Email or Password is Incorrect");
			}
		} 
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
			var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception.";
			Console.WriteLine($"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
            return new ResponseObject<User>(500, $"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
        }
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex.Message);
            return new ResponseObject<User>(500, $"An error occurred: {ex.Message}");
        }
	}
}
