using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface ISubjectRepo
    {
        Task<List<Object>> GetAllSubjectsByClass(int id);
        Task<List<Object>> GetAllSubjectsByTeacher(int id);
        Task<int> InsertSubject(Subject subject);
    }
}
