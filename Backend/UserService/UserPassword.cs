using System;

public class UserPassword
{
    public string Username { get; set; }
    public string Password { get; set; }

    public UserPassword(string username, string password) { 
        this.Username = username;
        this.Password = password;
    }

}
