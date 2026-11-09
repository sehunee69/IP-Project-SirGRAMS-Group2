using Microsoft.EntityFrameworkCore;
using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Infrastructure.Persistence.Context;
using EarthquakeEntity = SirGRAMS.Domain.Entities.Earthquake;

namespace SirGRAMS.Infrastructure.Repositories;

public sealed class EarthquakeRepository : IEarthquakeRepository
{
    private readonly AppDbContext _dbContext;

    public EarthquakeRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // QUERIES
    public async Task<List<EarthquakeEntity>> GetRecentAsync(
        int limit,
        CancellationToken cancellationToken)
    {
        return await _dbContext.Earthquakes
            .OrderByDescending(e => e.OccurredAt)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }

    public async Task<EarthquakeEntity?> GetByExternalIdAsync(
        string externalId,
        CancellationToken cancellationToken)
    {
        return await _dbContext.Earthquakes
            .FirstOrDefaultAsync(
                earthquake => earthquake.ExternalId == externalId,
                cancellationToken);
    }

    public async Task<bool> ExistsByExternalIdAsync(
        string externalId,
        CancellationToken cancellationToken)
    {
        return await _dbContext.Earthquakes
            .AnyAsync(
                e => e.ExternalId == externalId,
                cancellationToken);
    }

    // COMMANDS
    public async Task AddAsync(
        EarthquakeEntity earthquake,
        CancellationToken cancellationToken)
    {
        await _dbContext.Earthquakes.AddAsync(
            earthquake,
            cancellationToken);

        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}