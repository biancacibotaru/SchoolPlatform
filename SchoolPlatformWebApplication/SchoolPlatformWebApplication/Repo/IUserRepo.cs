using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IUserRepo
    {
        Task<List<User>> GetAll();
    }
}
