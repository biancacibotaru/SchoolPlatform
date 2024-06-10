using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IHomeworkRepo
    {
        Task<List<object>> GetHomeworksBySubject(int id);
        Task<int> InsertHomework(Homework homework);
        Task<int> InsertStudentHomework(StudentHomework homework);
    }
}
