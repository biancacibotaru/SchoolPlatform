using Dapper;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Models.Data;

namespace SchoolPlatformWebApplication.Repo
{
    public class UserRepo : IUserRepo
    {
        private readonly DapperDBContext context;
        public UserRepo(DapperDBContext context)
        {
            this.context = context;
        }
        public async Task<List<User>> GetAll()
        {
            string query = "SELECT * FROM [dbo].[User]";
            using(var connection = this.context.CreateConnection())
            {
                var userList = await connection.QueryAsync<User>(query);
                return userList.ToList();
            }
        }
    }
}
