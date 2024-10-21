public class UserPasswordChangeInfo
{
    public string UserID;
    public string OldPassword;
    public string NewPassword;

    public UserPasswordChangeInfo() {}

    public UserPasswordChangeInfo(string uid, string oldpass, string newpass)
    {
        UserID = uid;
        OldPassword = oldpass;
        NewPassword = newpass;
    }
}