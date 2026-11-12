using Microsoft.EntityFrameworkCore;
using SirGRAMS.Domain.Entities;

namespace SirGRAMS.Infrastructure.Persistence.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Earthquake> Earthquakes => Set<Earthquake>();
    public DbSet<Volcano> Volcanoes => Set<Volcano>();
    public DbSet<VolcanoBulletin> VolcanoBulletins => Set<VolcanoBulletin>();
}