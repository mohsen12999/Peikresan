import React from "react";
import { connect } from "react-redux";
import { Input, Space, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";

import SimpleLayout from "../../components/SimpleLayout";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { Status } from "../../shares/Constants";
import { HomePath } from "../../shares/URLs";

import "./Login.css";

interface ILoginProps {
  status: Status;
  login: boolean;

  TryLogin: Function;
}

const Login: React.FC<ILoginProps> = ({ status, login, TryLogin }) => {
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();

  const validate = () =>
    email && email.length > 3 && password && password.length > 3;

  return login ? (
    <Redirect to={"/admin/dashboard"} />
  ) : (
    <SimpleLayout title="ورود به سایت" subTitle="" backPage={HomePath.Home}>
      <h1 className="login-title">ورود یه سایت</h1>
      <Space direction="vertical" className="login-space">
        <Input
          placeholder="Email"
          prefix={<UserOutlined />}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input.Password
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="primary"
          disabled={!validate() || status === Status.LOADING}
          onClick={() => {
            TryLogin(email, password);
          }}
        >
          ورود به سایت
        </Button>
      </Space>
    </SimpleLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  status: state.auth ? state.auth.status : Status.INIT,
  login: state.auth ? state.auth.login : false,
});

const mapDispatchToProps = {
  TryLogin: actionCreators.tryLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
