using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeworkController : ControllerBase
    {
        private readonly IHomeworkRepo repo;
        private readonly IFileContentRepo fileRepo;
        public HomeworkController(IHomeworkRepo repo, IFileContentRepo fileRepo)
        {
            this.repo = repo;
            this.fileRepo = fileRepo;
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

                    var response = await this.repo.InsertHomework(homework);

                    return Ok("Added homework successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error save homework: {ex.Message}");
            }
        }

        //[HttpGet("GetAllSubjectsByClass/{classId}")]
        //public async Task<IActionResult> GetAllSubjectsByClass(int classId)
        //{
        //    var subjectList = await this.repo.GetAllSubjectsByClass(classId);
        //    if (subjectList != null)
        //    {
        //        return Ok(subjectList);
        //    }
        //    else
        //    {
        //        return NotFound();
        //    }
        //}
    }
}

