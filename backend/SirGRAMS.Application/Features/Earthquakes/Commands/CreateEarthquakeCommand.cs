using MediatR;

namespace SirGRAMS.Application.Features.Earthquakes.Commands;

public sealed record CreateEarthquakeCommand(
    string ExternalId,
    double Magnitude,
    double DepthKm,
    double Latitude,
    double Longitude,
    string LocationDescription,
    DateTimeOffset OccurredAt
) : IRequest<Guid>;