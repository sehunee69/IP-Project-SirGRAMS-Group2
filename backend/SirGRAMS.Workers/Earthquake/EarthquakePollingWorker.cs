using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs;
using EarthquakeEntity = SirGRAMS.Domain.Entities.Earthquake;

namespace SirGRAMS.Workers.Earthquake;

public sealed class EarthquakePollingWorker : BackgroundService
{
    private readonly IPhivolcsEarthquakeClient _phivolcsClient;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<EarthquakePollingWorker> _logger;


    public EarthquakePollingWorker(
        IPhivolcsEarthquakeClient phivolcsClient,
        IServiceScopeFactory scopeFactory,
        ILogger<EarthquakePollingWorker> logger)
    {
        _phivolcsClient = phivolcsClient;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(
        CancellationToken cancellationToken
    )
    {
        _logger.LogInformation(
            """
            ========================================
                 SirGRAMS Earthquake Monitor
            ========================================
            """);

        _logger.LogInformation(
            "Earthquake polling worker started.");

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await PollPhivolcsAsync(cancellationToken);
            }
            catch (OperationCanceledException)
                when (cancellationToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error occurred while polling PHIVOLCS.");
            }

            if (cancellationToken.IsCancellationRequested)
                break;

            _logger.LogInformation(
                "Next PHIVOLCS polling cycle in 5 minutes.");

            try
            {
                await Task.Delay(
                    TimeSpan.FromMinutes(5),
                    cancellationToken);
            }
            catch (OperationCanceledException)
                when (cancellationToken.IsCancellationRequested)
            {
                break;
            }
        }

        _logger.LogInformation(
            "Earthquake polling worker stopped.");
    }

    private async Task PollPhivolcsAsync(
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Polling PHIVOLCS for active earthquakes...");

        var earthquakes =
            await _phivolcsClient.GetActiveEarthquakesAsync(
                cancellationToken);

        _logger.LogInformation(
            "========================================");

        _logger.LogInformation(
            "PHIVOLCS Earthquake Monitor Update");

        _logger.LogInformation(
            "Last Updated: {Time}",
            DateTimeOffset.Now);

        _logger.LogInformation(
            "Active Earthquakes: {Count}",
            earthquakes.Count);

        _logger.LogInformation(
            "========================================");

        if (earthquakes.Count == 0)
        {
            _logger.LogInformation(
                "No active earthquakes.");

            return;
        }

        // foreach (var earthquake in earthquakes)
        // {
        //     LogEarthquake(earthquake);
        // }
        using var scope = _scopeFactory.CreateScope();

        var repository = scope.ServiceProvider
            .GetRequiredService<IEarthquakeRepository>();

        var savedCount = 0;

        foreach (var response in earthquakes)
        {
            try
            {
                if (await repository.ExistsByExternalIdAsync(
                        response.ExternalId,
                        cancellationToken))
                {
                    continue;
                }

                var earthquake = new EarthquakeEntity(
                    response.ExternalId,
                    response.Magnitude,
                    response.DepthKm,
                    response.Latitude,
                    response.Longitude,
                    response.LocationDescription,
                    response.OccurredAt);

                await repository.AddAsync(
                    earthquake,
                    cancellationToken);

                savedCount++;
            }
            catch (Exception ex) when (earthquakes is ArgumentException)
            {
                _logger.LogWarning(
                    ex,
                    "Skipping invalid earthquake {ExternalId}.",
                    response.ExternalId);
            }
        }

        _logger.LogInformation(
            "Saved {Saved} new earthquakes ({Skipped} already stored or skipped).",
            savedCount,
            earthquakes.Count - savedCount);
    }

    private void LogEarthquake(
        SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models.PhivolcsEarthquakeResponse earthquake)
    {
        _logger.LogInformation(
            """
            ----------------------------------------
            ACTIVE EARTHQUAKE
            ----------------------------------------
            ID: {ExternalId}

            Magnitude: {Magnitude}

            Depth (Km): {DepthKm}

            Location:
              Latitude: {Latitude}°
              Longitude: {Longitude}°

            Location Description: {LocationDescription}

            Observed At:
              {ObservedAt}
            ----------------------------------------
            """,
            earthquake.ExternalId,
            earthquake.Magnitude,
            earthquake.DepthKm,
            earthquake.Latitude,
            earthquake.Longitude,
            earthquake.LocationDescription,
            earthquake.OccurredAt);
    }
}