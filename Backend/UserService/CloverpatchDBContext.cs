using Microsoft.EntityFrameworkCore;
using System;

public class UserDBContext : DbContext
{
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseSqlServer("Server=CloverpatchUserDatabase;database=UserDB;User Id=sa;password=Nc220370979;TrustServerCertificate=True;");
	}

  public UserDBContext() {
    Database.EnsureCreated();
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<User>().ToTable("Users");
  }

    public DbSet<User> Users { get; set; }
}


public class PasswordDBContext : DbContext
{
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
	optionsBuilder.UseSqlServer("Server=CloverpatchUserDatabase;database=UserPassDB;User Id=sa;password=Nc220370979;TrustServerCertificate=True;");
  }

  public PasswordDBContext() {
    Database.EnsureCreated();
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<UserPassword>().ToTable("Passwords");
  }

  public DbSet<UserPassword> Passwords { get; set; }
}

public class HigherPermUserContext : DbContext
{
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
	optionsBuilder.UseSqlServer("Server=CloverpatchUserDatabase;database=EnhancedUsersDB;User Id=sa;password=Nc220370979;TrustServerCertificate=True;");
  }

  public HigherPermUserContext() {
    Database.EnsureCreated();
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<UserEnhancedPermissions>().ToTable("EnhancedUsers");
  }

  public DbSet<UserEnhancedPermissions> EnhancedUsers { get; set; }


  public async Task<bool> CheckAdminIDs_Async(string checkedID)
  {
    return await EnhancedUsers.AnyAsync(u => u.ID.Equals(checkedID) && u.PermissionToken == "ADM");
  }

  public async Task<bool> CheckAuthorizedIDs_Async(string checkedID)
  {
    return await EnhancedUsers.AnyAsync(u => u.ID.Equals(checkedID));
  }
}
