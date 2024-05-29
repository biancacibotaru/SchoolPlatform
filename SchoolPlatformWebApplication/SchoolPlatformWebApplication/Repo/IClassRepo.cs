using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IClassRepo
    {
        Task<List<Class>> GetAllClasses();
        Task<int> GetClassIdByCode(string code);
        Task<int> InsertClass(Class newClass);
    }
}
