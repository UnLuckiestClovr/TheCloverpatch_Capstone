public class UserEnhancedPermissions
{
    private string _UID { get; set; }

    private string _PermissionToken { get; set; } // EMP or ADM

    public UserEnhancedPermissions(string uid, string permToken)
    {
        this._UID = uid;
        this._PermissionToken = permToken;
    }


    public string getUID() { return _UID; }

    public string getPermToken() { return _PermissionToken;}
}