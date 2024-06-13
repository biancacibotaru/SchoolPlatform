using SchoolPlatformWebApplication.Models;

namespace SchoolPlatformWebApplication.Repo
{
    public interface IGradeRepo
    {
        Task<int> InsertGrade(Grade newGrade);
        Task<int> UpdateGrade(float grade, int studentId, int subjectId, int homeworkId);
        Task<List<object>> GetGradesBySubjectAndStudent(int subjectId, int studentId);
        Task<List<object>> GetGradesByStudent(int studentId);

    }
}
