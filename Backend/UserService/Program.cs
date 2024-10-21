namespace UserService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add Services
            builder.Services.AddControllers();
            builder.Services.AddDbContext<UserDBContext>();
            builder.Services.AddDbContext<PasswordDBContext>();

            // Configure Authorization Policies
            builder.Services.AddAuthorization(options =>
                // Policy for Employee Access
                options.AddPolicy("EmployeePolicy", policy =>
                    policy.Requirements.Add(new UserRoleHandler_Employee())
                )
            )


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
