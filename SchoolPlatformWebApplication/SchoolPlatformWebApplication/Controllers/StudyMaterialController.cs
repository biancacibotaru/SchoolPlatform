using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudyMaterialController : ControllerBase
    {
        private readonly IStudyMaterialRepo repo;
        private readonly IFileContentRepo fileRepo;
        public StudyMaterialController(IStudyMaterialRepo repo, IFileContentRepo fileRepo)
        {
            this.repo = repo;
            this.fileRepo = fileRepo;
        }

        [HttpPost("InsertStudyMaterial")]
        public async Task<IActionResult> InsertStudyMaterial([FromForm] int subjectId, [FromForm] string title, [FromForm] string description, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Invalid file.");
            }

            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);

                    FileContent newFile = new FileContent();
                    newFile.FileName = file.FileName;
                    newFile.Content = memoryStream.ToArray();
                    newFile.Scope = "Study material";

                    StudyMaterial material = new StudyMaterial();
                    material.SubjectId = subjectId;
                    material.Title = title;
                    material.Description = description;
                    material.FileContentId = await this.fileRepo.InsertFileContent(newFile);

                    var response = await this.repo.InsertStudyMaterial(material);

                    return Ok("Join request successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error save join request: {ex.Message}");
            }
        }

        [HttpGet("GetStudyMaterialsForSubject/{id}")]
        public async Task<IActionResult> GetStudyMaterialsForSubject(int id)
        {
            var materials = await this.repo.GetAllMaterialsForSubject(id);

            return Ok(materials);
        }
    }
}
