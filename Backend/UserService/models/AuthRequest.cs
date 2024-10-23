public class Auth_Request
{
    public string AuthString { get; set; }
    public string Password { get; set; }

    public Auth_Request(string authstring, string Password)
    {
        this.AuthString = authstring;
        this.Password = Password;
    }
}