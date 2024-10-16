using System;

public class User
{
    public string ID { get; set; }  // Primary Key
    public string Username { get; set; }
    public string Email { get; set; }

    public User() {}

    public User(string id, string username, string email) { 
        this.ID = id;
        this.Username = username;
        this.Email = email;
    }
}
