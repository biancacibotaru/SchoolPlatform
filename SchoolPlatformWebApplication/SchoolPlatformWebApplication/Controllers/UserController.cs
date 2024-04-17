using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var userList = await this.repo.GetAll();
            if(userList != null)
            {
                return Ok(userList);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
