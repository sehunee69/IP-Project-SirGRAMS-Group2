using SirGRAMS.Infrastructure.ExternalServices.Phivolcs.Models;

namespace SirGRAMS.Infrastructure.ExternalServices.Phivolcs;

public interface IPhivolcsVolcanoClient
{
    Task<IReadOnlyList<PhivolcsVolcanoBulletinResponse>>
        GetLatestBulletinsAsync(CancellationToken cancellationToken);
}