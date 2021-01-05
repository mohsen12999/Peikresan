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
import { Link, useLocation } from "react-router-dom";
import PrivateRouteLayout from "./PrivateRouteLayout";

import { ApplicationState } from "../store";
import { UserRoles } from "../shares/Constants";
import "./MyLayout.css";

const { Search } = Input;

interface IMyPrivateLayoutProps {
  role?: string;
  shopCart: number[];
  userRole?: string;
  loading: boolean;
}

const MyPrivateLayout: React.FC<IMyPrivateLayoutProps> = ({
  role,
  shopCart,
  userRole,
  loading,
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

  return (
    <PrivateRouteLayout role={role}>
      <div>
        <div className="my-header">
          <Search
            placeholder="جستجو در پیک‌رسان"
            onSearch={(value) => console.log(value)}
            className="search-input"
          />

          <MenuUnfoldOutlined
            translate
            className="open-color"
            onClick={showDrawerBtn}
          />

          <Link to="/cart" className="show-cart-btn">
            <Badge count={shopCart.filter((c) => c > 0).length}>
              <ShoppingCartOutlined translate />
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
              <DashboardOutlined translate />
              <Link to="/admin/dashboard">داشبورد</Link>
            </Menu.Item>

            {userRole && userRole.toUpperCase() == UserRoles.ADMIN && (
              <React.Fragment>
                <Divider dashed />

                <Menu.Item key="/admin/categories">
                  <AppstoreOutlined translate />
                  <Link to="/admin/categories">مدیریت دسته‌بندی</Link>
                </Menu.Item>

                <Menu.Item key="/admin/products">
                  <ReconciliationOutlined translate />
                  <Link to="/admin/products">مدیریت محصولات</Link>
                </Menu.Item>

                <Divider dashed />

                <Menu.Item key="/admin/awesome_products">
                  <SketchOutlined translate />
                  <Link to="/admin/awesome_products">محصولات شگفت‌انگیز</Link>
                </Menu.Item>

                <Menu.Item key="/admin/sliders">
                  <FundOutlined translate />
                  <Link to="/admin/sliders">مدیریت اسلایدرها</Link>
                </Menu.Item>

                <Menu.Item key="/admin/banners">
                  <AppstoreOutlined translate />
                  <Link to="/admin/banners">مدیریت بنرها</Link>
                </Menu.Item>

                <Divider dashed />

                <Menu.Item key="/admin/users">
                  <UsergroupAddOutlined translate />
                  <Link to="/admin/users">لیست کاربرها</Link>
                </Menu.Item>

                <Menu.Item key="/admin/active-orders">
                  <ShopOutlined translate />
                  <Link to="/admin/active-orders">سفارش های فعال</Link>
                </Menu.Item>
              </React.Fragment>
            )}

            {userRole && userRole.toUpperCase() == UserRoles.SELLER && (
              <React.Fragment>
                <Menu.Item key="/admin/seller-Products">
                  <ShopOutlined translate />
                  <Link to="/admin/seller-Products">محصولات شما</Link>
                </Menu.Item>
                <Menu.Item key="/admin/seller-orders">
                  <ShopOutlined translate />
                  <Link to="/admin/seller-orders">سفارش‌های شما</Link>
                </Menu.Item>
              </React.Fragment>
            )}

            {userRole && userRole.toUpperCase() == UserRoles.DELIVERY && (
              <React.Fragment>
                <Menu.Item key="/admin/deliver-orders">
                  <ShopOutlined translate />
                  <Link to="/admin/deliver-orders">سفارش‌های شما</Link>
                </Menu.Item>
              </React.Fragment>
            )}

            {/* <Menu.Item key="/admin/orders">
                  <ShopOutlined />
                  <Link to="/admin/orders">سفارش ها</Link>
                </Menu.Item> */}

            <Menu.Item key="/admin/factors">
              <ContainerOutlined translate />
              <Link to="/admin/factors">فاکتورها</Link>
            </Menu.Item>

            <Divider dashed />

            <Menu.Item key="/admin/logout">
              <LogoutOutlined translate />
              <Link to="/admin/logout">خروج</Link>
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
                <HomeOutlined translate />
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/cart">
                <Badge count={shopCart.filter((c) => c > 0).length}>
                  <ShoppingCartOutlined translate />
                </Badge>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/coin">
                <DollarOutlined translate />
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/categories">
                <AppstoreOutlined translate />
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/profile">
                <UserOutlined translate />
              </Link>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </PrivateRouteLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
  userRole: state.auth ? state.auth.role : undefined,
  loading: state.auth ? state.auth.loading : false,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyPrivateLayout);
