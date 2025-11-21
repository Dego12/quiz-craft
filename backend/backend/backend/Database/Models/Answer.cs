using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Database.Models
{
    [Table("Answer")]
    public class Answer
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public bool isCorrect { get; set; }

        [JsonIgnore]
        [ForeignKey("QuestionId")]
        public virtual Question? Question { get; set; } = null!;
    }
}
