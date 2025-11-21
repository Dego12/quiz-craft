namespace backend.DTO
{
    public class AnswerDTO
    {
        public Guid QuestionId { get; set; }
        public Guid AnswerId { get; set; }
        public int Time { get; set; }
    }
}
