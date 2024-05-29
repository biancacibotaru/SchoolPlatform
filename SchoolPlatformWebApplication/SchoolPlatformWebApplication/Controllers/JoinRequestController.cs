using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JoinRequestController : ControllerBase
    {
        private readonly IJoinRequestRepo repo;
        private readonly IFileContentRepo fileRepo;
        private readonly IUserClassRepo userClassRepo;
        public JoinRequestController(IJoinRequestRepo repo, IFileContentRepo fileRepo, IUserClassRepo userClassRepo)
        {
            this.repo = repo;
            this.fileRepo = fileRepo;
            this.userClassRepo = userClassRepo;
        }

        [HttpPost("InsertJoinRequest")]
        public async Task<IActionResult> InsertJoinRequest([FromForm] int userId, [FromForm] int classId, [FromForm] IFormFile file)
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
                    newFile.Scope = "Join proof";

                    JoinRequest request = new JoinRequest();
                    request.StudentId = userId;
                    request.ClassId = classId;
                    request.FileContentId = await this.fileRepo.InsertFileContent(newFile);

                    var response = await this.repo.InsertJoinRequest(request);

                    return Ok("Join request successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error save join request: {ex.Message}");
            }
        }

        [HttpGet("GetJoinRequestForStudent/{userId}")]
        public async Task<IActionResult> GetJoinRequestForStudent(int userId)
        {
            var joinRequest = await this.repo.GetJoinRequestForStudent(userId);

            return Ok(joinRequest);
        }

        [HttpGet("GetJoinRequests")]
        public async Task<IActionResult> GetJoinRequests()
        {
            var requestsList = await this.repo.GetJoinRequests();

            return Ok(requestsList);
        }

        [HttpPut("UpdateJoinRequestForStudent/{id}")]
        public async Task<IActionResult> UpdateJoinRequestForStudent(int id, [FromForm] string status)
        {
            await this.repo.UpdateJoinRequestForStudent(id, status);
            var joinRequest = await this.repo.GetJoinRequestForStudent(id);
            if(joinRequest.Status == "accepted")
            {
                UserClass userClass = new UserClass();
                userClass.ClassId = joinRequest.ClassId;
                userClass.UserId = joinRequest.StudentId;
                userClass.Role = "student";

                var insertUser = await this.userClassRepo.InsertUserClass(userClass);
            }

            return Ok(joinRequest);
        }
    }
}

