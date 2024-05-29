using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IHomeworkRepo
    {
        Task<int> InsertHomework(Homework homework);
    }
}
