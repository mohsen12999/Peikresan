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
import { UserRoles } from "../shares/Constants";
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
  init: boolean;
  loading: boolean;
  login: boolean;
  role?: string;
  userRole?: string;

  shopCart: number[];

  logout: Function;
}

const MyPrivateLayout: React.FC<IMyPrivateLayoutProps> = ({
  init,
  loading,
  login,
  userRole,
  shopCart,
  logout,
  children,
}) => {
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const showDrawerBtn = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  let location = useLocation();

  return init || loading ? (
    <div style={middleCenter}>
      <h1>درحال بارگذاری</h1>
    </div>
  ) : login == false ? (
    <Redirect to={"/admin"} />
  ) : (
    <div>
      <div className="my-header">
        <Search
          placeholder="جستجو در پیک‌رسان"
          onSearch={(value) => console.log(value)}
          className="search-input"
        />

        <MenuUnfoldOutlined className="open-color" onClick={showDrawerBtn} />

        <Link to="/cart" className="show-cart-btn">
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
          <Menu.Item key="/admin/dashboard">
            <DashboardOutlined />
            <Link to="/admin/dashboard">داشبورد</Link>
          </Menu.Item>

          {userRole && userRole.toUpperCase() == UserRoles.ADMIN && (
            <React.Fragment>
              <Divider dashed />

              <Menu.Item key="/admin/categories">
                <AppstoreOutlined />
                <Link to="/admin/categories">مدیریت دسته‌بندی</Link>
              </Menu.Item>

              <Menu.Item key="/admin/products">
                <ReconciliationOutlined />
                <Link to="/admin/products">مدیریت محصولات</Link>
              </Menu.Item>

              <Divider dashed />

              <Menu.Item key="/admin/awesome_products">
                <SketchOutlined />
                <Link to="/admin/awesome_products">محصولات شگفت‌انگیز</Link>
              </Menu.Item>

              <Menu.Item key="/admin/sliders">
                <FundOutlined />
                <Link to="/admin/sliders">مدیریت اسلایدرها</Link>
              </Menu.Item>

              <Menu.Item key="/admin/banners">
                <AppstoreOutlined />
                <Link to="/admin/banners">مدیریت بنرها</Link>
              </Menu.Item>

              <Divider dashed />

              <Menu.Item key="/admin/users">
                <UsergroupAddOutlined />
                <Link to="/admin/users">لیست کاربرها</Link>
              </Menu.Item>

              <Menu.Item key="/admin/active-orders">
                <ShopOutlined />
                <Link to="/admin/active-orders">سفارش های فعال</Link>
              </Menu.Item>
            </React.Fragment>
          )}

          {userRole && userRole.toUpperCase() == UserRoles.SELLER && (
            <React.Fragment>
              <Menu.Item key="/admin/seller-Products">
                <ShopOutlined />
                <Link to="/admin/seller-Products">محصولات شما</Link>
              </Menu.Item>
              <Menu.Item key="/admin/seller-orders">
                <ShopOutlined />
                <Link to="/admin/seller-orders">سفارش‌های شما</Link>
              </Menu.Item>
            </React.Fragment>
          )}

          {userRole && userRole.toUpperCase() == UserRoles.DELIVERY && (
            <React.Fragment>
              <Menu.Item key="/admin/deliver-orders">
                <ShopOutlined />
                <Link to="/admin/deliver-orders">سفارش‌های شما</Link>
              </Menu.Item>
            </React.Fragment>
          )}

          {/* <Menu.Item key="/admin/orders">
                  <ShopOutlined />
                  <Link to="/admin/orders">سفارش ها</Link>
                </Menu.Item> */}

          <Menu.Item key="/admin/factors">
            <ContainerOutlined />
            <Link to="/admin/factors">فاکتورها</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item key="/admin/logout">
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
        <Spin spinning={loading} tip="در حال بارگزاری ...">
          {children}
        </Spin>
      </main>
      <footer className="layout-footer">اینماد</footer>

      <div className="bottom-menu">
        <Menu mode="horizontal" selectedKeys={[location.pathname]}>
          <Menu.Item key="/">
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/cart">
              <Badge count={shopCart.filter((c) => c > 0).length}>
                <ShoppingCartOutlined />
              </Badge>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/coin">
              <DollarOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/categories">
              <AppstoreOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/profile">
              <UserOutlined />
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  init: state.auth ? state.auth.init : false,
  loading: state.auth ? state.auth.loading : false,
  login: state.auth ? state.auth.login : false,
  userRole: state.auth ? state.auth.role : undefined,

  shopCart: state.shopCart ? state.shopCart.shopCart : [],
});

const mapDispatchToProps = {
  logout: actionCreators.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPrivateLayout);
