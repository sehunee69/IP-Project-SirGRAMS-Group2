using MediatR;
using SirGRAMS.Application.Features.Earthquakes.DTOs;

namespace SirGRAMS.Application.Features.Earthquakes.Queries.GetRecentEarthquakes;

public sealed record GetRecentEarthquakesQuery(
    int Limit
) : IRequest<List<EarthquakeDto>>;