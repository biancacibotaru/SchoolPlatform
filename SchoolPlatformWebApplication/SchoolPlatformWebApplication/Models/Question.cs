using System.Text.Json.Serialization;

namespace SchoolPlatformWebApplication.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public string Text { get; set; }
        public float Points{ get; set; }
        public string Answers{ get; set; }
    }

    public class QuestionDetails
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public float Points { get; set; }
        public List<AnswerDetails> Answers { get; set; }
    }

    public class AnswerDetails
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}
