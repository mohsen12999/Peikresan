import React from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Input, Space, Button, Select, message } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IRole, IUser } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, AdminDataUrl, LOGIN_URL } from "../../shares/URLs";
import { AdminPath, Status } from "../../shares/Constants";

const { Option } = Select;

interface IUserProps {
  users: IUser[];
  status: Status;
  roles: IRole[];

  AddOrChangeElement: Function;
  ResetStatus: Function;
}

interface IParamTypes {
  id: string;
}

const User: React.FC<IUserProps> = ({
  users,
  status,
  roles,

  AddOrChangeElement,
  ResetStatus,
}) => {
  const { id } = useParams<IParamTypes>();

  React.useEffect(() => {
    if (status == Status.SUCCEEDED) {
      const history = useHistory();
      history.push(AdminPath.Categories);
      message.success("با موفقیت ذخیره شد.");
    } else if (status == Status.FAILED) {
      message.error("اشکال در ذخیره");
    }
    return ResetStatus();
  }, [status]);

  const [userName, setUserName] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [roleId, setRoleId] = React.useState<string>();
  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [mobile, setMobile] = React.useState<string>();
  const [address, setAddress] = React.useState<string>();

  const validateInputs = () =>
    userName &&
    userName.length > 1 &&
    email &&
    email.length > 1 &&
    password &&
    password.length > 1;

  if (id !== undefined) {
    const user = users.find((u) => u.id === id);
    if (user !== undefined && userName === undefined) {
      setUserName(user.userName);
      setEmail(user.email);
      setPassword(user.password);
      setRoleId(user.roleId);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setMobile(user.mobile);
      setAddress(user.Address);
    }
  }

  const sendData = () => {
    if (!validateInputs() || status == Status.LOADING) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("roleId", roleId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("mobile", mobile);
    formData.append("address", address);

    AddOrChangeElement(
      AdminDataUrl.ADD_CHANGE_USER_URL,
      AdminDataModel.Users,
      formData
    );
  };

  return (
    <MyPrivateLayout>
      <div className="admin-container">
        <h1>کاربر</h1>
        <Space direction="vertical">
          <Input
            className="input-style"
            placeholder="نام"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <Input
            className="input-style"
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
            placeholder="آدرس"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />

          <Input
            className="input-style"
            placeholder="نام کاربری"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <Input
            className="input-style"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input.Password
            className="input-style"
            placeholder="رمزعبور"
            value={password}
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

          <Select
            className="input-style"
            onChange={(value) => {
              setRoleId(String(value));
            }}
          >
            {roles.map((role) => (
              <Option value={role.id}>
                {role.description && role.description != ""
                  ? role.description
                  : role.name}
              </Option>
            ))}
          </Select>

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
  users: state.auth?.users ?? [],
  roles: state.auth?.roles ?? [],
  status: state.auth?.status ?? Status.INIT,
});

const mapDispatchToProps = {
  AddOrChangeElement: actionCreators.addOrChangeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
