using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Models;
using Dapper;

namespace SchoolPlatformWebApplication.Repo
{
    public class ClassRepo : IClassRepo
    {
        private readonly DapperDBContext context;
        public ClassRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<List<Class>> GetAllClasses()
        {
            string query = "SELECT * FROM [dbo].[Class]";
            using (var connection = this.context.CreateConnection())
            {
                var classesList = await connection.QueryAsync<Class>(query);
                return classesList.ToList();
            }
        }

        public async Task<int> GetClassIdByCode(string code)
        {
            string query = "SELECT Id FROM [dbo].[Class] where Code = @Code";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Code = code,
                };

                var classId = await connection.ExecuteScalarAsync<int>(query, parameters);
                return classId;
            }
        }

        public async Task<int> InsertClass(Class newClass)
        {
            string query = "INSERT INTO [dbo].[Class] (Code, Description) OUTPUT INSERTED.Id VALUES (@Code, @Description)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Code = newClass.Code,
                    Description = newClass.Description
                };
                // Utilizați ExecuteScalarAsync pentru a obține ID-ul inserat
                var newClassId = await connection.ExecuteScalarAsync<int>(query, parameters);
                return newClassId;
            }
        }
    }
}
