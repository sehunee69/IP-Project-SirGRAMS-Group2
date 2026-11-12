using System.Globalization;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

namespace SirGRAMS.Infrastructure.ExternalServices.Phivolcs;

public sealed class PhivolcsVolcanoClient : IPhivolcsVolcanoClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PhivolcsVolcanoClient> _logger;

    public PhivolcsVolcanoClient(
        HttpClient httpClient,
        ILogger<PhivolcsVolcanoClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    private static readonly Regex BulletinLinkPattern = new(
        @"activity-(?<code>[a-z]+)\?bid=(?<bid>\d+)&lang=en$",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public async Task<IReadOnlyList<PhivolcsVolcanoBulletinResponse>>
        GetLatestBulletinsAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation(
                "Fetching volcano bulletin list from PHIVOLCS.");

        var listHtml = await _httpClient.GetStringAsync(
            "bulletin/list-of-bulletin",
            cancellationToken);

        var links = FindLatestBulletinLinks(listHtml);

        if (links.Count == 0)
        {
            _logger.LogWarning(
                "PHIVOLCS volcano list was retrieved, but no English bulletin links were found.");

            return [];
        }

        var results = new List<PhivolcsVolcanoBulletinResponse>();

        foreach (var (code, href) in links)
        {
            try
            {
                var uri = new Uri(_httpClient.BaseAddress!, href);

                var html = await _httpClient.GetStringAsync(
                    uri,
                    cancellationToken);

                var bulletin = ParseBulletin(
                    html,
                    code,
                    uri.ToString());

                if (bulletin is null)
                {
                    _logger.LogWarning(
                        "Could not parse the {Code} volcano bulletin.",
                        code);

                    continue;
                }

                results.Add(bulletin);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed to fetch the {Code} volcano bulletin.",
                    code);
            }
        }

        return results;
    }

    // Finds each volcano's newest English bulletin link on the list page.
    // Links look like .../bulletin/activity-kvo?bid=14913&lang=en, and a
    // higher bid is a newer bulletin.
    private static List<(string Code, string Href)> FindLatestBulletinLinks(
        string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var anchors = doc.DocumentNode.SelectNodes("//a[@href]");

        if (anchors is null)
        {
            return [];
        }

        return anchors
            .Select(a => HtmlEntity.DeEntitize(
                a.GetAttributeValue("href", string.Empty)))
            .Select(href => (Href: href, Match: BulletinLinkPattern.Match(href)))
            .Where(x => x.Match.Success)
            .GroupBy(x => x.Match.Groups["code"].Value.ToLowerInvariant())
            .Select(group => group
                .OrderByDescending(x => int.Parse(x.Match.Groups["bid"].Value))
                .First())
            .Select(x => (
                Code: x.Match.Groups["code"].Value.ToLowerInvariant(),
                Href: x.Href))
            .ToList();
    }

    // ParseBulletin, GetParameter, CleanText, LeadingInt and
    // LeadingNumber from the previous message go here.
    private static PhivolcsVolcanoBulletinResponse? ParseBulletin(
        string html,
        string volcanoCode,
        string sourceUrl)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var dateText = doc.DocumentNode
            .SelectSingleNode("//input[@id='bdate']")?
            .GetAttributeValue("value", string.Empty);

        var alertText = doc.DocumentNode
            .SelectSingleNode("//div[@class='circle']")?
            .InnerText;

        if (!DateOnly.TryParseExact(
                dateText,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var bulletinDate) ||
            !int.TryParse(alertText?.Trim(), out var alertLevel))
        {
            return null;
        }

        var status = CleanText(
                doc.DocumentNode
                    .SelectSingleNode("//p[@class='txt-status']")?
                    .InnerText ?? string.Empty)
            .Trim('(', ')');

        var seismicity = GetParameter(doc, "Seismicity");
        var sulfur = GetParameter(doc, "Sulfur Dioxide Flux");

        return new PhivolcsVolcanoBulletinResponse(
            ExternalId: $"{volcanoCode}-{bulletinDate:yyyy-MM-dd}",
            VolcanoCode: volcanoCode,
            BulletinDate: bulletinDate,
            AlertLevel: alertLevel,
            AlertDescription: status,
            VolcanicEarthquakeCount: LeadingInt(seismicity),
            Seismicity: seismicity,
            SulfurDioxideTonnesPerDay: LeadingNumber(sulfur),
            Plume: GetParameter(doc, "Plume"),
            GroundDeformation: GetParameter(doc, "Ground Deformation"),
            SourceUrl: sourceUrl);
    }

    private static string? GetParameter(HtmlDocument doc, string label)
    {
        var row = doc.DocumentNode.SelectSingleNode(
            $"//tr[td//b[normalize-space()='{label}']]");

        var cells = row?.SelectNodes("td");

        return cells is { Count: > 1 }
            ? CleanText(cells[1].InnerText)
            : null;
    }

    private static string CleanText(string raw) =>
        Regex.Replace(HtmlEntity.DeEntitize(raw), @"\s+", " ").Trim();

    private static int? LeadingInt(string? text)
    {
        var match = Regex.Match(text ?? string.Empty, @"^\d+");
        return match.Success ? int.Parse(match.Value) : null;
    }

    private static double? LeadingNumber(string? text)
    {
        var match = Regex.Match(text ?? string.Empty, @"^[\d,]+(\.\d+)?");
        return match.Success
            ? double.Parse(
                match.Value.Replace(",", ""),
                CultureInfo.InvariantCulture)
            : null;
    }

}