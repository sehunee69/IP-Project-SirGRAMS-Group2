namespace SirGRAMS.Domain.Entities;

public class Earthquake
{
    public Guid Id { get; private set; }

    public string ExternalId { get; private set; }

    public double Magnitude { get; private set; }

    public double DepthKm { get; private set; }

    public double Latitude { get; private set; }

    public double Longitude { get; private set; }

    public string LocationDescription { get; private set; }

    public DateTimeOffset OccurredAt { get; private set; }

    private Earthquake()
    {
        ExternalId = null!;
        LocationDescription = null!;
    }

    public Earthquake(
        string externalId,
        double magnitude,
        double depthKm,
        double latitude,
        double longitude,
        string locationDescription,
        DateTimeOffset occurredAt)
    {
        if (string.IsNullOrWhiteSpace(externalId))
            throw new ArgumentException(
                "External ID is required.",
                nameof(externalId));

        if (magnitude < 0)
            throw new ArgumentOutOfRangeException(
                nameof(magnitude));

        if (depthKm < 0)
            throw new ArgumentOutOfRangeException(
                nameof(depthKm));

        if (latitude is < -90 or > 90)
            throw new ArgumentOutOfRangeException(
                nameof(latitude),
                "Latitude must be between -90 and 90.");

        if (longitude is < -180 or > 180)
            throw new ArgumentOutOfRangeException(
                nameof(longitude),
                "Longitude must be between -180 and 180.");

        if (string.IsNullOrWhiteSpace(locationDescription))
            throw new ArgumentException(
                "Location description is required.",
                nameof(locationDescription));

        Id = Guid.NewGuid();
        ExternalId = externalId;
        Magnitude = magnitude;
        DepthKm = depthKm;
        Latitude = latitude;
        Longitude = longitude;
        LocationDescription = locationDescription;
        OccurredAt = occurredAt.ToUniversalTime();
    }
}