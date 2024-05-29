using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Models;
using Dapper;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;

namespace SchoolPlatformWebApplication.Repo
{
    public class ExamRepo : IExamRepo
    {
        private readonly DapperDBContext context;
        public ExamRepo(DapperDBContext context)
        {
            this.context = context;
        }

        public async Task<int> InsertExam(Exam exam)
        {
            int examId = 0;

            string query = "INSERT INTO [dbo].[Exam] ([SubjectId], [Title], [Description], [Duration], [StartedOn], [ClosedOn]) OUTPUT INSERTED.Id VALUES (@SubjectId, @Title, @Description, @Duration, @StartedOn, @ClosedOn)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = exam.SubjectId,
                    Title = exam.Title,
                    Description = exam.Description,
                    Duration = exam.Duration,
                    StartedOn = exam.StartedOn,
                    ClosedOn = exam.ClosedOn
                };

                examId = await connection.ExecuteScalarAsync<int>(query, parameters);
            }

            if (examId != 0)
            {
                var questions = exam.Questions;

                foreach (var question in questions)
                {
                    string queryQuestion = "INSERT INTO [dbo].[Question] ([ExamId], [Text], [Points], [Answers]) VALUES (@ExamId, @Text, @Points, @Answers)";

                    using (var connection = this.context.CreateConnection())
                    {
                        var parameters = new
                        {
                            ExamId = examId,
                            Text = question.Text,
                            Points = question.Points,
                            Answers = JsonSerializer.Serialize(question.Answers)
                        };

                        var questionResult = await connection.QueryAsync<Question>(queryQuestion, parameters);
                    }
                }
            }

            return examId;
        }

        public async Task<List<Exam>> GetAllExamsBySubject(int subjectId)
        {
            string query = "SELECT * FROM [dbo].[Exam] where [SubjectId] = @SubjectId";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = subjectId
                };
                var response = await connection.QueryAsync<Exam>(query, parameters);
                return response.ToList();
            }
        }

        public async Task<Exam> GetExam(int id)
        {
            string query = "SELECT [Id], [SubjectId], [Title], [Description], [Duration], [StartedOn], [ClosedOn] FROM [dbo].[Exam] WHERE [dbo].[Exam].[Id] = @ExamId";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new { ExamId = id };
                var exam = await connection.QueryFirstOrDefaultAsync<Exam>(query, parameters);

                if (exam != null)
                {
                    string queryQuestions = "SELECT [Id], [Text], [Points], [Answers] FROM [dbo].[Question] WHERE [ExamId] = @ExamId";
                    var questions = await connection.QueryAsync<Question>(queryQuestions, parameters);

                    var questionDetailsList = questions.Select(question => new QuestionDetails
                    {
                        Id = question.Id,
                        Text = question.Text,
                        Points = question.Points,
                        Answers = JsonSerializer.Deserialize<List<AnswerDetails>>(question.Answers)
                    }).ToList();

                    exam.Questions = questionDetailsList;
                }

                return exam;
            }
        }

        public async Task<int> InsertStudentExam(StudentExam studentExam)
        {
            string query = "INSERT INTO [StudentExam] (StudentId, ExamId, TotalPoints, Status, StartedOn, FinishedOn) OUTPUT INSERTED.Id VALUES (@StudentId, @ExamId, @TotalPoints, @Status, @StartedOn, @FinishedOn);";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentId = studentExam.StudentId,
                    ExamId = studentExam.ExamId,
                    TotalPoints = studentExam.TotalPoints,
                    Status = studentExam.Status,
                    StartedOn = "2024-05-27",
                    FinishedOn = "2024-05-27"
                };

                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                return response;
            }
        }

        public async Task SetTotalPoints(StudentExam studentExam, float totalPoints)
        {
            string query = "UPDATE [StudentExam] SET TotalPoints = @TotalPoints where Id=@Id;";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    Id = studentExam.Id,
                    TotalPoints = totalPoints
                };

                var response = await connection.QueryFirstOrDefaultAsync<StudentExam>(query, parameters);
            }
        }

        public async Task InsertStudentAnswer(StudentAnswer studentAnswer)
        {
            string query = "INSERT INTO [StudentAnswer] (StudentExamId, QuestionId, Answers, PointsPerQuestion) OUTPUT INSERTED.Id VALUES (@StudentExamId, @QuestionId, @Answers, @PointsPerQuestion);";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    StudentExamId = studentAnswer.StudentExamId,
                    QuestionId = studentAnswer.QuestionId,
                    Answers = studentAnswer.Answers,
                    PointsPerQuestion = studentAnswer.PointsPerQuestion
                };

                var response = await connection.ExecuteScalarAsync<int>(query, parameters);
            }
        }

        public async Task<Question> GetQuestionById(int questionId)
        {
            string query = "SELECT * FROM [Question] WHERE Id = @QuestionId";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    QuestionId = questionId
                };

                var response = await connection.QueryFirstOrDefaultAsync<Question>(query, parameters);
                return response;
            }
        }

        public async Task<List<StudentAnswer>> GetStudentExam(int examId, int studentId)
        {
            string query = @"SELECT q.Id AS QuestionId, sa.Answers AS Answers, sa.PointsPerQuestion as PointsPerQuestion FROM Question q JOIN StudentAnswer sa ON sa.QuestionId = q.Id JOIN StudentExam se ON se.Id = sa.StudentExamId WHERE se.ExamId = @ExamId AND se.StudentId = @StudentId";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ExamId = examId,
                    StudentId = studentId
                };

                var examResult = await connection.QueryAsync<StudentAnswer>(query, parameters);

                return examResult.ToList();
            }
        } 

        public async Task<List<AnswersAndStudentAnswers>> GetStudentExamResults(int examId, int studentId)
        {
            var questions = (await this.GetExam(examId)).Questions;
            var studentQuestions = await this.GetStudentExam(examId, studentId);
            List<AnswersAndStudentAnswers> result = new List<AnswersAndStudentAnswers>();

            foreach(var question in questions)
            {
                var correctAnswers = question.Answers.Where(a => a.IsCorrect).Select(a => a.Text).ToList();
                var studentAnswers = studentQuestions.Where(s => s.QuestionId == question.Id).FirstOrDefault().Answers.Split(',').ToList();

                result.Add(new AnswersAndStudentAnswers
                {
                    QuestionId = question.Id,
                    Answers = correctAnswers,
                    StudentAnswers = studentAnswers,
                    StudentPoints = studentQuestions.Where(s => s.QuestionId == question.Id).FirstOrDefault().PointsPerQuestion
                });
            }

            return result;
        }
    }
}
