namespace SchoolPlatformWebApplication.Models
{
    public class StudentHomework
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int HomeworkId { get; set; }
        public string SubmitDate { get; set; }
        public int Grade { get; set; }
        public string Comments { get; set; }
    }
}
