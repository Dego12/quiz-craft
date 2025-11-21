namespace backend.DTO
{
    public class AuthResultDTO
    {
        public bool Success { get; set; }

        public List<string>? errors { get; set; }

        public string? AccessToken { get; set; }

        public static AuthResultDTO FactoryMethod(List<string> errors, string? accessToken)
        {
            return new AuthResultDTO
            {
                Success = (!errors.Any()),
                errors = errors,
                AccessToken = accessToken
            };
        }
    }
}
