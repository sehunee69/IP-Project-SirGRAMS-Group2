using SirGRAMS.Infrastructure.ExternalServices.Phivolcs;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

namespace SirGRAMS.Workers.Volcano;

public sealed class FakePhivolcsVolcanoClient : IPhivolcsVolcanoClient
{
    private readonly ILogger<FakePhivolcsVolcanoClient> _logger;

    public FakePhivolcsVolcanoClient(
        ILogger<FakePhivolcsVolcanoClient> logger)
    {
        _logger = logger;
    }

    public async Task<IReadOnlyList<PhivolcsVolcanoBulletinResponse>>
        GetLatestBulletinsAsync(
            CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Using FAKE Phivolcs volcano data.");

        await Task.Delay(
            100,
            cancellationToken);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var bulletin = new PhivolcsVolcanoBulletinResponse(
            ExternalId: $"mvo-{today:yyyy-MM-dd}",
            VolcanoCode: "mvo",
            BulletinDate: today,
            AlertLevel: 3,
            AlertDescription: "Fake alert description",
            VolcanicEarthquakeCount: 6,
            Seismicity: "6 volcanic earthquakes",
            SulfurDioxideTonnesPerDay: 2614,
            Plume: "Moderate emission; southwest drift",
            GroundDeformation: "Inflation of the edifice",
            SourceUrl: "https://example.invalid/fake-bulletin");

        return [bulletin];
    }
}