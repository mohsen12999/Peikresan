import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Input, Space, Button, Select, InputNumber } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IRole, IUser } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminDataUrl, AdminPath } from "../../shares/URLs";
import { AdminDataModel, Status, UserRole } from "../../shares/Constants";
import { useHistory } from "react-router-dom";

const { Option } = Select;

interface IUserProps {
  users: IUser[];
  status: Status;
  roles: IRole[];

  AddOrChangeElement: Function;
}

interface IParamTypes {
  id: string;
}

const User: React.FC<IUserProps> = ({
  users,
  status,
  roles,
  AddOrChangeElement,
}) => {
  const history = useHistory();
  const { id } = useParams<IParamTypes>();

  const [userName, setUserName] = React.useState<string>();
  // const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [roleId, setRoleId] = React.useState<string>();

  const [title, setTitle] = React.useState<string>();
  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [mobile, setMobile] = React.useState<string>();
  const [tel, setTel] = React.useState<string>();
  const [address, setAddress] = React.useState<string>();

  const [latitude, setLatitude] = React.useState<number>();
  const [longitude, setLongitude] = React.useState<number>();

  const [idNumber, setIdNumber] = React.useState<string>();
  const [IdPicFile, setIdPicFile] = React.useState<File>();

  const [licenseNumber, setLicenseNumber] = React.useState<string>();
  const [licensePicFile, setLicensePicFile] = React.useState<File>();

  const [staffNumber, setStaffNumber] = React.useState<number>();
  const [bankNumber, setBankNumber] = React.useState<string>();

  const [state, setState] = React.useState<string>();
  const [city, setCity] = React.useState<string>();

  const [role, setRole] = React.useState<string>();

  const validateInputs = () =>
    userName &&
    userName.length > 1 &&
    mobile &&
    mobile.length > 1 &&
    // email &&
    // email.length > 1 &&
    password &&
    password.length > 1;

  React.useEffect(() => {
    if (id !== undefined) {
      const user = users.find((u) => u.id === id);
      if (user !== undefined && userName === undefined) {
        console.log("load user ", user);

        setUserName(user.userName);
        // setEmail(user.email);
        setPassword(user.password);
        setRoleId(user.roleId);
        setTitle(user.title);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setMobile(user.mobile);
        setTel(user.tel);
        setAddress(user.address);
        setLatitude(user.latitude);
        setLongitude(user.longitude);
        setTel(user.tel);
        setAddress(user.address);
        setIdNumber(user.idNumber);
        setLicenseNumber(user.licenseNumber);
        setStaffNumber(Number(user.staffNumber));
        setBankNumber(user.bankNumber);
        setState(user.state);
        setCity(user.city);

        setRole(user.role);
      }
    }
  }, []);

  React.useEffect(() => {
    const roleObj = roles.find((r) => r.id === roleId);
    if (roleObj) {
      setRole(roleObj.name.toUpperCase());
      console.log("current role: ", roleObj.name);
    }
  }, [roleId]);

  const sendData = () => {
    if (!validateInputs() || status === Status.LOADING) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("userName", userName ? userName : "");
    // formData.append("email", email ? email : "");
    formData.append("password", password ? password : "");
    formData.append("roleId", roleId ? roleId : "");
    formData.append("title", title ? title : "");
    formData.append("firstName", firstName ? firstName : "");
    formData.append("lastName", lastName ? lastName : "");
    formData.append("mobile", mobile ? mobile : "");
    formData.append("tel", tel ? tel : "");
    formData.append("address", address ? address : "");
    formData.append("latitude", latitude ? String(latitude) : "");
    formData.append("longitude", longitude ? String(longitude) : "");

    formData.append("idNumber", idNumber ? idNumber : "");
    formData.append("IdPicFile", IdPicFile ? IdPicFile : "");
    formData.append("licenseNumber", licenseNumber ? licenseNumber : "");
    formData.append("licensePicFile", licensePicFile ? licensePicFile : "");
    formData.append("staffNumber", staffNumber ? String(staffNumber) : "");
    formData.append("bankNumber", bankNumber ? bankNumber : "");
    formData.append("state", state ? state : "");
    formData.append("city", city ? city : "");

    AddOrChangeElement(
      AdminDataUrl.ADD_CHANGE_USER_URL,
      AdminDataModel.Users,
      formData,
      AdminPath.Users,
      history
    );
  };

  return (
    <MyPrivateLayout>
      <div className="admin-container">
        <h1>کاربر</h1>

        <Space direction="vertical">
          <Select
            className="input-style"
            onChange={(value) => {
              setRoleId(String(value));
            }}
          >
            {roles.map((role) => (
              <Option value={role.id}>
                {role.description && role.description !== ""
                  ? role.description
                  : role.name}
              </Option>
            ))}
          </Select>

          <Input
            addonBefore="نام کاربری - انگلیسی"
            className="input-style"
            placeholder="نام کاربری - انگلیسی"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />

          <Input
            className="input-style"
            addonBefore="عنوان"
            placeholder="عنوان"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />

          <Input
            className="input-style"
            addonBefore="نام"
            placeholder="نام"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />

          <Input
            className="input-style"
            addonBefore="نام خانوادگی"
            placeholder="نام خانوادگی"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <Input
            className="input-style"
            placeholder="موبایل"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
            }}
          />
          <Input
            className="input-style"
            placeholder="تلفن"
            value={tel}
            onChange={(e) => {
              setTel(e.target.value);
            }}
          />
          <Input
            className="input-style"
            addonBefore="آدرس"
            placeholder="آدرس"
            autoComplete="off"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />

          {/* <Input
            className="input-style"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          /> */}

          <Input.Password
            className="input-style"
            addonBefore="رمزعبور"
            placeholder="رمزعبور"
            value={password}
            autoComplete="off"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          {/* <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="منطقه"
            optionFilterProp="children"
            onChange={(value) => setDistrict(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {context.districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select> */}

          <InputNumber
            className="input-style"
            value={latitude}
            placeholder="طول جغرافیایی"
            onChange={(value) => {
              setLatitude(Number(value));
            }}
          />
          <InputNumber
            className="input-style"
            value={longitude}
            placeholder="عرض جغرافیایی"
            onChange={(value) => {
              setLongitude(Number(value));
            }}
          />

          {(role == UserRole.SELLER || role == UserRole.DELIVERY) && (
            <React.Fragment>
              <Input
                className="input-style"
                addonBefore="کد ملی"
                placeholder="کد ملی"
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value);
                }}
              />

              <input
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const file = files[0];
                    setIdPicFile(file);
                  }
                }}
              />

              <Input
                className="input-style"
                addonBefore="شماره جواز"
                placeholder="شماره جواز"
                value={licenseNumber}
                onChange={(e) => {
                  setLicenseNumber(e.target.value);
                }}
              />

              <input
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const file = files[0];
                    setLicensePicFile(file);
                  }
                }}
              />

              <Input
                className="input-style"
                addonBefore="شماره شبا"
                placeholder="شماره شبا"
                value={bankNumber}
                onChange={(e) => {
                  setBankNumber(e.target.value);
                }}
              />

              <Input
                className="input-style"
                addonBefore="استان"
                placeholder="استان"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
              />

              <Input
                className="input-style"
                addonBefore="شهر"
                placeholder="شهر"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
            </React.Fragment>
          )}

          {role == UserRole.DELIVERY && (
            <InputNumber
              className="input-style"
              value={staffNumber}
              placeholder="تعداد پرسنل"
              onChange={(value) => {
                setStaffNumber(Number(value));
              }}
            />
          )}

          <Button
            type="primary"
            disabled={!validateInputs()}
            onClick={sendData}
          >
            ذخیره
          </Button>
        </Space>
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  users: state.auth ? state.auth.users : [],
  roles: state.auth ? state.auth.roles : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  AddOrChangeElement: actionCreators.addOrChangeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
