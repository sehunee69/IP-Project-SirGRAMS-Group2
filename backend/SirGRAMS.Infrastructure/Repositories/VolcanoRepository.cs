using Microsoft.EntityFrameworkCore;
using SirGRAMS.Application.Common.Interfaces;
using SirGRAMS.Domain.Entities;
using SirGRAMS.Infrastructure.Persistence.Context;

namespace SirGRAMS.Infrastructure.Repositories;

public sealed class VolcanoRepository : IVolcanoRepository
{
    private readonly AppDbContext _dbContext;

    public VolcanoRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Volcano?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken)
    {
        return await _dbContext.Volcanoes
            .FirstOrDefaultAsync(
                v => v.Code == code,
                cancellationToken);
    }

    public async Task<bool> BulletinExistsAsync(
        string externalId,
        CancellationToken cancellationToken)
    {
        return await _dbContext.VolcanoBulletins
            .AnyAsync(
                b => b.ExternalId == externalId,
                cancellationToken);
    }

    public async Task AddBulletinAsync(
        VolcanoBulletin bulletin,
        CancellationToken cancellationToken)
    {
        await _dbContext.VolcanoBulletins.AddAsync(
            bulletin,
            cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<(Volcano Volcano, VolcanoBulletin? LatestBulletin)>>
        GetAllWithLatestBulletinAsync(
            CancellationToken cancellationToken)
    {
        var volcanoes = await _dbContext.Volcanoes
            .AsNoTracking()
            .OrderBy(v => v.Name)
            .ToListAsync(cancellationToken);

        var latestBulletins = await _dbContext.VolcanoBulletins
            .AsNoTracking()
            .Where(b => b.BulletinDate == _dbContext.VolcanoBulletins
                .Where(other => other.VolcanoId == b.VolcanoId)
                .Max(other => other.BulletinDate))
            .ToListAsync(cancellationToken);

        var byVolcano = latestBulletins
            .GroupBy(b => b.VolcanoId)
            .ToDictionary(g => g.Key, g => g.First());

        return volcanoes
            .Select(v => (v, byVolcano.GetValueOrDefault(v.Id)))
            .ToList();
    }
}