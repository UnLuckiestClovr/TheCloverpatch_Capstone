using System;
using BCrypt.Net;

public class UserPassword
{
    public string ID { get; set; }
    public string Password { get; set; }

    public UserPassword() {}

    public UserPassword(string id, string password) { 
        this.ID = id;
        this.Password = HashPassword(password);
    }

// Hashes Password for more secure Storage and Usage
    private string HashPassword(string password) 
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

// Compares non Hashed Password to currently stored Hash Password
    public bool VerifyPassword(string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, this.Password);
    }

}
