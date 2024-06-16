namespace SchoolPlatformWebApplication.Models
{
    public class StudentExam
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int ExamId { get; set; }
        public int TotalPoints { get; set; }
        public string Status { get; set; }  
        public string StartedOn { get; set; }  
        public string FinishedOn { get; set; }  
    }

    public class StudentResponse
    {
        public int StudentId { get; set; }
        public int ExamId { get; set; }
        public List<QuestionResponse> Responses { get; set; }
    }

    public class QuestionResponse
    {
        public int QuestionId { get; set; }
        public List<string> Answers{ get; set; }
    }

    public class ExamResult
    {
        public int UserId { get; set; }
        public int ExamId { get; set; }
        public float? TotalPoints { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
    }
}
