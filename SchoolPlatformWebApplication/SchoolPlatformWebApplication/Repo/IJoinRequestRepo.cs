using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IJoinRequestRepo
    {
        Task<int> InsertJoinRequest(JoinRequest request);
        Task<JoinRequest> GetJoinRequestForStudent(int id);
        Task<JoinRequest> UpdateJoinRequestForStudent(int id, string status);
        Task<List<object>> GetJoinRequests();
    }
}
