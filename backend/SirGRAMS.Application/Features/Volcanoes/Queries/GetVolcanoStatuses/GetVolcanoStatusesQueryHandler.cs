using MediatR;
using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Application.Features.Volcanoes.DTOs;

namespace SirGRAMS.Application.Features.Volcanoes.Queries.GetVolcanoStatuses;

public sealed class GetVolcanoStatusesQueryHandler
    : IRequestHandler<GetVolcanoStatusesQuery, List<VolcanoDto>>
{
    private readonly IVolcanoRepository _volcanoRepository;

    public GetVolcanoStatusesQueryHandler(
        IVolcanoRepository volcanoRepository)
    {
        _volcanoRepository = volcanoRepository;
    }

    public async Task<List<VolcanoDto>> Handle(
        GetVolcanoStatusesQuery request,
        CancellationToken cancellationToken)
    {
        var volcanoes =
            await _volcanoRepository.GetAllWithLatestBulletinAsync(
                cancellationToken);

        return volcanoes
            .Select(x => new VolcanoDto(
                x.Volcano.Id,
                x.Volcano.Code,
                x.Volcano.Name,
                x.Volcano.Latitude,
                x.Volcano.Longitude,
                x.Volcano.Province,
                x.LatestBulletin is null
                    ? null
                    : new VolcanoBulletinDto(
                        x.LatestBulletin.BulletinDate,
                        x.LatestBulletin.AlertLevel,
                        x.LatestBulletin.AlertDescription,
                        x.LatestBulletin.VolcanicEarthquakeCount,
                        x.LatestBulletin.SulfurDioxideTonnesPerDay,
                        x.LatestBulletin.Plume,
                        x.LatestBulletin.GroundDeformation,
                        x.LatestBulletin.SourceUrl)))
            .ToList();
    }
}