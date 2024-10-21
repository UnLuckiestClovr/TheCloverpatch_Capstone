public class UserPasswordChangeInfo
{
    public string UserID { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }

    public UserPasswordChangeInfo() {}

    public UserPasswordChangeInfo(string uid, string oldpass, string newpass)
    {
        UserID = uid;
        OldPassword = oldpass;
        NewPassword = HashPassword(newpass);
    }

    // Hashes Password for more secure Storage and Usage
    public string HashPassword(string password) 
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}