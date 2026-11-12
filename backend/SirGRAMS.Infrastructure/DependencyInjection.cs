using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Infrastructure.Persistence.Context;
using SirGRAMS.Infrastructure.Repositories;

namespace SirGRAMS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString =
            configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(
                connectionString,
                npgsqlOptions =>
                {
                    npgsqlOptions.UseNetTopologySuite();
                }
            );
        });

        services.AddScoped<
            IEarthquakeRepository,
            EarthquakeRepository>();

        services.AddScoped<
            IVolcanoRepository,
            VolcanoRepository>();

        return services;
    }
}