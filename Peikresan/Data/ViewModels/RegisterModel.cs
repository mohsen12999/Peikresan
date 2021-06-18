namespace Peikresan.Data.ViewModels
{
    public class RegisterModel
    {
        public string Id { get; set; }
        public string Username { get; set; }
        // public string Email { get; set; }
        public string Password { get; set; }

        public string RoleId { get; set; }

        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Mobile { get; set; }
        public string Address { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
