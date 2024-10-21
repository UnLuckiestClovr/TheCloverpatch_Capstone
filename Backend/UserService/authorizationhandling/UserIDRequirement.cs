using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

public class UserIDRequirement : IAuthorizationRequirement
{
    public UserIDRequirement() {}
}