using Microsoft.EntityFrameworkCore;

namespace Application.Models
{
    public class DAPContext : DbContext
    {
        public DAPContext(DbContextOptions<DAPContext> options) : base(options)
        {
        }

        public DbSet<LegalConcept> LegalConcepts { get; set; } = null!;
        public DbSet<Scenario> Scenarios { get; set; } = null!;
    }
}