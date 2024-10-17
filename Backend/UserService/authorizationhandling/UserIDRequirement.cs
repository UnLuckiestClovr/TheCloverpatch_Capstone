using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

public class UserIDRequirement : IAuthorizationRequirement
{
    public List<string> _EmpList { get; }
    public List<string> _AdminList { get; }

    public UserIDRequirement(List<string> emps, List<string> ads)
    {
        _EmpList = emps;
        _AdminList = ads;
    }
}