using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Models;
using Dapper;

namespace SchoolPlatformWebApplication.Repo
{
    public class GradeRepo: IGradeRepo
    {
        private readonly DapperDBContext context;
        public GradeRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<int> InsertGrade(Grade grade)
        {
            string query = "INSERT INTO [Grade] (Points, StudentId, SubjectId, ExamId, HomeworkId, GradeFor, GradeDate) OUTPUT INSERTED.ID VALUES (@Points, @StudentId, @SubjectId, @ExamId, @HomeworkId, @GradeFor, @GradeDate)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Points = grade.Points,
                    StudentId = grade.StudentId,
                    SubjectId = grade.SubjectId,
                    ExamId = grade.ExamId,
                    HomeworkId = grade.HomeworkId,
                    GradeFor = grade.GradeFor,
                    GradeDate = grade.GradeDate
                };
                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }
    }
}
