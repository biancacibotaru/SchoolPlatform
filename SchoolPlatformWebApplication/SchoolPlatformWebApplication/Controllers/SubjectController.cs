using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectRepo repo;
        private readonly IClassRepo classRepo;
        public SubjectController(ISubjectRepo repo, IClassRepo classRepo)
        {
            this.repo = repo;
            this.classRepo = classRepo;
        }

        [HttpGet("GetAllSubjectsByClass/{classId}")]
        public async Task<IActionResult> GetAllSubjectsByClass(int classId)
        {
            var subjectList = await this.repo.GetAllSubjectsByClass(classId);
            if (subjectList != null)
            {
                return Ok(subjectList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("InsertSubject")]
        public async Task<IActionResult> InsertSubject(Dictionary<string, string> newSubject)
        {
            try
            {
                if (newSubject == null)
                {
                    return BadRequest("Subject data cannot be null!");
                }

                Subject subject = new Subject();

                subject.Name = newSubject["Name"];
                subject.ClassId = Convert.ToInt32(newSubject["Class"]);
                subject.TeacherId = Convert.ToInt32(newSubject["TeacherId"]);
                subject.HoursPerWeek = Convert.ToInt32(newSubject["HoursPerWeek"]);

                int id = await this.repo.InsertSubject(subject);

                return Ok(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Subject insert error: {ex.Message}");
            }
        }

        [HttpGet("GetAllSubjectsByTeacher/{teacherId}")]
        public async Task<IActionResult> GetAllSubjectsByTeacher(int teacherId)
        {
            var subjectList = await this.repo.GetAllSubjectsByTeacher(teacherId);
            if (subjectList != null)
            {
                return Ok(subjectList);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
