namespace SirGRAMS.Domain.Entities;

public class Volcano
{
    public Guid Id { get; private set; }

    public string Code { get; private set; }

    public string Name { get; private set; }

    public double Latitude { get; private set; }

    public double Longitude { get; private set; }

    public string Province { get; private set; }

    private Volcano()
    {
        Code = null!;
        Name = null!;
        Province = null!;
    }

    public Volcano(
        string code,
        string name,
        double latitude,
        double longitude,
        string province)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException(
                "Code is required.",
                nameof(code));

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(
                "Name is required.",
                nameof(name));

        if (latitude is < -90 or > 90)
            throw new ArgumentOutOfRangeException(
                nameof(latitude),
                "Latitude must be between -90 and 90.");

        if (longitude is < -180 or > 180)
            throw new ArgumentOutOfRangeException(
                nameof(longitude),
                "Longitude must be between -180 and 180.");

        if (string.IsNullOrWhiteSpace(province))
            throw new ArgumentException(
                "Province is required.",
                nameof(province));

        Id = Guid.NewGuid();
        Code = code;
        Name = name;
        Latitude = latitude;
        Longitude = longitude;
        Province = province;
    }
}