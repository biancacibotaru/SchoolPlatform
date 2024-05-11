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

        public async Task<User> GetUserByEmailAndPassword(string email, string password)
        {
            string query = "SELECT * FROM [dbo].[User] WHERE Email = @Email AND HashedPassword = @Password";
            using (var connection = this.context.CreateConnection())
            {
                var user = await connection.QueryFirstOrDefaultAsync<User>(query, new { Email = email, Password = PasswordHelper.HashPassword(password) });
                return user;
            }
        }

        public async Task<User> GetUserByEmail(string email)
        {
            string query = "SELECT * FROM [dbo].[User] WHERE Email = @Email";
            using (var connection = this.context.CreateConnection())
            {
                var user = await connection.QuerySingleOrDefaultAsync<User>(query, new { Email = email });
                return user;
            }
        }

        public async Task<int> InsertUser(User user)
        {
            string hashedPassword = PasswordHelper.HashPassword(user.Password);

            string query = "INSERT INTO [dbo].[User] (Email, HashedPassword, Firstname, Lastname, Type) VALUES (@Email, @HashedPassword, @Firstname, @Lastname, @Type)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Email = user.Email,
                    HashedPassword = hashedPassword,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Type = user.Type
                };
                var rowsAffected = await connection.ExecuteAsync(query, parameters);
                return rowsAffected;
            }
        }
    }
}
