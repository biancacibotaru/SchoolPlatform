using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IUserClassRepo
    {
        Task<List<UserClass>> GetAllUserClasses();
        Task<int> InsertUserClass(UserClass userClass);
        Task<List<object>> GetAllClassesWithLeaders();
        Task<List<object>> GetStudentsByClass(int classId);
        Task<string> GetStudentClass(int userId);
    }
}
