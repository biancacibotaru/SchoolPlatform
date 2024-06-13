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
        public async Task<IActionResult> InsertGrade([FromBody] Grade grade)
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

        [HttpGet("GetGradesBySubjectAndStudent")]
        public async Task<IActionResult> GetGradesBySubjectAndStudent([FromQuery] int subjectId, [FromQuery] int studentId)
        {
            var list = await this.repo.GetGradesBySubjectAndStudent(subjectId, studentId);

            return Ok(list);
        }

        [HttpGet("GetGradesByStudent")]
        public async Task<IActionResult> GetGradesByStudent([FromQuery] int studentId)
        {
            var list = await this.repo.GetGradesByStudent(studentId);

            return Ok(list);
        }
    }
}
