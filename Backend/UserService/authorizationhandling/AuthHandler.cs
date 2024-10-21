using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

public class UserRoleHandler_Employee : AuthorizationHandler<UserIDRequirement>
{
    private readonly HigherPermUserContext _dbContext;

    public UserRoleHandler_Employee(HigherPermUserContext dbContext) { this._dbContext = dbContext; }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserIDRequirement requirement)
    {
        var userIDClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIDClaim != null)
        {
            if (await _dbContext.CheckAuthorizedIDs_Async(userIDClaim))
            {
                context.Succeed(requirement);
            }
        }

        await Task.CompletedTask;
    }
}

public class UserRoleHandler_Admin : AuthorizationHandler<UserIDRequirement>
{
    private readonly HigherPermUserContext _dbContext;

    public UserRoleHandler_Admin(HigherPermUserContext dbContext) { this._dbContext = dbContext; }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserIDRequirement requirement)
    {
        var userIDClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIDClaim != null)
        {
            if (await _dbContext.CheckAdminIDs_Async(userIDClaim))
            {
                context.Succeed(requirement);
            }
        }

        await Task.CompletedTask;
    }
}