namespace SchoolPlatformWebApplication.Models
{
    public class Homework
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string StartDate { get; set; }
        public string Deadline { get; set; }
        public int SubjectId { get; set; }
        public int? FileContentId { get; set; }
    }
}
