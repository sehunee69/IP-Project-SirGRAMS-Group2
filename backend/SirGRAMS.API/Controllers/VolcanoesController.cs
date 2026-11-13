using MediatR;
using Microsoft.AspNetCore.Mvc;
using SirGRAMS.Application.Features.Volcanoes.Queries.GetVolcanoStatuses;

namespace SirGRAMS.API.Controllers;

[ApiController]
[Route("api/volcanoes")]
public sealed class VolcanoesController : ControllerBase
{
    private readonly ISender _mediator;

    public VolcanoesController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetStatuses(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetVolcanoStatusesQuery(),
            cancellationToken);

        return Ok(result);
    }
}