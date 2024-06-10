using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IGradeRepo
    {
        Task<int> InsertGrade(Grade newGrade);
    }
}
