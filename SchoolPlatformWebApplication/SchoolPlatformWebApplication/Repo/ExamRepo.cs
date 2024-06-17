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

        public async Task<List<StudentAnswer>> GetStudentExam(int examId, int studentId)
        {
            string query = @"SELECT q.Id AS QuestionId, sa.Answers AS Answers, sa.PointsPerQuestion as PointsPerQuestion 
                FROM Question q JOIN StudentAnswer sa ON sa.QuestionId = q.Id   
                JOIN StudentExam se ON se.Id = sa.StudentExamId 
                WHERE se.ExamId = @ExamId AND se.StudentId = @StudentId";

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

        public async Task<int> InsertExam(Exam exam)
        {
            int examId = 0;

            string query = "INSERT INTO [dbo].[Exam] ([SubjectId], [Title], [Description], [Duration], [StartedOn], [State]) OUTPUT INSERTED.Id VALUES (@SubjectId, @Title, @Description, @Duration, @StartedOn, @State)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = exam.SubjectId,
                    Title = exam.Title,
                    Description = exam.Description,
                    Duration = exam.Duration,
                    StartedOn = exam.StartedOn,
                    State = exam.State
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

        public async Task<int> UpdateExam(Exam exam)
        {
            int rowsAffected = 0;

            string updateExamQuery = @"
        UPDATE [dbo].[Exam]
        SET 
            [SubjectId] = @SubjectId, 
            [Title] = @Title, 
            [Description] = @Description, 
            [Duration] = @Duration, 
            [StartedOn] = @StartedOn, 
            [State] = @State
        WHERE [Id] = @Id";

            using (var connection = this.context.CreateConnection())
            {
                var examParameters = new
                {
                    Id = exam.Id,
                    SubjectId = exam.SubjectId,
                    Title = exam.Title,
                    Description = exam.Description,
                    Duration = exam.Duration,
                    StartedOn = exam.StartedOn,
                    State = exam.State
                };

                rowsAffected = await connection.ExecuteAsync(updateExamQuery, examParameters);
            }

            if (rowsAffected > 0)
            {
                var questions = exam.Questions;

                foreach (var question in questions)
                {
                    var existingQuestion = await GetQuestionByIdAndExam(question.Id, exam.Id);

                    if (existingQuestion == null)
                    {
                        // Insert new question
                        string insertQuestionQuery = @"
                    INSERT INTO [dbo].[Question] ([ExamId], [Text], [Points], [Answers])
                    VALUES (@ExamId, @Text, @Points, @Answers)";

                        using (var connection = this.context.CreateConnection())
                        {
                            var insertParameters = new
                            {
                                ExamId = exam.Id,
                                Text = question.Text,
                                Points = question.Points,
                                Answers = JsonSerializer.Serialize(question.Answers)
                            };

                            await connection.ExecuteAsync(insertQuestionQuery, insertParameters);
                        }
                    }
                    else
                    {
                        // Update existing question
                        string updateQuestionQuery = @"
                    UPDATE [dbo].[Question]
                    SET 
                        [Text] = @Text, 
                        [Points] = @Points, 
                        [Answers] = @Answers
                    WHERE [ExamId] = @ExamId AND [Id] = @QuestionId";

                        using (var connection = this.context.CreateConnection())
                        {
                            var updateParameters = new
                            {
                                ExamId = exam.Id,
                                QuestionId = question.Id,
                                Text = question.Text,
                                Points = question.Points,
                                Answers = JsonSerializer.Serialize(question.Answers)
                            };

                            await connection.ExecuteAsync(updateQuestionQuery, updateParameters);
                        }
                    }
                }
            }

            return rowsAffected;
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

        public async Task<List<Exam>> GetAllExamsBySubjectForStudent(int subjectId)
        {
            string query = "SELECT * FROM [dbo].[Exam] where [SubjectId] = @SubjectId and [State] = @State";

            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    SubjectId = subjectId,
                    State = "published"
                };
                var response = await connection.QueryAsync<Exam>(query, parameters);
                return response.ToList();
            }
        }

        public async Task<Exam> GetExam(int id)
        {
            string query = "SELECT [Id], [SubjectId], [Title], [Description], [Duration], [StartedOn], [State] FROM [dbo].[Exam] WHERE [dbo].[Exam].[Id] = @ExamId";
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
                    StartedOn = DateTime.Now.ToString("M/d/yyyy h:mm:ss tt"),
                    FinishedOn = DateTime.Now.ToString("M/d/yyyy h:mm:ss tt")
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

        public async Task<Question> GetQuestionByIdAndExam(int questionId, int examId)
        {
            string query = "SELECT * FROM [Question] WHERE Id = @QuestionId and ExamId = @ExamId";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    QuestionId = questionId,
                    ExamId= examId
                };

                var response = await connection.QueryFirstOrDefaultAsync<Question>(query, parameters);
                return response;
            }
        }

        public async Task<StudentExam> GetStudentExamStatus(int examId, int studentId)
        {
            string query = @"SELECT [StudentId],[ExamId],[TotalPoints],[StartedOn],[FinishedOn],[Status] FROM [StudentExam] WHERE [ExamId] = @ExamId AND [StudentId] = @StudentId";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ExamId = examId,
                    StudentId = studentId
                };

                var examResult = await connection.QueryFirstOrDefaultAsync<StudentExam>(query, parameters);

                return examResult;
            }
        }

        public async Task<List<AnswersAndStudentAnswers>> GetStudentExamResults(int examId, int studentId)
        {
            var questions = (await this.GetExam(examId)).Questions;
            var studentQuestions = await this.GetStudentExam(examId, studentId);
            List<AnswersAndStudentAnswers> result = new List<AnswersAndStudentAnswers>();

            foreach (var question in questions)
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

        public async Task<int> GetSubjectIdByExam(int examId)
        {
            string query = @"SELECT [SubjectId] FROM [Exam] WHERE [Id] = @ExamId";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ExamId = examId,
                };

                var subjectId = await connection.ExecuteScalarAsync<int>(query, parameters);

                return subjectId;
            }
        }

        public async Task<List<Exam>> GetFutureExamsByClass(string classCode)
        {
            List<Exam> exams = new List<Exam>();
            List<Exam> futureExams = new List<Exam>();

            string query = @"SELECT [SubjectId],[Title], [Subject].[Name] as Description,[Duration],[StartedOn],[State] FROM [dbo].[Exam] inner join Subject on Exam.SubjectId = Subject.Id inner join Class on Class.Id = Subject.ClassId where (Class.Code = @ClassCode AND [State]=@State)";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ClassCode = classCode,
                    State = "published"
                };

                var response = await connection.QueryAsync<Exam>(query, parameters);

                exams = response.ToList();

                foreach (var exam in exams)
                {
                    if (DateTime.TryParse(exam.StartedOn, out DateTime dateTime))
                    {
                        if (dateTime.AddMinutes(exam.Duration) > DateTime.Now)
                        {
                            futureExams.Add(exam);
                        }
                    }
                }
            }

            return futureExams;
        }

        public async Task<bool> CheckIfFutureExamsByClass(string classCode)
        {
            var futureExams = await this.GetFutureExamsByClass(classCode);
            if (futureExams.Count > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<List<ExamResult>> GetExamResultsForAllStudents(int examId)
        {
            string query = @"SELECT UC.UserId, ISNULL(SE.ExamId, 0) AS ExamId, SE.TotalPoints, SE.Status, U.Firstname, U.Lastname, U.Email FROM UserClass UC LEFT JOIN (SELECT StudentId, ExamId, TotalPoints, Status FROM StudentExam WHERE ExamId = @ExamId) SE ON UC.UserId = SE.StudentId LEFT JOIN [User] U ON UC.UserId = U.Id WHERE UC.ClassId = (SELECT TOP 1 ClassId FROM Subject WHERE Id = (SELECT SubjectId FROM Exam WHERE Id = @ExamId)) AND UC.Role = 'student' order by SE.TotalPoints desc;";
            using (var connection = this.context.CreateConnection())
            {
                var parameters = new
                {
                    ExamId = examId
                };

                var examResults = await connection.QueryAsync<ExamResult>(query, parameters);

                return examResults.ToList();
            }
        }

        public async Task<bool> InsertExamGradeForAbsentStudents(int examId, int subjectId)
        {
            var examResults = await this.GetExamResultsForAllStudents(examId);
            var absentStudents = examResults.Where(e => e.TotalPoints == null).ToList();

            foreach (var student in absentStudents)
            {
                string query = @"INSERT INTO [Grade] ([Points],[StudentId],[SubjectId],[ExamId],[GradeFor],[GradeDate]) OUTPUT INSERTED.Id VALUES (1, @StudentId, @SubjectId, @ExamId, @GradeFor, @GradeDate)";
                using (var connection = this.context.CreateConnection())
                {
                    var parameters = new
                    {
                        Points = 1,
                        StudentId = student.UserId,
                        SubjectId = subjectId,
                        ExamId = examId,
                        GradeFor = "Missed Exam",
                        GradeDate = DateTime.Now.ToString("M/d/yyyy h:mm:ss tt")
                    };

                    var response = await connection.ExecuteScalarAsync<int>(query, parameters);
                }
            }

            //string queryUpdate = @"UPDATE [Exam] set [State] = @State where Id = @ExamId";
            //using (var connection = this.context.CreateConnection())
            //{
            //    var parameters = new
            //    {
            //        ExamId = examId,
            //        State = "published and noted"
            //    };

            //    var response = await connection.QueryFirstOrDefaultAsync<Exam>(queryUpdate, parameters);
            //}

            return true;
        }
    }
}
