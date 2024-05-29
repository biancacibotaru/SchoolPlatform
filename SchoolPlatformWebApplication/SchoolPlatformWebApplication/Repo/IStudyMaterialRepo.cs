using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IStudyMaterialRepo
    {
        Task<int> InsertStudyMaterial(StudyMaterial material);
        Task<List<Object>> GetAllMaterialsForSubject(int id);
    }
}
