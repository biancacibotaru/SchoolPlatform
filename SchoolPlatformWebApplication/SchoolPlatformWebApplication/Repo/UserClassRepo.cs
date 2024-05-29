using Azure.Core.GeoJson;
using Dapper;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Models.Data;

namespace SchoolPlatformWebApplication.Repo
{
    public class UserClassRepo: IUserClassRepo
    {
        private readonly DapperDBContext context;
        public UserClassRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<List<UserClass>> GetAllUserClasses()
        {
            string query = "SELECT * FROM [dbo].[UserClass]";
            using (var connection = this.context.CreateConnection())
            {
                var userList = await connection.QueryAsync<UserClass>(query);
                return userList.ToList();
            }
        }

        public async Task<int> InsertUserClass(UserClass newObject)
        {
            string query = "INSERT INTO [dbo].[UserClass] (ClassId, UserId, Role) VALUES (@ClassId, @UserId, @Role)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ClassId = newObject.ClassId, 
                    UserId = newObject.UserId,
                    Role = newObject.Role
                };
                var rowsAffected = await connection.ExecuteAsync(query, parameters);
                return rowsAffected;
            }
        }

        public async Task<List<object>> GetAllClassesWithLeaders()
        {
            string query = "SELECT [Class].[Id] as Id, [Class].[Code] as Code, [User].[Firstname] as TeacherFirstname, [User].[Lastname] as TeacherLastname," +
                "[User].[Email] as TeacherEmail  FROM [dbo].[UserClass]" +
                "inner join [User] on [dbo].[UserClass].[UserId] = [dbo].[User].[Id] " +
                "inner join [Class] on [dbo].[UserClass].[ClassId] = [dbo].[Class].[Id]  " +
                "where [Role] = 'leader'";

            using (var connection = this.context.CreateConnection())
            {
                var userList = await connection.QueryAsync<object>(query);
                return userList.ToList();
            }
        }

        public async Task<List<object>> GetStudentsByClass(int classId)
        {
            string query = "SELECT [User].[Id] as Id, [Code] as ClassCode,  [User].[Firstname] as StudentFirstname, [User].[Lastname] as StudentLastname," +
                "[User].[Email] as StudentEmail  FROM [dbo].[UserClass]" +
                "inner join [User] on [dbo].[UserClass].[UserId] = [dbo].[User].[Id]" +
                "inner join [Class] on [dbo].[UserClass].[ClassId] = [dbo].[Class].[Id]" +
                "where [ClassId] = @ClassId and [Role] = 'member'" +
                "order by [User].[Firstname]";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ClassId = classId
                };
                var userList = await connection.QueryAsync<object>(query, parameters);
                return userList.ToList();
            }
        }

        public async Task<string> GetStudentClass(int userId)
        {
            string query = "SELECT [Code] FROM [dbo].[UserClass]" +
                "inner join [Class] on [dbo].[UserClass].[ClassId] = [dbo].[Class].[Id]" +
                "where [UserId] = @UserId";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    UserId = userId
                };
                var userClass = await connection.QueryFirstOrDefaultAsync<string>(query, parameters);
                return userClass;
            }
        }
    }
}
