namespace SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

public sealed record PhivolcsVolcanoBulletinResponse(
    string ExternalId,
    string VolcanoCode,
    DateOnly BulletinDate,
    int AlertLevel,
    string AlertDescription,
    int? VolcanicEarthquakeCount,
    string? Seismicity,
    double? SulfurDioxideTonnesPerDay,
    string? Plume,
    string? GroundDeformation,
    string SourceUrl);