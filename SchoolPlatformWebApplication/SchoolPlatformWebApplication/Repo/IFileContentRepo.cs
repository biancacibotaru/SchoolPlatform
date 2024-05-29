using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IFileContentRepo
    {
        Task<int> InsertFileContent(FileContent file);
    }
}
