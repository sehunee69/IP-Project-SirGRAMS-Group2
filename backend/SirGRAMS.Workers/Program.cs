using SirGRAMS.Domain.Entities;
using SirGRAMS.Infrastructure;
using SirGRAMS.Infrastructure.ExternalServices.Phivolcs;
using SirGRAMS.Workers;
using SirGRAMS.Workers.Earthquake;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddInfrastructure(
    builder.Configuration);

var useFakePhivolcs =
    builder.Configuration.GetValue<bool>(
        "UseFakePhivolcs");

Console.WriteLine(
    $"UseFakePhivolcs = {useFakePhivolcs}");

if (useFakePhivolcs)
{
    builder.Services.AddSingleton<
        IPhivolcsEarthquakeClient,
        FakePhivolcsEarthquakeClient>();
}
else
{
    builder.Services.AddHttpClient<
        IPhivolcsEarthquakeClient,
        PhivolcsEarthquakeClient>(client =>
        {
            client.BaseAddress = new Uri(
                "https://earthquake.phivolcs.dost.gov.ph/");
        })
        .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
        {
            AutomaticDecompression = System.Net.DecompressionMethods.All
        });
}

builder.Services.AddHostedService<Worker>();
builder.Services.AddHostedService<EarthquakePollingWorker>();

var host = builder.Build();

await host.RunAsync();
