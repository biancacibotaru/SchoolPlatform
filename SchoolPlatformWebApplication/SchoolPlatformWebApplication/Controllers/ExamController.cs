using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;
using System.Diagnostics;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IExamRepo repo;
        private readonly IGradeRepo gradeRepo;
        public ExamController(IExamRepo repo, IGradeRepo gradeRepo)
        {
            this.repo = repo;
            this.gradeRepo = gradeRepo;
        }

        [HttpPost("InsertExam")]
        public async Task<IActionResult> InsertExam([FromBody] Exam exam)
        {
            try
            {
                int id;

                if (exam == null)
                {
                    return BadRequest("Exam data cannot be null!");
                }

                if (exam.Id == 0)
                {
                    id = await this.repo.InsertExam(exam);
                }
                else
                {
                    id = await this.repo.UpdateExam(exam);
                }

                return Ok(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Subject insert error: {ex.Message}");
            }
        }

        [HttpGet("GetAllExamsBySubject/{id}")]
        public async Task<IActionResult> GetAllExamsBySubject(int id)
        {
            var examList = await this.repo.GetAllExamsBySubject(id);
            if (examList != null)
            {
                return Ok(examList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetAllExamsBySubjectForStudent/{id}")]
        public async Task<IActionResult> GetAllExamsBySubjectForStudent(int id)
        {
            var examList = await this.repo.GetAllExamsBySubjectForStudent(id);
            if (examList != null)
            {
                return Ok(examList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetExam/{id}")]
        public async Task<IActionResult> GetExam(int id)
        {
            try
            {
                Exam exam = await this.repo.GetExam(id);

                return Ok(exam);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Get exam error: {ex.Message}");
            }
        }

        [HttpGet("GetStudentExam/{examId}")]
        public async Task<IActionResult> GetStudentResults(int examId, [FromQuery] int studentId)
        {
            try
            {
                var result = await this.repo.GetStudentExamResults(examId, studentId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Get exam error: {ex.Message}");
            }
        }

        [HttpGet("GetStudentExamStatus/{examId}")]
        public async Task<IActionResult> GetStudentExamStatus(int examId, [FromQuery] int studentId)
        {
            try
            {
                var result = await this.repo.GetStudentExamStatus(examId, studentId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Get exam error: {ex.Message}");
            }
        }

        [HttpGet("GetFutureExamsByClass")]
        public async Task<IActionResult> GetFutureExamsByClass([FromQuery] string classCode)
        {
            try
            {
                var result = await this.repo.GetFutureExamsByClass(classCode);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Get future exams error: {ex.Message}");
            }
        }

        [HttpGet("CheckIfFutureExamsByClass")]
        public async Task<IActionResult> CheckIfFutureExamsByClass([FromQuery] string classCode)
        {
            try
            {
                var result = await this.repo.CheckIfFutureExamsByClass(classCode);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Get future exams error: {ex.Message}");
            }
        }

        [HttpGet("GetExamResultsForAllStudents")]
        public async Task<IActionResult> GetExamResultsForAllStudents([FromQuery] int examId)
        {
            try
            {
                var result = await this.repo.GetExamResultsForAllStudents(examId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Get future exams error: {ex.Message}");
            }
        }

        [HttpPost("InsertExamGradeForAbsentStudents")]
        public async Task<IActionResult> InsertGradeForAbsentStudents([FromQuery] int examId, [FromQuery] int subjectId)
        {
            try
            {
                bool result = await this.repo.InsertExamGradeForAbsentStudents(examId, subjectId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Grade insert error: {ex.Message}");
            }
        }

        [HttpPost("SubmitExam")]
        public async Task<IActionResult> SubmitExam([FromBody] StudentResponse studentResponse)
        {
            if (studentResponse == null)
            {
                return BadRequest("Invalid response data.");
            }

            var studentExam = new StudentExam
            {
                StudentId = studentResponse.StudentId,
                ExamId = studentResponse.ExamId,
                Status = "Completed",
                TotalPoints = 0
            };

            studentExam.Id = await repo.InsertStudentExam(studentExam);

            float totalPoints = 0;
            foreach (var response in studentResponse.Responses)
            {
                var question = await repo.GetQuestionById(response.QuestionId);
                float pointsPerQuestion = CalculatePoints(question, response.Answers);

                var studentAnswer = new StudentAnswer
                {
                    StudentExamId = studentExam.Id,
                    QuestionId = response.QuestionId,
                    Answers = string.Join(",", response.Answers),
                    PointsPerQuestion = pointsPerQuestion
                };

                totalPoints += pointsPerQuestion;
                await repo.InsertStudentAnswer(studentAnswer);
            }

            await repo.SetTotalPoints(studentExam, (float)Math.Round(totalPoints + 1, 2));

            int subjectId = await repo.GetSubjectIdByExam(studentResponse.ExamId);
            Grade newGrade = new Grade()
            {
                Points = (float)Math.Round(totalPoints + 1, 2),
                StudentId = studentResponse.StudentId,
                SubjectId = subjectId,
                ExamId = studentResponse.ExamId,
                GradeFor = "Exam",
                GradeDate = DateTime.Now.ToString("M/d/yyyy h:mm:ss tt")
            };

            var responseGrade = await this.gradeRepo.InsertGrade(newGrade);

            return Ok("Exam submitted successfully!");
        }

        private float CalculatePoints(Question question, List<string> studentAnswers)
        {
            var totalPoints = question.Points;
            var correctAnswers = JsonSerializer.Deserialize<List<AnswerDetails>>(question.Answers)
                                    .Where(a => a.IsCorrect)
                                    .Select(a => a.Text)
                                    .ToList();
            var pointsPerCorrectAnswer = totalPoints / correctAnswers.Count;

            var correctSelected = studentAnswers.Intersect(correctAnswers).Count();
            var incorrectSelected = studentAnswers.Except(correctAnswers).Count();

            var pointsResult = Math.Max(0, correctSelected * pointsPerCorrectAnswer - incorrectSelected * pointsPerCorrectAnswer);
            pointsResult = (float)Math.Round(pointsResult, 2);

            return pointsResult;
        }
    }
}
