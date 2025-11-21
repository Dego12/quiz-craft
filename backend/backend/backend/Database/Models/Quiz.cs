using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Database.Models
{
    [Table("Quiz")]
    public class Quiz
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        [Required]
        public int NumberOfPlays { get; set; }

        [JsonIgnore]
        [ForeignKey("OwnerId")]
        public virtual User? Owner { get; set; } = null!;
        public Boolean readOnly { get; set; }
        public virtual ICollection<Question>? Questions { get; set; } = null!;
    }
}
