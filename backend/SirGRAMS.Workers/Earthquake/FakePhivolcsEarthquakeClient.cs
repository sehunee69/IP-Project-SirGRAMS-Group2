using SirGRAMS.Infrastructure.ExternalServices.Phivolcs;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

namespace SirGRAMS.Workers.Earthquake;

public sealed class FakePhivolcsEarthquakeClient : IPhivolcsEarthquakeClient
{
    private readonly ILogger<FakePhivolcsEarthquakeClient> _logger;

    public FakePhivolcsEarthquakeClient(
        ILogger<FakePhivolcsEarthquakeClient> logger)
    {
        _logger = logger;
    }

    public async Task<IReadOnlyList<PhivolcsEarthquakeResponse>>
        GetActiveEarthquakesAsync(
            CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Using FAKE Phivolcs data.");

        await Task.Delay(
            100,
            cancellationToken);

        var earthquake = new PhivolcsEarthquakeResponse(
            ExternalId: "SIRGRAMS",
            Magnitude: 5.1,
            DepthKm: 2,
            Latitude: 12.5,
            Longitude: 130.2,
            LocationDescription: "SIRGRAMS",
            OccurredAt: DateTimeOffset.UtcNow);

        return [earthquake];
    }

}