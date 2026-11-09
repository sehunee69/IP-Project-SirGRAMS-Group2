using MediatR;
using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Application.Features.Earthquakes.DTOs;

namespace SirGRAMS.Application.Features.Earthquakes.Queries.GetRecentEarthquakes;

public sealed class GetRecentEarthquakesQueryHandler
    : IRequestHandler<GetRecentEarthquakesQuery, List<EarthquakeDto>>
{
    private readonly IEarthquakeRepository _earthquakeRepository;

    public GetRecentEarthquakesQueryHandler(
        IEarthquakeRepository earthquakeRepository)
    {
        _earthquakeRepository = earthquakeRepository;
    }

    public async Task<List<EarthquakeDto>> Handle(
        GetRecentEarthquakesQuery request,
        CancellationToken cancellationToken)
    {
        var earthquakes = await _earthquakeRepository.GetRecentAsync( // GetRecentAsync method defined within the repository implementation
            request.Limit,
            cancellationToken);

        return earthquakes
            .Select(e => new EarthquakeDto(
                e.Id,
                e.Magnitude,
                e.DepthKm,
                e.Latitude,
                e.Longitude,
                e.LocationDescription,
                e.OccurredAt))
            .ToList();
    }
}