using SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

namespace SirGRAMS.Infrastructure.ExternalServices.Phivolcs;

public interface IPhivolcsEarthquakeClient
{
    Task<IReadOnlyList<PhivolcsEarthquakeResponse>> GetActiveEarthquakesAsync(
        CancellationToken cancellationToken);
}