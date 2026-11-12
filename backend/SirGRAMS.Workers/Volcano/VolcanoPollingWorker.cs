using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Domain.Entities;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs;

namespace SirGRAMS.Workers.Volcano;

public sealed class VolcanoPollingWorker : BackgroundService
{
    private static readonly TimeSpan PollInterval =
        TimeSpan.FromMinutes(30);

    private readonly IPhivolcsVolcanoClient _phivolcsClient;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<VolcanoPollingWorker> _logger;

    public VolcanoPollingWorker(
        IPhivolcsVolcanoClient phivolcsClient,
        IServiceScopeFactory scopeFactory,
        ILogger<VolcanoPollingWorker> logger)
    {
        _phivolcsClient = phivolcsClient;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Volcano polling worker started.");

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
                    "Error occurred while polling PHIVOLCS volcano bulletins.");
            }

            _logger.LogInformation(
                "Next volcano polling cycle in {Minutes} minutes.",
                PollInterval.TotalMinutes);

            try
            {
                await Task.Delay(
                    PollInterval,
                    cancellationToken);
            }
            catch (OperationCanceledException)
                when (cancellationToken.IsCancellationRequested)
            {
                break;
            }
        }

        _logger.LogInformation(
            "Volcano polling worker stopped.");
    }

    private async Task PollPhivolcsAsync(
        CancellationToken cancellationToken)
    {
        var bulletins =
            await _phivolcsClient.GetLatestBulletinsAsync(
                cancellationToken);

        if (bulletins.Count == 0)
        {
            _logger.LogInformation(
                "No volcano bulletins retrieved.");

            return;
        }

        using var scope = _scopeFactory.CreateScope();

        var repository = scope.ServiceProvider
            .GetRequiredService<IVolcanoRepository>();

        var savedCount = 0;

        foreach (var response in bulletins)
        {
            try
            {
                if (await repository.BulletinExistsAsync(
                        response.ExternalId,
                        cancellationToken))
                {
                    continue;
                }

                var volcano = await repository.GetByCodeAsync(
                    response.VolcanoCode,
                    cancellationToken);

                if (volcano is null)
                {
                    _logger.LogWarning(
                        "No volcano is stored for code {Code}; skipping bulletin {ExternalId}.",
                        response.VolcanoCode,
                        response.ExternalId);

                    continue;
                }

                var bulletin = new VolcanoBulletin(
                    volcano.Id,
                    response.ExternalId,
                    response.BulletinDate,
                    response.AlertLevel,
                    response.AlertDescription,
                    response.VolcanicEarthquakeCount,
                    response.SulfurDioxideTonnesPerDay,
                    response.Plume,
                    response.GroundDeformation,
                    response.SourceUrl);

                await repository.AddBulletinAsync(
                    bulletin,
                    cancellationToken);

                savedCount++;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Skipping invalid volcano bulletin {ExternalId}.",
                    response.ExternalId);
            }
        }

        _logger.LogInformation(
            "Saved {Saved} new volcano bulletins ({Skipped} already stored or skipped).",
            savedCount,
            bulletins.Count - savedCount);
    }
}