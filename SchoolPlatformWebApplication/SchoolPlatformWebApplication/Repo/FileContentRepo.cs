using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Models;
using Dapper;

namespace SchoolPlatformWebApplication.Repo
{
    public class FileContentRepo : IFileContentRepo
    {
        private readonly DapperDBContext context;
        public FileContentRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<int> InsertFileContent(FileContent file)
        {
            string query = "INSERT INTO [dbo].[FileContent] (FileName, Content, Scope) OUTPUT INSERTED.ID VALUES (@FileName, @Content, @Scope)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    FileName = file.FileName,
                    Content = file.Content,
                    Scope = file.Scope,
                };
                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }
    }
}
