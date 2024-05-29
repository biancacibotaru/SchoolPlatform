namespace SchoolPlatformWebApplication.Models
{
    public class StudyMaterial
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int SubjectId { get; set; }
        public int FileContentId { get; set; }
        public string CreatedOn { get; set; }
    }
}
