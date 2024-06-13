using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IExamRepo
    {
        Task<int> InsertExam(Exam exam);
        Task<int> UpdateExam(Exam exam);
        Task<List<Exam>> GetAllExamsBySubject(int subjectId);
        Task<List<Exam>> GetAllExamsBySubjectForStudent(int subjectId);
        Task<Exam> GetExam(int id);
        Task<int> InsertStudentExam(StudentExam studentExam);
        Task SetTotalPoints(StudentExam studentExam, float totalPoints);
        Task InsertStudentAnswer(StudentAnswer studentAnswer);
        Task<Question> GetQuestionById(int questionId);
        Task<Question> GetQuestionByIdAndExam(int questionId, int examId);
        Task<List<StudentAnswer>> GetStudentExam(int examId, int studentId);
        Task<StudentExam> GetStudentExamStatus(int examId, int studentId);
        Task<List<AnswersAndStudentAnswers>> GetStudentExamResults(int examId, int studentId);
        Task<int> GetSubjectIdByExam(int examId);
    }
}
