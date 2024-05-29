namespace SchoolPlatformWebApplication.Models
{
    public class FileContent
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public byte[] Content { get; set; }
        public string Scope { get; set; }
    }
}
