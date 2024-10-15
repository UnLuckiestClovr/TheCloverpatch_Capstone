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


	public static void InduceDatabaseChecks() {
		try {
			string connString = "Server=localhost;Database=master; User Id=sa;Password=Nc220370979;";

			using (SqlConnection connection = new SqlConnection(connString)) 
			{
				connection.Open();

				List<string> dbNames = ["UserDB", "UserPassDB"];

				for (int index = 0; index < dbNames.Count; index++)
				{
					DatabaseCheck(connection, dbNames[index]);
				}
			}
		} catch (Exception e) {
			Console.WriteLine(e.Message);
		}
    }


	public static void DatabaseCheck(SqlConnection connection, string dbName)
	{
		//Check if Database Exists
		string checkQuery = $"SELECT database_id FROM sys.databases WHERE name = '{dbName}'";

		using (SqlCommand command = new SqlCommand(checkQuery, connection))
		{
			var result = command.ExecuteScalar();

			if (result == null) 
			{
				// Database does not exist, Create It
				string createDBQuery = $"CREATE DATABASE '{dbName}'";
				using (SqlCommand createCommand = new SqlCommand(createDBQuery, connection))
				{
					createCommand.ExecuteNonQuery();
					Console.WriteLine($"Created Database {dbName} Successfully!");
				}
			}
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
            return new ResponseObject(500, $"Database error occurred: {ex.Message}");
        }
		catch (Exception ex)  // Handle General Exception
		{
            return new ResponseObject(500, $"An error occurred: {ex.Message}");
        }
	}
}
