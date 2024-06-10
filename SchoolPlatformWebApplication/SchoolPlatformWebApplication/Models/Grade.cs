namespace SchoolPlatformWebApplication.Models
{
    public class Grade
    {
        public int Id { get; set; }
        public float Points { get; set; }
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public int? ExamId { get; set; }
        public int? HomeworkId { get; set; }
        public string GradeFor { get; set; }
        public string GradeDate { get; set; }
    }
}
