namespace UserService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("/", () => "Hello World!");

            app.MapPost("/user/register", async (NewUser newuser) =>
            {
                return DatabaseFunctions.RegisterUser(newuser);
            });

            

            app.Run();
        }
    }
}
