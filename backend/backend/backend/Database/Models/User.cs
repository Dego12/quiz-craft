using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace backend.Database.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public string? PrevPassword { get; set; }

        public string? ResetPasswordToken { get; set; }

        public virtual ICollection<Quiz>? Quizzes { get; set; } = null!;
    }
}
