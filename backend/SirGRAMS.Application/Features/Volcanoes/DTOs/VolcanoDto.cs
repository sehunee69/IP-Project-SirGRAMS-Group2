namespace SirGRAMS.Application.Features.Volcanoes.DTOs;

public sealed record VolcanoBulletinDto(
    DateOnly BulletinDate,
    int AlertLevel,
    string AlertDescription,
    int? VolcanicEarthquakeCount,
    double? SulfurDioxideTonnesPerDay,
    string? Plume,
    string? GroundDeformation,
    string SourceUrl);

public sealed record VolcanoDto(
    Guid Id,
    string Code,
    string Name,
    double Latitude,
    double Longitude,
    string Province,
    VolcanoBulletinDto? LatestBulletin);