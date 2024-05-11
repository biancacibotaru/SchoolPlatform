using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IUserRepo
    {
        Task<List<User>> GetAll();
        Task<User> GetUserByEmailAndPassword(string email, string password);
        Task<User> GetUserByEmail(string email);
        Task<int> InsertUser(User user);
    }
}
