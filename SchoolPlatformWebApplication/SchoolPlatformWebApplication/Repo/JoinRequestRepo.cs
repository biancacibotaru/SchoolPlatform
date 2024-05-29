using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Models;
using Dapper;

namespace SchoolPlatformWebApplication.Repo
{
    public class JoinRequestRepo: IJoinRequestRepo
    {
        private readonly DapperDBContext context;
        public JoinRequestRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<int> InsertJoinRequest(JoinRequest request)
        {
            string query = "INSERT INTO [dbo].[JoinRequest] (StudentId, ClassId, FileContentId, Status) VALUES (@StudentId, @ClassId, @FileContentId, @Status)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = request.StudentId,
                    ClassId = request.ClassId,
                    FileContentId= request.FileContentId,
                    Status = "in check"
                    
                };
                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }

        public async Task<JoinRequest> GetJoinRequestForStudent(int id)
        {
            string query = "SELECT * FROM [dbo].[JoinRequest] where [StudentId] = @StudentId";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = id
                };
                var response = await connection.QueryFirstOrDefaultAsync<JoinRequest>(query, parameters);
                return response;
            }
        }

        public async Task<JoinRequest> UpdateJoinRequestForStudent(int id, string status)
        {
            string query = "UPDATE [dbo].[JoinRequest] SET [Status] = @Status where [StudentId] = @StudentId";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = id,
                    Status = status
                };
                var response = await connection.QueryFirstOrDefaultAsync<JoinRequest>(query, parameters);
                return response;
            }
        }

        public async Task<List<object>> GetJoinRequests()
        {
            string query = "SELECT [dbo].[JoinRequest].[StudentId], Firstname, Lastname, Code, FileName, Content FROM [dbo].[JoinRequest] inner join [dbo].[User] on [dbo].[JoinRequest].[StudentId] = [dbo].[User].[Id] inner join [dbo].[Class] on [dbo].[JoinRequest].[ClassId] = [dbo].[Class].[Id] inner join [dbo].[FileContent] on [dbo].[JoinRequest].[FileContentId] = [dbo].[FileContent].[Id]  where [Status] = @Status";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Status = "in check"
                };
                var response = await connection.QueryAsync<object>(query, parameters);
                return response.ToList();
            }
        }
    }
}
