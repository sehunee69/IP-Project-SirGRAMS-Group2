using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure.Internal;
using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs;
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

        services.AddHttpClient<
            IPhivolcsEarthquakeClient,
            PhivolcsEarthquakeClient>(client =>
        {
            client.BaseAddress = new Uri(
                "https://earthquake.phivolcs.dost.gov.ph/");
        });

        return services;
    }
}