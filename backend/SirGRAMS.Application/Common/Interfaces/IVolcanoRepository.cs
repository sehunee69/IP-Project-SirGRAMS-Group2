using SirGRAMS.Domain.Entities;

namespace SirGRAMS.Application.Common.Interfaces;

public interface IVolcanoRepository
{
    Task<Volcano?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken);

    Task<bool> BulletinExistsAsync(
        string externalId,
        CancellationToken cancellationToken);

    Task AddBulletinAsync(
        VolcanoBulletin bulletin,
        CancellationToken cancellationToken);
}