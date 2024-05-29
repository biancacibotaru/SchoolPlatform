using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserClassController : ControllerBase
    {
        private readonly IUserClassRepo repo;
        public UserClassController(IUserClassRepo repo)
        {
            this.repo = repo;
        }

        [HttpPost("InsertUserClass")]
        public async Task<IActionResult> InsertUserClass([FromBody] UserClass newObject)
        {
            try
            {
                if (newObject == null)
                {
                    return BadRequest("User class cannot be null!");
                }

                await this.repo.InsertUserClass(newObject);

                return Ok("Successfull user class insert.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"UserClass insert error: {ex.Message}");
            }
        }

        [HttpGet("GetAllClassesWithLeaders")]
        public async Task<IActionResult> GetAllClassesWithLeaders()
        {
            var list = await this.repo.GetAllClassesWithLeaders();

            if (list != null)
            {
                return Ok(list);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetStudentListByClass/{id}")]
        public async Task<IActionResult> GetStudentListByClass(int id)
        {
            var students = await this.repo.GetStudentsByClass(id);

            if (students != null)
            {
                return Ok(students);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetStudentClass/{id}")]
        public async Task<IActionResult> GetStudentClass(int id)
        {
            var studentClass = await this.repo.GetStudentClass(id);

            return Ok(studentClass);
        }
    }
}
