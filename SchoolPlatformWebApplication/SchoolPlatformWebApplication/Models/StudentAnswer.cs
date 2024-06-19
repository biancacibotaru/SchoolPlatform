namespace SchoolPlatformWebApplication.Models
{
    public class StudentAnswer
    {
        public int Id { get; set; }
        public int StudentExamId { get; set; }
        public int QuestionId { get; set; }
        public string Answers { get; set; } 
        public float PointsPerQuestion { get; set; }
    }

    public class AnswersAndStudentAnswers
    {
        public int QuestionId { get; set; }
        public List<string> Answers { get; set; }
        public List<string> StudentAnswers { get; set; }
        public float StudentPoints { get; set; }
    }
}