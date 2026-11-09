using EarthquakeEntity = SirGRAMS.Domain.Entities.Earthquake;

namespace SirGRAMS.Application.Common.Interfaces;

public interface IEarthquakeRepository
{
    // QUERIES
    Task<List<EarthquakeEntity>> GetRecentAsync(
        int limit,
        CancellationToken cancellationToken);

    Task<EarthquakeEntity?> GetByExternalIdAsync(
        string externalId,
        CancellationToken cancellationToken);

    Task<bool> ExistsByExternalIdAsync(
        string externalId,
        CancellationToken cancellationToken);

    // COMMANDS
    Task AddAsync(
        EarthquakeEntity earthquake,
        CancellationToken cancellationToken);
}