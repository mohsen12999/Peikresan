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
import { HomePath, CartPath } from "../shares/URLs";
import { actionCreators } from "../store/Data";

const { Search } = Input;

interface IMyLayoutProps {
  shopCart: number[];
  loadingDataStatus: Status;

  LoadData: Function;
}

const MyLayout: React.FC<IMyLayoutProps> = ({
  shopCart,
  loadingDataStatus,
  children,
  LoadData,
}) => {
  if (loadingDataStatus === Status.INIT) {
    LoadData();
  }

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
          <Menu.Item key={HomePath.Home}>
            <HomeOutlined />
            <Link to={HomePath.Home}>خانه</Link>
          </Menu.Item>
          <Menu.Item key={HomePath.Categories}>
            <AppstoreOutlined />
            <Link to={HomePath.Categories}>لیست دسته بندی محصولات</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item key={CartPath.Cart}>
            <ShoppingCartOutlined />
            <Link to={CartPath.Cart}>سبد خرید</Link>
          </Menu.Item>

          <Divider dashed />

          <Menu.Item key={HomePath.Addresses}>
            <BranchesOutlined />
            <Link to={HomePath.Addresses}>آدرس های منتخب</Link>
          </Menu.Item>
          <Menu.Item key={HomePath.Factors}>
            <MenuOutlined />
            <Link to={HomePath.Factors}>سوابق سفارش</Link>
          </Menu.Item>

          <Divider dashed />
          <Menu.Item key="/instagram">
            <InstagramOutlined />
            <Link to="https://instagram.com">اینستاگرام</Link>
          </Menu.Item>

          <Menu.Item key={HomePath.FAQ}>
            <WechatOutlined />
            <Link to={HomePath.FAQ}>سوالات متداول</Link>
          </Menu.Item>
          <Menu.Item key={HomePath.About}>
            <SolutionOutlined />
            <Link to={HomePath.About}>درباره ما</Link>
          </Menu.Item>
        </Menu>
      </Drawer>

      <main
        className="main-layout"
        style={{ minHeight: window.innerHeight - 102 + "px" }}
      >
        <Spin
          spinning={loadingDataStatus === Status.LOADING}
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
          {/* <Menu.Item>
            <Link to={HomePath.Coin}>
              <DollarOutlined />
            </Link>
          </Menu.Item> */}
          <Menu.Item>
            <Link to={HomePath.Profile}>
              <AppstoreOutlined />
            </Link>
          </Menu.Item>
          {/* <Menu.Item>
                <Link to={HomePath.Categories}>
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

const mapDispatchToProps = {
  LoadData: actionCreators.loadData,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLayout);
