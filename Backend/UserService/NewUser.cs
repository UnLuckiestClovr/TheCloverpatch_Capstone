using System;

public class NewUser
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public NewUser(string username, string email, string password) {
        this.Username = username;
        this.Email = email;
        this.Password = password;
    }
}
