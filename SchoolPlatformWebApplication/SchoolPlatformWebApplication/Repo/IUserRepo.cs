using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IUserRepo
    {
        Task<List<User>> GetAllStudents();
        Task<List<User>> GetAllTeachers();
        Task<List<User>> GetAllNonLiders();
        Task<User> GetUserByEmailAndPassword(string email, string password);
        Task<User> GetUserById(int email);
        Task<User> GetUserByEmail(string email);
        Task<int> InsertUser(User user);
    }
}
