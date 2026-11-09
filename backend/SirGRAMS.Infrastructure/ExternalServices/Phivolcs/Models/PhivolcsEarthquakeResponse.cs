namespace SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

public sealed record PhivolcsEarthquakeResponse(
    string ExternalId,
    double Magnitude,
    double DepthKm,
    double Latitude,
    double Longitude,
    string LocationDescription,
    DateTimeOffset OccurredAt
);