using System;

public class UserPassword
{
    public string ID { get; set; }
    public string Password { get; set; }

    public UserPassword() {}

    public UserPassword(string id, string password) { 
        this.ID = id;
        this.Password = password;
    }

}
