using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

public class UserRoleHandler_Employee : AuthorizationHandler<UserIDRequirement>
{
    private readonly HigherPermUserContext _dbContext;
    private readonly IHttpContextAccessor _contextAccessor;

    public UserRoleHandler_Employee(HigherPermUserContext dbContext, IHttpContextAccessor contextAccessor) 
    { 
        this._dbContext = dbContext; 
        this._contextAccessor = contextAccessor;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserIDRequirement requirement)
    {
        var httpContext = _contextAccessor.HttpContext;
        var userIDClaim = httpContext?.Request.Headers["AuthenticationToken"].FirstOrDefault();

        if (!string.IsNullOrEmpty(userIDClaim))
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
    private readonly IHttpContextAccessor _contextAccessor;

    public UserRoleHandler_Admin(HigherPermUserContext dbContext, IHttpContextAccessor contextAccessor) 
    { 
        this._dbContext = dbContext; 
        this._contextAccessor = contextAccessor;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserIDRequirement requirement)
    {
        var httpContext = _contextAccessor.HttpContext;
        var userIDClaim = httpContext?.Request.Headers["AuthenticationToken"].FirstOrDefault();

        // Use Token ; Check for Null or Absent Token
        if (!string.IsNullOrEmpty(userIDClaim))
        {
            if (await _dbContext.CheckAdminIDs_Async(userIDClaim))
            {
                context.Succeed(requirement);
            }
        }

        await Task.CompletedTask;
    }
}