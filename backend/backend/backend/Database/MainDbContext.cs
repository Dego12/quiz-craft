using backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public partial class MainDbContext : DbContext
    {
        IConfiguration _configuration;
        public MainDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public MainDbContext(DbContextOptions<MainDbContext> options)
            : base(options)
        {

        }

        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<Quiz> Quizzes { get; set; } = null!;
        public virtual DbSet<Question> Questions { get; set; } = null!;
        public virtual DbSet<Answer> Answers { get; set; } = null!;
        public virtual DbSet<Room> Rooms { get; set; } = null!;
        public virtual DbSet<Guest> Guests { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseLazyLoadingProxies(false).UseSqlServer(_configuration.GetConnectionString("AzureConnection"));
            }
        }
    }
}
