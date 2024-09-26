using Application.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Application.Controllers
{
    [Route("api/legalconcepts")]
    [ApiController]
    public class LegalConceptsController : ControllerBase
    {
        private readonly DAPContext _context;

        public LegalConceptsController(DAPContext context)
        {
            _context = context;
        }

        // GET: api/legalconcepts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LegalConcept>>> GetLegalConcepts()
        {
            return await _context.LegalConcepts.ToListAsync();
        }

        // GET: api/legalconcepts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LegalConcept>> GetLegalConcept(int id)
        {
            var legalConcept = await _context.LegalConcepts.FindAsync(id);

            if (legalConcept == null)
            {
                return NotFound();
            }

            return legalConcept;
        }

        // POST: api/legalconcepts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LegalConcept>> PostLegalConcept(LegalConcept legalConcept)
        {
            _context.LegalConcepts.Add(legalConcept);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLegalConcept", new { id = legalConcept.Id }, legalConcept);
        }

        // PUT: api/legalconcepts/{id}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLegalConcept(int id, LegalConcept legalConcept)
        {
            if (id != legalConcept.Id)
            {
                return BadRequest();
            }

            _context.Entry(legalConcept).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LegalConceptExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/legalconcepts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLegalConcept(int id)
        {
            var legalConcept = await _context.LegalConcepts.FindAsync(id);
            if (legalConcept == null)
            {
                return NotFound();
            }

            _context.LegalConcepts.Remove(legalConcept);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Private function to check if target legal concept exists.
        private bool LegalConceptExists(int id)
        {
            return _context.LegalConcepts.Any(e => e.Id == id);
        }
    }
}