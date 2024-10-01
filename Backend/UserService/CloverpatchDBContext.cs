using Microsoft.EntityFrameworkCore;
using System;

public class UserDBContext : DbContext
{
	public DbSet<User> Users { get; set; }

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseSqlServer("Server=localhost,1433;database=UserDB;User Id= sa;password=Nc220370979;TrustServerCertificate=True;");
	}
}

public class PasswordDBContext : DbContext
{
	public DbSet<UserPassword> Passwords { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
		optionsBuilder.UseSqlServer("Server=localhost,1433;database=UserPassDB;User Id= sa;password=Nc220370979;TrustServerCertificate=True;");
    }
}
