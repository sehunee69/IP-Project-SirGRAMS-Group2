namespace SirGRAMS.Application.Features.Earthquakes.DTOs;

public sealed record EarthquakeDto(
    Guid Id,
    double Magnitude,
    double DepthKm,
    double Latitude,
    double Longitude,
    string LocationDescription,
    DateTimeOffset OccurredAt);