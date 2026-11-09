using System.Globalization;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

namespace SirGRAMS.Infrastructure.ExternalServices.Phivolcs;

public sealed class PhivolcsEarthquakeClient : IPhivolcsEarthquakeClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PhivolcsEarthquakeClient> _logger;

    public PhivolcsEarthquakeClient(
        HttpClient httpClient,
        ILogger<PhivolcsEarthquakeClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<IReadOnlyList<PhivolcsEarthquakeResponse>>
        GetActiveEarthquakesAsync(
            CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Fetching earthquake bulletin from PHIVOLCS.");

        var html = await _httpClient.GetStringAsync(
            string.Empty,
            cancellationToken);

        var earthquakes = ParseEarthquakes(html);

        if (earthquakes.Count == 0)
        {
            _logger.LogWarning(
                "PHIVOLCS bulletin was retrieved, but no earthquake rows could be parsed.");
        }

        return earthquakes;
    }

    // NOTE: PHIVOLCS's real page is an MS-Word-exported HTML table, not
    // free-flowing prose. One <tr> per earthquake, six <td> cells in order:
    // Date-Time, Latitude, Longitude, Depth, Magnitude, Location.
    private static List<PhivolcsEarthquakeResponse> ParseEarthquakes(
        string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var results = new List<PhivolcsEarthquakeResponse>();

        var rows = doc.DocumentNode.SelectNodes(
            "//table[contains(@class,'MsoNormalTable')]//tr[td]");

        if (rows is null)
        {
            return results;
        }

        foreach (var row in rows)
        {
            var cells = row.SelectNodes("td");

            if (cells is null || cells.Count < 6)
            {
                continue;
            }

            var dateTimeText = CleanText(cells[0].InnerText);
            var latitudeText = CleanText(cells[1].InnerText);
            var longitudeText = CleanText(cells[2].InnerText);
            var depthText = CleanText(cells[3].InnerText);
            var magnitudeText = CleanText(cells[4].InnerText);
            var locationText = CleanText(cells[5].InnerText);

            if (!DateTime.TryParseExact(
                    dateTimeText,
                    "d MMMM yyyy - h:mm tt",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out var phivolcsTime))
            {
                continue;
            }

            var occurredAt = new DateTimeOffset(
                phivolcsTime,
                TimeSpan.FromHours(8)).ToUniversalTime();

            if (!double.TryParse(latitudeText, NumberStyles.Float, CultureInfo.InvariantCulture, out var latitude) ||
                !double.TryParse(longitudeText, NumberStyles.Float, CultureInfo.InvariantCulture, out var longitude) ||
                !double.TryParse(depthText, NumberStyles.Float, CultureInfo.InvariantCulture, out var depthKm) ||
                !double.TryParse(magnitudeText, NumberStyles.Float, CultureInfo.InvariantCulture, out var magnitude))
            {
                continue;
            }

            var externalId =
                ExtractExternalId(row) ??
                $"{occurredAt:yyyyMMddHHmm}-{latitude}-{longitude}";

            results.Add(new PhivolcsEarthquakeResponse(
                ExternalId: externalId,
                Magnitude: magnitude,
                DepthKm: depthKm,
                Latitude: latitude,
                Longitude: longitude,
                LocationDescription: locationText,
                OccurredAt: occurredAt));
        }

        return results;
    }

    private static string CleanText(string raw) =>
        Regex.Replace(raw, @"\s+", " ").Trim();

    // Pulls the real PHIVOLCS bulletin ID from the row's link, e.g.
    // ".../2026_0824_0407_B1.html" -> "2026_0824_0407_B1". Falls back to a
    // synthetic ID (in ParseEarthquakes) if a row has no link for some reason.
    private static string? ExtractExternalId(HtmlNode row)
    {
        var href = row
            .SelectSingleNode(".//a")?
            .GetAttributeValue("href", null);

        if (string.IsNullOrWhiteSpace(href))
        {
            return null;
        }

        var fileName = href.Split('\\', '/')[^1];

        return Path.GetFileNameWithoutExtension(fileName);
    }
}