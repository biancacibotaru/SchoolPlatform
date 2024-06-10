using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradeController : ControllerBase
    {
        private readonly IGradeRepo repo;
        public GradeController(IGradeRepo repo)
        {
            this.repo = repo;
        }

        [HttpPost("InsertGrade")]
        public async Task<IActionResult> InsertSubject([FromBody] Grade grade)
        {
            try
            {
                if (grade == null)
                {
                    return BadRequest("Grade cannot be null!");
                }

                int id = await this.repo.InsertGrade(grade);

                return Ok(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Grade insert error: {ex.Message}");
            }
        }
    }
}
