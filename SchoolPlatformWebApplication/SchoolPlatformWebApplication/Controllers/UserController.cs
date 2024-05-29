using Microsoft.AspNetCore.Mvc;
using SchoolPlatformWebApplication.Models;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController: ControllerBase
    {
        private readonly IUserRepo repo;
        public UserController(IUserRepo repo) 
        {
            this.repo = repo;
        }

        [HttpGet("GetAllStudents")]
        public async Task<IActionResult> GetAllStudents()
        {
            var userList = await this.repo.GetAllStudents();
            if(userList != null)
            {
                return Ok(userList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetAllTeachers")]
        public async Task<IActionResult> GetAllTeachers()
        {
            var userList = await this.repo.GetAllTeachers();
            if (userList != null)
            {
                return Ok(userList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetAllNonLiders")]
        public async Task<IActionResult> GetAllNonLiders()
        {
            var userList = await this.repo.GetAllNonLiders();
            if (userList != null)
            {
                return Ok(userList);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("GetUserByCredentials")]
        public async Task<IActionResult> CheckUser([FromBody] UserLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email și parolă sunt obligatorii.");
            }

            var user = await this.repo.GetUserByEmailAndPassword(request.Email, request.Password);

            if (user != null)
            {
                return Ok(user);
            }
            else
            {
                return NotFound("Nu s-a găsit niciun utilizator cu aceste credențiale.");
            }
        }

        [HttpPost("InsertUser")]
        public async Task<IActionResult> InsertUser([FromBody] User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("User data cannot be null!");
                }

                // Verificăm dacă există deja un utilizator cu aceeași adresă de email
                var existingUser = await this.repo.GetUserByEmail(user.Email);
                if (existingUser != null)
                {
                    return BadRequest("An user with the same email address exists!");
                }

                await this.repo.InsertUser(user);

                return Ok("Successfull user insert.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"User insert error: {ex.Message}");
            }
        }
    }
}
