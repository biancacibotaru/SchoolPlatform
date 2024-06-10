using Dapper;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Models.Data;

namespace SchoolPlatformWebApplication.Repo
{
    public class HomeworkRepo: IHomeworkRepo
    {
        private readonly DapperDBContext context;
        public HomeworkRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<int> InsertHomework(Homework homework)
        {
            string query = "INSERT INTO [Homework] (Title, Description, StartDate, Deadline, SubjectId, FileContentId) OUTPUT INSERTED.Id VALUES (@Title, @Description, @StartDate, @Deadline, @SubjectId, @FileContentId);";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Title = homework.Title,
                    Description = homework.Description,
                    StartDate = homework.StartDate,
                    Deadline = homework.Deadline,
                    SubjectId = homework.SubjectId,
                    FileContentId = homework.FileContentId,
                };

                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }

        public async Task<int> InsertStudentHomework(StudentHomework homework)
        {
            string query = "INSERT INTO [StudentHomework] (StudentId, HomeworkId, SubmitDate, FileContentId) OUTPUT INSERTED.Id VALUES (@Title, @Description, @StartDate, @Deadline, @SubjectId, @FileContentId);";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = homework.StudentId,
                    HomeworkId = homework.HomeworkId,
                    SubmitDate = homework.SubmitDate
                };

                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }

        public async Task<List<object>> GetHomeworksBySubject(int id)
        {
            string query = "SELECT Title, Description, StartDate, Deadline, FileName, Content FROM [Homework] full outer join [dbo].[FileContent] on [Homework].[FileContentId] = [dbo].[FileContent].[Id]  where [SubjectId] = @SubjectId";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = id
                };
                var response = await connection.QueryAsync<object>(query, parameters);
                return response.ToList();
            }
        }
    }
}
