using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Database.Models
{
    [Table("Room")]
    public class Room
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public int Pin { get; set; }

        [Required]
        public RoomState State { get; set; }

        public string? HostConnectionId { get; set; }

        [ForeignKey("QuizId")]
        public virtual Quiz? Quiz { get; set; } = null!;

        public virtual ICollection<Guest>? Guests { get; set; } = null!;
        public int? limitOfPlayers { get; set; }

    }

    public enum RoomState
    {
        Waiting, 
        Started,
        Finished,
        hostJoin=9998,
        HostLeft=9999,
    }
}
