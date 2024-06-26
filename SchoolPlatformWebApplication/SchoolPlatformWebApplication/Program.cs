using Newtonsoft.Json.Serialization;
using SchoolPlatformWebApplication.Models.Data;
using SchoolPlatformWebApplication.Repo;

namespace SchoolPlatformWebApplication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //Enable CORS
            builder.Services.AddCors(c =>
            {
                c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            // JSON Serializer
            builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
                .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver
                = new DefaultContractResolver());

            builder.Services.AddControllers();

            builder.Services.AddTransient<DapperDBContext>();
            builder.Services.AddTransient<IUserRepo, UserRepo>();
            builder.Services.AddTransient<IClassRepo, ClassRepo>();
            builder.Services.AddTransient<IUserClassRepo, UserClassRepo>();
            builder.Services.AddTransient<ISubjectRepo, SubjectRepo>();
            builder.Services.AddTransient<IJoinRequestRepo, JoinRequestRepo>();
            builder.Services.AddTransient<IFileContentRepo, FileContentRepo>();
            builder.Services.AddTransient<IStudyMaterialRepo, StudyMaterialRepo>();
            builder.Services.AddTransient<IExamRepo, ExamRepo>();
            builder.Services.AddTransient<IHomeworkRepo, HomeworkRepo>();
            builder.Services.AddTransient<IGradeRepo, GradeRepo>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            //Enable CORS
            app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}