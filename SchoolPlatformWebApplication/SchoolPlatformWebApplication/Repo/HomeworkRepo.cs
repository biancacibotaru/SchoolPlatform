using Dapper;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Models.Data;
using System.Globalization;

namespace SchoolPlatformWebApplication.Repo
{
    public class HomeworkRepo : IHomeworkRepo
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
            string query = "INSERT INTO [StudentHomework] (StudentId, HomeworkId, SubmitDate, FileContentId) OUTPUT INSERTED.Id VALUES (@StudentId, @HomeworkId, @SubmitDate, @FileContentId);";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = homework.StudentId,
                    HomeworkId = homework.HomeworkId,
                    SubmitDate = homework.SubmitDate,
                    FileContentId = homework.FileContentId
                };

                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }

        public async Task<List<object>> GetHomeworksBySubject(int id)
        {
            string query = "SELECT [Homework].Id, Title, Description, StartDate, Deadline, FileName, Content FROM [Homework] full outer join [dbo].[FileContent] on [Homework].[FileContentId] = [dbo].[FileContent].[Id]  where [SubjectId] = @SubjectId order by [Homework].[Id] desc";

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

        public async Task<List<object>> GetHomeworksForStudentBySubject(int subjectId, int studentId)
        {
            string query = "SELECT [Homework].Id AS HomeworkId, [Homework].Title, [Homework].Description, [Homework].Deadline, [Homework].StartDate, HomeworkFile.Content as HomeworkFileContent, HomeworkFile.FileName as HomeworkFileName, StudentHomework.SubmitDate, [StudentHomework].Comments, StudentHomework.Grade, StudentHomeworkFile.FileName as StudentHomeworkFileName, StudentHomeworkFile.Content as StudentHomeworkFileContent FROM [Homework] LEFT OUTER JOIN [dbo].[FileContent] AS HomeworkFile ON [Homework].[FileContentId] = HomeworkFile.[Id] LEFT OUTER JOIN [StudentHomework] ON [Homework].[Id] = [StudentHomework].[HomeworkId] AND [StudentHomework].[StudentId] = @StudentId LEFT OUTER JOIN [dbo].[FileContent] AS StudentHomeworkFile ON [StudentHomework].[FileContentId] = StudentHomeworkFile.[Id] WHERE ([SubjectId] = @SubjectId) ORDER BY [Homework].[Id] DESC;";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = subjectId,
                    StudentId = studentId
                };
                var response = await connection.QueryAsync<object>(query, parameters);
                return response.ToList();
            }
        }

        public async Task<List<object>> GetStudentsHomework(int id)
        {
            string query = "SELECT StudentHomework.[Id],[HomeworkId],[SubmitDate],[Grade], [StudentId], [FirstName], [LastName], [Email], [Homework].SubjectId, FileContent.Content, FileContent.FileName FROM [StudentHomework] inner join [User] on StudentHomework.StudentId = [User].Id inner join [FileContent] on StudentHomework.FileContentId = FileContent.Id inner join Homework on Homework.Id = StudentHomework.HomeworkId where HomeworkId = @HomeworkId";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    HomeworkId = id
                };
                var response = await connection.QueryAsync<object>(query, parameters);
                return response.ToList();
            }
        }

        public async Task<bool> UpdateGradeForHomework(int id, float grade)
        {
            string query = "UPDATE [StudentHomework] SET Grade = @Grade WHERE Id = @Id";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Id = id,
                    Grade = grade
                };

                try
                {
                    await connection.ExecuteAsync(query, parameters);

                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<List<Homework>> GetFutureHomeworksByClass(string classCode, int studentId)
        {
            List<Homework> homeworks = new List<Homework>();
            List<Homework> futureHomeworks = new List<Homework>();

            string query = @"SELECT DISTINCT Homework.Id, Subject.Name as Description, Title, StartDate, Deadline FROM [Homework] INNER JOIN Subject ON Homework.SubjectId = Subject.Id INNER JOIN Class ON Class.Id = Subject.ClassId LEFT JOIN StudentHomework ON StudentHomework.HomeworkId = Homework.Id AND StudentHomework.StudentId = @StudentId WHERE Class.Code = @ClassCode AND StudentHomework.Id IS NULL;";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ClassCode = classCode,
                    StudentId = studentId
                };

                var response = await connection.QueryAsync<Homework>(query, parameters);

                homeworks = response.ToList();

                string dateFormat = "M/d/yyyy h:mm:ss tt";

                foreach (var homework in homeworks)
                {
                    if (DateTime.TryParseExact(homework.Deadline, dateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dateTime))
                    {
                        if (dateTime > DateTime.Now)
                        {
                            futureHomeworks.Add(homework);
                        }
                    }
                }
            }

            return futureHomeworks;
        }

        public async Task<bool> CheckIfFutureHomeworksByClass(string classCode, int studentId)
        {
            var futureHomeworks = await this.GetFutureHomeworksByClass(classCode, studentId);
            if (futureHomeworks.Count > 0)
            {
                return true;
            }

            return false;
        }
    }
}
