using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IHomeworkRepo
    {
        Task<List<object>> GetHomeworksBySubject(int id);
        Task<List<object>> GetHomeworksForStudentBySubject(int subjectId, int studentId);
        Task<List<object>> GetStudentsHomework(int id);
        Task<int> InsertHomework(Homework homework);
        Task<int> InsertStudentHomework(StudentHomework homework);
        Task<bool> UpdateGradeForHomework(int id, float grade);
    }
}
