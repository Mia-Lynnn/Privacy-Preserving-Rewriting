namespace Application.Models
{
    public class LegalConcept
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? RelatedTopic { get; set; }

        public string? RelatedSection { get; set; }

        public string? Other { get; set; }
    }
}