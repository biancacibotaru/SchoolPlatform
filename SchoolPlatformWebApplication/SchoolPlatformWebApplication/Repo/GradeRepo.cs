using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Models;
using Dapper;
using System.Diagnostics;

namespace SchoolPlatformWebApplication.Repo
{
    public class GradeRepo : IGradeRepo
    {
        private readonly DapperDBContext context;
        public GradeRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<int> InsertGrade(Grade grade)
        {
            string query = "INSERT INTO [Grade] (Points, StudentId, SubjectId, ExamId, HomeworkId, GradeFor, GradeDate) OUTPUT INSERTED.Id VALUES (@Points, @StudentId, @SubjectId, @ExamId, @HomeworkId, @GradeFor, @GradeDate)";
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

        public async Task<int> UpdateGrade(float grade, int studentId, int subjectId, int homeworkId)
        {
            string query = "UPDATE [Grade] SET Points = @Points, GradeDate = @GradeDate OUTPUT INSERTED.Id WHERE (StudentId = @StudentId AND SubjectId = @SubjectId AND HomeworkId = @HomeworkId)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Points = grade,
                    StudentId = studentId,
                    SubjectId = subjectId,
                    HomeworkId = homeworkId,
                    GradeDate = DateTime.Now.ToString("M/d/yyyy h:mm:ss tt")
                };
                var response = await connection.ExecuteScalarAsync<int>(query, parameters);

                return response;
            }
        }

        public async Task<List<object>> GetGradesBySubjectAndStudent(int subjectId, int studentId)
        {
            string query = "SELECT Grade.Points, Grade.GradeDate, Grade.GradeFor, Homework.Title as HomeworkTitle, Exam.Title as ExamTitle FROM [Grade] full outer join Homework on Grade.HomeworkId = Homework.Id full outer join Exam on Grade.ExamId = Exam.Id WHERE (StudentId = @StudentId AND Grade.SubjectId = @SubjectId) ORDER BY [Grade].[Id] desc";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = studentId,
                    SubjectId = subjectId
                };
                var response = await connection.QueryAsync<object>(query, parameters);

                return response.ToList();
            }
        }

        public async Task<List<object>> GetGradesByStudent(int studentId)
        {
            string query = "SELECT [Points], [GradeFor], [GradeDate], [Name] as SubjectName FROM [Grade] inner join Subject on Grade.SubjectId = Subject.Id where StudentId = @StudentId ORDER BY [Grade].[Id] desc";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = studentId
                };
                var response = await connection.QueryAsync<object>(query, parameters);

                return response.ToList();
            }
        }
    }
}
