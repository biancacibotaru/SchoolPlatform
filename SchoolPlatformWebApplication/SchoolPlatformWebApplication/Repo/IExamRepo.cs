using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IExamRepo
    {
        Task<int> InsertExam(Exam exam);
        Task<List<Exam>> GetAllExamsBySubject(int subjectId);
        Task<Exam> GetExam(int id);
        Task<int> InsertStudentExam(StudentExam studentExam);
        Task SetTotalPoints(StudentExam studentExam, float totalPoints);
        Task InsertStudentAnswer(StudentAnswer studentAnswer);
        Task<Question> GetQuestionById(int questionId);
        Task<List<StudentAnswer>> GetStudentExam(int examId, int studentId);
        Task<List<AnswersAndStudentAnswers>> GetStudentExamResults(int examId, int studentId);
    }
}
