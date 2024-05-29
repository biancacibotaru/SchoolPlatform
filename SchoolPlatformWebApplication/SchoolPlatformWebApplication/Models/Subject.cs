namespace SchoolPlatformWebApplication.Models
{
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ClassId { get; set; }
        public int TeacherId { get; set; }
        public int HoursPerWeek { get; set; }
    }
}
