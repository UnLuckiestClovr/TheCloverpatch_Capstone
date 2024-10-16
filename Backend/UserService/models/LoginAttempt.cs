public class LoginAttempt
{
    public string UsernameOrEmail { get; set; }
    public string Password { get; set; }

    public LoginAttempt(string UsernameOrEmail, string Password)
    {
        this.UsernameOrEmail = UsernameOrEmail;
        this.Password = Password;
    }
}