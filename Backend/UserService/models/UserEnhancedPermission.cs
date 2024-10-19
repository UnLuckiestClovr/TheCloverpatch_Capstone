public class UserEnhancedPermissions
{
    public string ID { get; set; } // Primary Key

    public string PermissionToken { get; set; } // EMP or ADM

    public UserEnhancedPermissions() {}

    public UserEnhancedPermissions(string id, string permToken)
    {
        this.ID = id;
        this.PermissionToken = permToken;
    }


    public string getID() { return ID; }

    public string getPermToken() { return PermissionToken;}
}