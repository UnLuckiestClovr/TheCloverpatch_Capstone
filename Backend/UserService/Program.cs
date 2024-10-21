using Microsoft.AspNetCore.Authorization;

namespace UserService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Register HTTPContextAccessor for Header Reading
            builder.Services.AddHttpContextAccessor();

            // Add Services
            builder.Services.AddControllers();
            builder.Services.AddDbContext<UserDBContext>();
            builder.Services.AddDbContext<PasswordDBContext>();
            builder.Services.AddDbContext<HigherPermUserContext>();

            // Configure Authorization Policies
            builder.Services.AddAuthorization(options =>
            {
                // Policy for Employee Access
                options.AddPolicy("EmployeePolicy", policy => policy.Requirements.Add(new UserIDRequirement()) );
                options.AddPolicy("AdminPolicy", policy => policy.Requirements.Add(new UserIDRequirement()) );
            });

            // Register Auth Handlers
            builder.Services.AddScoped<IAuthorizationHandler, UserRoleHandler_Employee>();
            builder.Services.AddScoped<IAuthorizationHandler, UserRoleHandler_Admin>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
