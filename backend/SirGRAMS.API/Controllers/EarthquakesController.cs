using MediatR;
using Microsoft.AspNetCore.Mvc;
using SirGRAMS.Application.Features.Earthquakes.Queries.GetRecentEarthquakes;

namespace SirGRAMS.API.Controllers;

[ApiController]
[Route("api/earthquakes")]
public sealed class EarthquakesController : ControllerBase
{
    private readonly ISender _mediator;

    public EarthquakesController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetRecent(
        [FromQuery] int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(
            new GetRecentEarthquakesQuery(
                Math.Clamp(limit, 1, 100)),
            cancellationToken);

        return Ok(result);
    }
}