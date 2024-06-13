using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;
using System.Security.Cryptography.X509Certificates;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeworkController : ControllerBase
    {
        private readonly IHomeworkRepo repo;
        private readonly IFileContentRepo fileRepo;
        private readonly IGradeRepo gradeRepo;
        public HomeworkController(IHomeworkRepo repo, IFileContentRepo fileRepo, IGradeRepo gradeRepo)
        {
            this.repo = repo;
            this.fileRepo = fileRepo;
            this.gradeRepo = gradeRepo;
        }

        [HttpPost("InsertHomework")]
        public async Task<IActionResult> InsertHomework([FromForm] string title, [FromForm] string description, [FromForm] DateTime startDate, [FromForm] DateTime endDate, [FromForm] int subjectId, [FromForm] IFormFile? file)
        {
            try
            {
                using (var memoryStream = new MemoryStream())
                {

                    Homework homework = new Homework();
                    homework.Title = title;
                    homework.Description = description;
                    homework.StartDate = startDate.ToString();
                    homework.Deadline = endDate.ToString();
                    homework.SubjectId = subjectId;

                    if (file != null && file.Length != 0)
                    {
                        await file.CopyToAsync(memoryStream);
                        FileContent newFile = new FileContent();
                        newFile.FileName = file.FileName;
                        newFile.Content = memoryStream.ToArray();
                        newFile.Scope = "Homework requirement";
                        homework.FileContentId = await this.fileRepo.InsertFileContent(newFile);
                    }
                    else
                    {
                        homework.FileContentId = null;
                    }

                    var response = await this.repo.InsertHomework(homework);

                    return Ok("Added homework successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error save homework: {ex.Message}");
            }
        }

        [HttpPost("InsertStudentHomework")]
        public async Task<IActionResult> InsertStudentHomework([FromForm] int studentId, [FromForm] int homeworkId, [FromForm] string submitDate, [FromForm] IFormFile? file)
        {
            try
            {
                using (var memoryStream = new MemoryStream())
                {

                    StudentHomework homework = new StudentHomework();
                    homework.StudentId = studentId;
                    homework.HomeworkId = homeworkId;
                    homework.SubmitDate = submitDate;

                    if (file != null && file.Length != 0)
                    {
                        await file.CopyToAsync(memoryStream);
                        FileContent newFile = new FileContent();
                        newFile.FileName = file.FileName;
                        newFile.Content = memoryStream.ToArray();
                        newFile.Scope = "Homework solved";
                        homework.FileContentId = await this.fileRepo.InsertFileContent(newFile);
                    }

                    var response = await this.repo.InsertStudentHomework(homework);

                    return Ok("Added homework successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error save homework: {ex.Message}");
            }
        }

        [HttpGet("GetHomeworksBySubject/{id}")]
        public async Task<IActionResult> GetHomeworksBySubject(int id)
        {
            var homeworkList = await this.repo.GetHomeworksBySubject(id);
            if (homeworkList != null)
            {
                return Ok(homeworkList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetHomeworksForStudentBySubject/{id}")]
        public async Task<IActionResult> GetHomeworksForStudentBySubject(int id, [FromQuery] int studentId)
        {
            var homeworkList = await this.repo.GetHomeworksForStudentBySubject(id, studentId);
            if (homeworkList != null)
            {
                return Ok(homeworkList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetStudentsHomework/{id}")]
        public async Task<IActionResult> GetStudentHomework(int id)
        {
            var homework = await this.repo.GetStudentsHomework(id);

            return Ok(homework);
        }

        [HttpPost("UpdateGradeForHomework")]
        public async Task<IActionResult> UpdateGradeForHomework([FromForm] int id, [FromForm] float grade, [FromForm] int subjectId, [FromForm] int studentId, [FromForm] int homeworkId, [FromForm] bool withUpdate)
        {
            var homework = await this.repo.UpdateGradeForHomework(id, grade);
            Grade newGrade = new Grade()
            {
                Points = grade,
                StudentId = studentId,
                SubjectId = subjectId,
                HomeworkId = homeworkId,
                GradeFor = "Homework",
                GradeDate = DateTime.Now.ToString("M/d/yyyy h:mm:ss tt")
            };

            if (!withUpdate)
            {
                var responseGrade = await this.gradeRepo.InsertGrade(newGrade);
            }
            else
            {
                var responseGrade = await this.gradeRepo.UpdateGrade(grade, studentId, subjectId, homeworkId);
            }

            return Ok(homework);
        }
    }
}

