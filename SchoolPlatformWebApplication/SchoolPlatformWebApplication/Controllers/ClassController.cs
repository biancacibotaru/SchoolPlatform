using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly IClassRepo repo;
        public ClassController(IClassRepo repo)
        {
            this.repo = repo;
        }

        [HttpGet("GetAllClasses")]
        public async Task<IActionResult> GetAllClasses()
        {
            var list = await this.repo.GetAllClasses();

            if (list != null)
            {
                return Ok(list);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetClassIdByCode/{code}")]
        public async Task<IActionResult> GetClassIdByCode(string code)
        {
            var response = await this.repo.GetClassIdByCode(code);

            if (response != default)
            {
                return Ok(response);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("InsertClass")]
        public async Task<IActionResult> InsertClass([FromBody] Class newClass)
        {
            try
            {
                if (newClass == null)
                {
                    return BadRequest("Class data cannot be null!");
                }

                int id = await this.repo.InsertClass(newClass);

                return Ok(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Class insert error: {ex.Message}");
            }
        }
    }
}
