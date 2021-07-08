namespace Peikresan.Data.Dto
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Img { get; set; }
        public int ParentId { get; set; }
    }
    //public record CategoryDto(int Id, string Title, string Description, string Img, int ParentId);
}
