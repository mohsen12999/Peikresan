namespace Peikresan.Data.Dto
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Tel { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public string RoleId { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string OpenTimeStr { get; set; }
        public string CloseTimeStr { get; set; }
        public string OpenTime2Str { get; set; }
        public string CloseTime2Str { get; set; }


        public string IdNumber { get; set; }
        public string IdPic { get; set; }

        public string LicenseNumber { get; set; }
        public string LicensePic { get; set; }

        public int StaffNumber { get; set; }
        public string BankNumber { get; set; }

        public string State { get; set; }
        public string City { get; set; }
    }
}
/*
export interface IUser {
  id: string;
  fullName: string;

  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
  Address: string;

  role: string;
  roleId: string;
}
 */
