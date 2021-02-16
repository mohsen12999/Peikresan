using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Peikresan.Data.ClientModels
{
    public class ClientUser
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public string RoleId { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
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
