using Dapper;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Models.Data;

namespace SchoolPlatformWebApplication.Repo
{
    public class SubjectRepo : ISubjectRepo
    {
        private readonly DapperDBContext context;
        public SubjectRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<List<object>> GetAllSubjectsByClass(int id)
        {
            string query = "SELECT [Subject].[Id] as SubjectId, [Subject].[Name] as Name, [Subject].[HoursPerWeek] as HoursPerWeek, [User].[Firstname] as TeacherFirstname, " +
                "[User].[Lastname] as TeacherLastname, [Class].[Code] as Class FROM [Subject]" +
                "inner join [User] on [dbo].[Subject].[TeacherId] = [dbo].[User].[Id]" +
                "inner join [Class] on [dbo].[Subject].[ClassId] = [dbo].[Class].[Id]" +
                "where [Subject].[ClassId] = @Id";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Id = id
                };
                var subjectList = await connection.QueryAsync<object>(query, parameters);
                return subjectList.ToList();
            }
        }

        public async Task<List<object>> GetAllSubjectsByTeacher(int teacherId)
        {
            string query = "SELECT [Subject].[Id] as SubjectId, [Subject].[Name] as Name, [Subject].[HoursPerWeek] as HoursPerWeek, [User].[Firstname] as TeacherFirstname, " +
                "[User].[Lastname] as TeacherLastname, [Class].[Code] as Class FROM [Subject]" +
                "inner join [User] on [dbo].[Subject].[TeacherId] = [dbo].[User].[Id]" +
                "inner join [Class] on [dbo].[Subject].[ClassId] = [dbo].[Class].[Id]" +
                "where [Subject].[TeacherId] = @Id";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Id = teacherId
                };
                var subjectList = await connection.QueryAsync<object>(query, parameters);
                return subjectList.ToList();
            }
        }

        public async Task<int> InsertSubject(Subject subject)
        {
            string query = "INSERT INTO [dbo].[Subject] (Name, ClassId, TeacherId, HoursPerWeek) VALUES (@Name, @ClassId, @TeacherId, @HoursPerWeek)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Name = subject.Name,
                    ClassId = subject.ClassId,
                    TeacherId = subject.TeacherId,
                    HoursPerWeek = subject.HoursPerWeek
                };
                var rowsAffected = await connection.ExecuteAsync(query, parameters);
                return rowsAffected;
            }
        }
    }
}
