using System.Runtime.CompilerServices;
using MediatR;
using SirGRAMS.Application.Common.Interfaces;
using EarthquakeEntity = SirGRAMS.Domain.Entities.Earthquake;

namespace SirGRAMS.Application.Features.Earthquakes.Commands;

public sealed class CreateEarthquakeCommandHandler
    : IRequestHandler<CreateEarthquakeCommand, Guid>
{
    private readonly IEarthquakeRepository _repository;

    public CreateEarthquakeCommandHandler(IEarthquakeRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(
        CreateEarthquakeCommand request,
        CancellationToken cancellationToken)
    {
        var existingEarthquake =
            await _repository.GetByExternalIdAsync(
                request.ExternalId,
                cancellationToken);

        if (existingEarthquake is not null)
        {
            return existingEarthquake.Id;
        }

        var earthquake = new EarthquakeEntity(
            externalId: request.ExternalId,
            magnitude: request.Magnitude,
            depthKm: request.DepthKm,
            latitude: request.Latitude,
            longitude: request.Longitude,
            locationDescription: request.LocationDescription,
            occurredAt: request.OccurredAt);

        await _repository.AddAsync(
            earthquake,
            cancellationToken);

        return earthquake.Id;
    }
}