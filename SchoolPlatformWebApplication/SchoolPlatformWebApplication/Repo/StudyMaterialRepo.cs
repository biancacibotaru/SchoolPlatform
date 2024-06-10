using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Models;
using Dapper;

namespace SchoolPlatformWebApplication.Repo
{
    public class StudyMaterialRepo: IStudyMaterialRepo
    {
        private readonly DapperDBContext context;
        public StudyMaterialRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<int> InsertStudyMaterial(StudyMaterial material)
        {
            string query = "INSERT INTO [dbo].[StudyMaterial] (SubjectId, Title, Description, FileContentId, CreatedOn) VALUES (@SubjectId, @Title, @Description, @FileContentId, @CreatedOn)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = material.SubjectId,
                    Title = material.Title,
                    Description = material.Description,
                    FileContentId = material.FileContentId,
                    CreatedOn = DateTime.Now.ToString("dd-MM-yyyy")
            };
                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }

        public async Task<List<Object>> GetAllMaterialsForSubject(int id)
        {
            string query = "SELECT [Title], [Description], [CreatedOn], [FileName], [Content] AS FileContent FROM [dbo].[StudyMaterial] Inner join [dbo].[FileContent] on [dbo].[StudyMaterial].[FileContentId] = [dbo].[FileContent].[Id] where [SubjectId] = @SubjectId order by [dbo].[StudyMaterial].[Id] desc";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = id
                };
                var materials = await connection.QueryAsync<object>(query, parameters);
                
                return materials.ToList();
            }
        }
    }
}
