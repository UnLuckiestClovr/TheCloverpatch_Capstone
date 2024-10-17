using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

public class UserRoleHandler_Employee : AuthorizationHandler<UserIDRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserIDRequirement requirement)
    {
        var userIDClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIDClaim != null)
        {
            if (requirement._EmpList.Contains(userIDClaim))
            {
                context.Succeed(requirement);
            }
            else if (requirement._AdminList.Contains(userIDClaim))
            {
                context.Succeed(requirement);
            }
        }

        return Task.CompletedTask;
    }
}

public class UserRoleHandler_Admin : AuthorizationHandler<UserIDRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserIDRequirement requirement)
    {
        var userIDClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIDClaim != null)
        {
            if (requirement._AdminList.Contains(userIDClaim))
            {
                context.Succeed(requirement);
            }
        }

        return Task.CompletedTask;
    }
}