﻿using Microsoft.EntityFrameworkCore;
using System;

public class UserDBContext : DbContext
{
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseSqlServer("Server=localhost,10004;database=UserDB;User Id=sa;password=Nc220370979;TrustServerCertificate=True;");
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
	optionsBuilder.UseSqlServer("Server=localhost,10004;database=UserPassDB;User Id=sa;password=Nc220370979;TrustServerCertificate=True;");
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
