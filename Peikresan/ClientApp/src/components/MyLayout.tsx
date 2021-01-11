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
import { Status } from "../shares/Constants";

const { Search } = Input;

interface IMyLayoutProps {
  shopCart: number[];
  loadingDataStatus: Status;
}

const MyLayout: React.FC<IMyLayoutProps> = ({
  shopCart,
  loadingDataStatus,
  children,
}) => {
  // TODO: Read Data from server
  // React.useEffect(() => {
  //   if (status === 'idle') {
  //     dispatch(fetchPosts())
  //   }
  // }, [postStatus, dispatch])

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
          <Menu.Item key="/">
            <HomeOutlined />
            <Link to="/">خانه</Link>
          </Menu.Item>
          <Menu.Item key="/categories">
            <AppstoreOutlined />
            <Link to="/categories">لیست دسته بندی محصولات</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item key="/cart">
            <ShoppingCartOutlined />
            <Link to="/cart">سبد خرید</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item key="/address">
            <BranchesOutlined />
            <Link to="/address">آدرس های منتخب</Link>
          </Menu.Item>
          <Menu.Item key="/factors">
            <MenuOutlined />
            <Link to="/factors">سوابق سفارش</Link>
          </Menu.Item>

          <Divider dashed />
          <Menu.Item key="/instagram">
            <InstagramOutlined />
            <Link to="https://instagram.com">اینستاگرام</Link>
          </Menu.Item>

          <Menu.Item key="/faq">
            <WechatOutlined />
            <Link to="/faq">سوالات متداول</Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <SolutionOutlined />
            <Link to="/about">درباره ما</Link>
          </Menu.Item>
        </Menu>
      </Drawer>

      <main
        className="main-layout"
        style={{ minHeight: window.innerHeight - 102 + "px" }}
      >
        <Spin
          spinning={loadingDataStatus == Status.LOADING}
          tip="در حال بارگزاری ..."
        >
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
  loadingDataStatus: state.data ? state.data.status : Status.IDLE,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyLayout);
