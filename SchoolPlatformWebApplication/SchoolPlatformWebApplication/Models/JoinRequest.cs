namespace SchoolPlatformWebApplication.Models
{
    public class JoinRequest
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int ClassId { get; set; }
        public int FileContentId { get; set; }
        public string Status { get; set; }
    }
}
