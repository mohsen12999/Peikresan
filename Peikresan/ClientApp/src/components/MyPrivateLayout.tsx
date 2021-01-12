import React from "react";
import { connect } from "react-redux";
import { Input, Drawer, Menu, Divider, Badge, Spin } from "antd";
import {
  MenuUnfoldOutlined,
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ShopOutlined,
  ReconciliationOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  FundOutlined,
  ContainerOutlined,
  SketchOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Redirect } from "react-router-dom";

import { ApplicationState } from "../store";
import {
  AdminPath,
  CartPath,
  HomePath,
  Status,
  UserRole,
} from "../shares/Constants";
import { actionCreators } from "../store/Auth";
import "./MyLayout.css";

const { Search } = Input;

const middleCenter = {
  display: "flex",
  alignItems: "center",
  height: "100vh",
  justifyContent: "center",
};

interface IMyPrivateLayoutProps {
  status: Status;
  login: boolean;
  // role?: string;
  userRole?: string;

  shopCart: number[];

  logout: Function;
}

const MyPrivateLayout: React.FC<IMyPrivateLayoutProps> = ({
  status,
  login,
  userRole,
  shopCart,
  logout,
  children,
}) => {
  React.useEffect(() => {
    // TODO: access data -> at start, status==init
  }, []);

  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const showDrawerBtn = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  let location = useLocation();

  return status == Status.INIT ||
    (status == Status.LOADING && login == false) ? (
    <div style={middleCenter}>
      <h1>در حال بارگزاری</h1>
    </div>
  ) : login == false ? (
    <Redirect to={AdminPath.Admin} />
  ) : (
    <div>
      <div className="my-header">
        <Search
          placeholder="جستجو در پیک‌رسان"
          onSearch={(value) => console.log(value)}
          className="search-input"
        />

        <MenuUnfoldOutlined className="open-color" onClick={showDrawerBtn} />

        <Link to={CartPath.Cart} className="show-cart-btn">
          <Badge count={shopCart.filter((c) => c > 0).length}>
            <ShoppingCartOutlined />
          </Badge>
        </Link>
      </div>
      <Drawer
        title="منو"
        placement="right"
        closable={false}
        onClose={onCloseDrawer}
        visible={drawerVisible}
        className="drawer-padding"
      >
        <Menu selectedKeys={[location.pathname]}>
          <Menu.Item key={AdminPath.Dashboard}>
            <DashboardOutlined />
            <Link to={AdminPath.Dashboard}>داشبورد</Link>
          </Menu.Item>

          {userRole && userRole.toUpperCase() == UserRole.ADMIN && (
            <React.Fragment>
              <Divider dashed />

              <Menu.Item key={AdminPath.Categories}>
                <AppstoreOutlined />
                <Link to={AdminPath.Categories}>مدیریت دسته‌بندی</Link>
              </Menu.Item>

              <Menu.Item key={AdminPath.Products}>
                <ReconciliationOutlined />
                <Link to={AdminPath.Products}>مدیریت محصولات</Link>
              </Menu.Item>

              <Divider dashed />

              <Menu.Item key={AdminPath.AwesomeProducts}>
                <SketchOutlined />
                <Link to={AdminPath.AwesomeProducts}>محصولات شگفت‌انگیز</Link>
              </Menu.Item>

              <Menu.Item key={AdminPath.Sliders}>
                <FundOutlined />
                <Link to={AdminPath.Sliders}>مدیریت اسلایدرها</Link>
              </Menu.Item>

              <Menu.Item key={AdminPath.Banners}>
                <AppstoreOutlined />
                <Link to={AdminPath.Banners}>مدیریت بنرها</Link>
              </Menu.Item>

              <Divider dashed />

              <Menu.Item key={AdminPath.Users}>
                <UsergroupAddOutlined />
                <Link to={AdminPath.Users}>لیست کاربرها</Link>
              </Menu.Item>

              <Menu.Item key={AdminPath.Orders}>
                <ShopOutlined />
                <Link to={AdminPath.Orders}>سفارش‌ها</Link>
              </Menu.Item>
            </React.Fragment>
          )}

          {userRole && userRole.toUpperCase() == UserRole.SELLER && (
            <React.Fragment>
              <Menu.Item key={AdminPath.SellerProducts}>
                <ShopOutlined />
                <Link to={AdminPath.SellerProducts}>محصولات شما</Link>
              </Menu.Item>
              <Menu.Item key={AdminPath.SellerOrders}>
                <ShopOutlined />
                <Link to={AdminPath.SellerOrders}>سفارش‌های شما</Link>
              </Menu.Item>
            </React.Fragment>
          )}

          {userRole && userRole.toUpperCase() == UserRole.DELIVERY && (
            <React.Fragment>
              <Menu.Item key={AdminPath.DeliverOrders}>
                <ShopOutlined />
                <Link to={AdminPath.DeliverOrders}>سفارش‌های شما</Link>
              </Menu.Item>
            </React.Fragment>
          )}

          <Menu.Item key={AdminPath.Factors}>
            <ContainerOutlined />
            <Link to={AdminPath.Factors}>فاکتورها</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item>
            <LogoutOutlined />
            <a href="#" onClick={() => logout()}>
              خروج
            </a>
          </Menu.Item>
        </Menu>
      </Drawer>

      <main
        className="main-layout"
        style={{ minHeight: window.innerHeight - 102 + "px" }}
      >
        <Spin spinning={status == Status.LOADING} tip="در حال بارگزاری ...">
          {children}
        </Spin>
      </main>
      <footer className="layout-footer">اینماد</footer>

      <div className="bottom-menu">
        <Menu mode="horizontal" selectedKeys={[location.pathname]}>
          <Menu.Item key={HomePath.Home}>
            <Link to={HomePath.Home}>
              <HomeOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={CartPath.Cart}>
              <Badge count={shopCart.filter((c) => c > 0).length}>
                <ShoppingCartOutlined />
              </Badge>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={CartPath.Cart}>
              <DollarOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={HomePath.Categories}>
              <AppstoreOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={HomePath.Profile}>
              <UserOutlined />
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  status: state.auth ? state.auth.status : Status.IDLE,
  login: state.auth ? state.auth.login : false,
  userRole: state.auth ? state.auth.role : undefined,

  shopCart: state.shopCart ? state.shopCart.shopCart : [],
});

const mapDispatchToProps = {
  logout: actionCreators.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPrivateLayout);
