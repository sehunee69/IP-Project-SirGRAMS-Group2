namespace SirGRAMS.Domain.Entities;

public class VolcanoBulletin
{
    public Guid Id { get; private set; }

    public Guid VolcanoId { get; private set; }

    public string ExternalId { get; private set; }

    public DateOnly BulletinDate { get; private set; }

    public int AlertLevel { get; private set; }

    public string AlertDescription { get; private set; }

    public int? VolcanicEarthquakeCount { get; private set; }

    public double? SulfurDioxideTonnesPerDay { get; private set; }

    public string? Plume { get; private set; }

    public string? GroundDeformation { get; private set; }

    public string SourceUrl { get; private set; }

    private VolcanoBulletin()
    {
        ExternalId = null!;
        AlertDescription = null!;
        SourceUrl = null!;
    }

    public VolcanoBulletin(
        Guid volcanoId,
        string externalId,
        DateOnly bulletinDate,
        int alertLevel,
        string alertDescription,
        int? volcanicEarthquakeCount,
        double? sulfurDioxideTonnesPerDay,
        string? plume,
        string? groundDeformation,
        string sourceUrl)
    {
        if (volcanoId == Guid.Empty)
            throw new ArgumentException(
                "Volcano ID is required.",
                nameof(volcanoId));

        if (string.IsNullOrWhiteSpace(externalId))
            throw new ArgumentException(
                "External ID is required.",
                nameof(externalId));

        if (alertLevel is < 0 or > 5)
            throw new ArgumentOutOfRangeException(
                nameof(alertLevel),
                "Alert level must be between 0 and 5.");

        if (string.IsNullOrWhiteSpace(alertDescription))
            throw new ArgumentException(
                "Alert description is required.",
                nameof(alertDescription));

        if (volcanicEarthquakeCount < 0)
            throw new ArgumentOutOfRangeException(
                nameof(volcanicEarthquakeCount));

        if (sulfurDioxideTonnesPerDay < 0)
            throw new ArgumentOutOfRangeException(
                nameof(sulfurDioxideTonnesPerDay));

        if (string.IsNullOrWhiteSpace(sourceUrl))
            throw new ArgumentException(
                "Source URL is required.",
                nameof(sourceUrl));

        Id = Guid.NewGuid();
        VolcanoId = volcanoId;
        ExternalId = externalId;
        BulletinDate = bulletinDate;
        AlertLevel = alertLevel;
        AlertDescription = alertDescription;
        VolcanicEarthquakeCount = volcanicEarthquakeCount;
        SulfurDioxideTonnesPerDay = sulfurDioxideTonnesPerDay;
        Plume = plume;
        GroundDeformation = groundDeformation;
        SourceUrl = sourceUrl;
    }
}