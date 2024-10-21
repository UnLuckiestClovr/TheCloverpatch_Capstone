using System;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

public class DatabaseFunctions
{
	private readonly UserDBContext _usercontext;
	private readonly PasswordDBContext _passwordcontext;
	private readonly HigherPermUserContext _enhancedUserContext;

	public DatabaseFunctions(UserDBContext usercontext, PasswordDBContext passwordcontext, HigherPermUserContext enhancedUserContext)
	{
		_usercontext = usercontext;
		_passwordcontext = passwordcontext;
		_enhancedUserContext = enhancedUserContext;
	}

	public class ResponseObject<T>
	{
		public int code { get; set; }
		public string message { get; set; }
		public T data { get; set; }


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


	public async Task<ResponseObject<string>> RegisterUser<T>(NewUser newuser) // Create User
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


	public async Task<User> FindUser(string usernameOrEmail) // Read User by Username or Email [ Same Value counts for Both ]
	{
		using (_usercontext)
		{
			return await _usercontext.Users.FirstOrDefaultAsync(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail);
		}
	}


	public async Task<UserPassword> FindPass(string id) // Find Password entry by the user's ID, seperates the databases for ease of useability.
	{
		using (_passwordcontext)
		{
			return await _passwordcontext.Passwords.FirstOrDefaultAsync(p => p.ID == id);
		}
	}


	public async Task<ResponseObject<User>> Login<T>(LoginAttempt loginAttempt) // Attempt to Login
	{
		try {
			User foundUser = await FindUser(loginAttempt.UsernameOrEmail);

			if (foundUser == null) { return new ResponseObject<User>(500, "Username/Email or Password is Incorrect"); }  // If no user found with matching Username or Password, return a Generic LoginFailed Message. 

			UserPassword foundPasswordEntry = await FindPass(foundUser.ID);

			if (foundPasswordEntry.VerifyPassword(loginAttempt.Password))  // If Password matches the database-stored UserPassword then login can move forward.
			{
				return new ResponseObject<User>(200, "User Login Successful!", foundUser);
			}
			else  // Return Generic Login Failed Message if password doesn't match.
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
			Console.WriteLine(ex);
            return new ResponseObject<User>(500, $"An error occurred: {ex.Message}");
        }
	}


	public async Task<ResponseObject<User>> Update_UserInfo(User updatedUser) // Updates the user's main information, excludes the Password Updating as that is a seperate call.
	{
		try
		{
			var existingUser = await _usercontext.Users.FindAsync(updatedUser.ID);

			if (existingUser == null)
			{
				return new ResponseObject<User>(500, "Error updating user, user does not exist.");
			}

			// Update Properties
			existingUser.Username = updatedUser.Username;
			existingUser.Email = updatedUser.Email;

			// Save Changes to Database
			await _usercontext.SaveChangesAsync();

			return new ResponseObject<User>(200, "User Updated Successfully", updatedUser);
		}
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
			var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception.";
			Console.WriteLine($"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
            return new ResponseObject<User>(500, $"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
        }
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex);
            return new ResponseObject<User>(500, $"An error occurred: {ex.Message}");
        }
	}


	public async Task<ResponseObject<User>> Update_UserPassword(UserPasswordChangeInfo changeInfo)
	{
		try
		{
			var existingPassword = await _passwordcontext.Passwords.FindAsync(changeInfo.UserID);

			if (existingPassword != null && existingPassword.VerifyPassword(changeInfo.OldPassword))
			{
				existingPassword.Password = changeInfo.NewPassword;

				await _passwordcontext.SaveChangesAsync();

				return new ResponseObject<User>(200, "Password Updated Successfully!");
			}

			return new ResponseObject<User>(500, $"Error: Password Update Failed for Unknown Reasons; Ensure that User [{changeInfo.UserID}] is a Valid User.");
		}
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
			var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception.";
			Console.WriteLine($"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
            return new ResponseObject<User>(500, $"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
        }
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex);
            return new ResponseObject<User>(500, $"An error occurred: {ex.Message}");
        }
	}


	public async Task<ResponseObject<string>> MakeEmployeeUser(NewUser newUser)
	{
		try
		{
			string newID = Guid.NewGuid().ToString();

            User userobject = new User(newID, newUser.Username, newUser.Email);
            UserPassword passwordObject = new UserPassword(newID, newUser.Password);
			UserEnhancedPermissions empObject = new UserEnhancedPermissions(newID, "EMP");

			// Create new User in Context
			await _usercontext.Users.AddAsync(userobject);
			await _passwordcontext.Passwords.AddAsync(passwordObject);
			await _enhancedUserContext.EnhancedUsers.AddAsync(empObject);

			await _usercontext.SaveChangesAsync();
			await _passwordcontext.SaveChangesAsync();
			await _enhancedUserContext.SaveChangesAsync();

            return new ResponseObject<string>(200, "User Registered Successfully", $"New User: {newID}");
		}
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
			var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception.";
			Console.WriteLine($"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
            return new ResponseObject<string>(500, $"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
        }
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex);
            return new ResponseObject<string>(500, $"An error occurred: {ex.Message}");
        }
	}


	public async Task<ResponseObject<string>> TurnUserIntoEmployee(string id)
	{
		try
		{
			UserEnhancedPermissions empObject = new UserEnhancedPermissions(id, "EMP");
			await _enhancedUserContext.EnhancedUsers.AddAsync(empObject); 
			await _enhancedUserContext.SaveChangesAsync();

            return new ResponseObject<string>(200, "User Transferred to Employee Status Successfully", $"New Employee: {id}");
		}
		catch (DbUpdateException ex)  // Handle Exceptions Pertaining to Database Updates
		{
			var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception.";
			Console.WriteLine($"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
            return new ResponseObject<string>(500, $"Database error occurred: {ex.Message}. Inner exception: {innerExceptionMessage}");
        }
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex);
            return new ResponseObject<string>(500, $"An error occurred: {ex.Message}");
        }
	}


	// Authorization Endpoints to grab Lists
	public async Task<List<string>> GetEmps()
	{
		try
		{			
			return await _enhancedUserContext.GetEmployeeIDs_Async();
		}
		catch (Exception ex)  // Handle General Exception
		{
			Console.WriteLine(ex);
            return [];
        }
	}
}