using MediatR;
using SirGRAMS.Application.Features.Volcanoes.DTOs;

namespace SirGRAMS.Application.Features.Volcanoes.Queries.GetVolcanoStatuses;

public sealed record GetVolcanoStatusesQuery
    : IRequest<List<VolcanoDto>>;