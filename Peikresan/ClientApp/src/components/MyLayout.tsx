import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input, Drawer, Menu, Divider, Badge, Spin } from "antd";
import {
  MenuUnfoldOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  MenuOutlined,
  WechatOutlined,
  SolutionOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  // UserOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

import Enamad from "./Enamad";

import "./MyLayout.css";
import { ApplicationState } from "../store";

const { Search } = Input;

interface IMyLayoutProps {
  shopCart: number[];
  loadingData: boolean;
}

const MyLayout: React.FC<IMyLayoutProps> = ({
  shopCart,
  loadingData,
  children,
}) => {
  let history = useHistory();
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const showDrawerBtn = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  let location = useLocation();

  return (
    <div>
      <div className="my-header">
        <Search
          placeholder="جستجو در پیک‌رسان"
          onSearch={(value) => history.push("/search/" + value)}
          className="search-input"
        />
        {/* <Button
              type="primary"
              onClick={showDrawerBtn}
              className="show-drawer-btn"
            >
              {React.createElement(
                drawerVisible ? MenuFoldOutlined : MenuUnfoldOutlined
              )}
            </Button> */}

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
          <Menu.Item key="/">
            <HomeOutlined translate />
            <Link to="/">خانه</Link>
          </Menu.Item>
          <Menu.Item key="/categories">
            <AppstoreOutlined translate />
            <Link to="/categories">لیست دسته بندی محصولات</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item key="/cart">
            <ShoppingCartOutlined translate />
            <Link to="/cart">سبد خرید</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item key="/address">
            <BranchesOutlined translate />
            <Link to="/address">آدرس های منتخب</Link>
          </Menu.Item>
          <Menu.Item key="/factors">
            <MenuOutlined translate />
            <Link to="/factors">سوابق سفارش</Link>
          </Menu.Item>

          <Divider dashed />
          <Menu.Item key="/instagram">
            <InstagramOutlined translate />
            <Link to="https://instagram.com">اینستاگرام</Link>
          </Menu.Item>

          <Menu.Item key="/faq">
            <WechatOutlined translate />
            <Link to="/faq">سوالات متداول</Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <SolutionOutlined translate />
            <Link to="/about">درباره ما</Link>
          </Menu.Item>
        </Menu>
      </Drawer>

      <main
        className="main-layout"
        style={{ minHeight: window.innerHeight - 102 + "px" }}
      >
        <Spin spinning={loadingData} tip="در حال بارگزاری ...">
          {children}
        </Spin>
      </main>
      <footer className="layout-footer">
        <Enamad />
      </footer>

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
          {/* <Menu.Item>
                <Link to="/profile">
                  <UserOutlined />
                </Link>
              </Menu.Item> */}
        </Menu>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
  loadingData: state.data ? state.data.loading : false,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyLayout);
