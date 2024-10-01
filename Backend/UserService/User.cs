using System;

public class User
{
    public string ID { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }

    public User(string Username, string Email)
    {
        this.ID = Guid.NewGuid().ToString();
        this.Username = Username;
        this.Email = Email;
    }

    public User(string id, string username, string email) { 
        this.ID = id;
        this.Username = username;
        this.Email = email;
    }
}
