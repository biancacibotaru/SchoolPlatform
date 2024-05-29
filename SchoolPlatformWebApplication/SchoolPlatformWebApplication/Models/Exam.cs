namespace SchoolPlatformWebApplication.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public string StartedOn { get; set; }
        public string ClosedOn { get; set; }
        public List<QuestionDetails> Questions { get; set; }
    }
}
