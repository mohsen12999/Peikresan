import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { ApplicationState } from "../store";

const middleCenter = {
  display: "flex",
  alignItems: "center",
  height: "100vh",
  justifyContent: "center",
};

interface IPrivateRouteLayoutProps {
  role?: string;
  init: boolean;
  loading: boolean;
  login: boolean;
  userRole?: string;
}

const PrivateRouteLayout: React.FC<IPrivateRouteLayoutProps> = ({
  role,
  children,
  init,
  loading,
  login,
  userRole,
}) =>
  init || loading ? (
    <div style={middleCenter}>
      <h1>درحال بارگذاری</h1>
    </div>
  ) : login && (role == undefined || role == userRole) ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <Redirect to={"/admin"} />
  );

// const PrivateRouteLayout = (props) => (
//   <AppContext.Consumer>
//     {(context) =>
//       context.admin.isAuthenticated &&
//       (props.role == undefined || props.role == context.admin.role) ? (
//         props.children
//       ) : (
//         <Redirect to={"/admin"} />
//       )
//     }
//   </AppContext.Consumer>
// );

const mapStateToProps = (state: ApplicationState) => ({
  init: state.auth ? state.auth.init : false,
  loading: state.auth ? state.auth.loading : false,
  login: state.auth ? state.auth.login : false,
  userRole: state.auth ? state.auth.role : undefined,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRouteLayout);
