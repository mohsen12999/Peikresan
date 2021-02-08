import * as React from "react";
import { Route, Switch } from "react-router";
import { ConfigProvider } from "antd";

import { HomePath, CartPath, AdminPath } from "./shares/URLs";

import Home from "./pages/home/Home";
import About from "./pages/home/About";
import Addresses from "./pages/home/Addresses";
import CategoriesList from "./pages/home/CategoriesList";
import Category from "./pages/home/Category";
import Coin from "./pages/home/Coin";
import Factors from "./pages/home/Factors";
import FAQ from "./pages/home/FAQ";
import Product from "./pages/home/Product";
import Search from "./pages/home/Search";

import Cart from "./pages/cart/Cart";
import DeliverAddress from "./pages/cart/DeliverAddress";
import DeliverTime from "./pages/cart/DeliverTime";
import Factor from "./pages/cart/Factor";
import Comeback from "./pages/cart/Comeback";
import DeliverMap from "./pages/cart/DeliverMap";
import AddressesList from "./pages/cart/AddressesList";
import NewAddress from "./pages/cart/NewAddress";
import CompleteAddress from "./pages/cart/CompleteAddress";

import Login from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategories from "./pages/admin/Categories";
import AdminCategory from "./pages/admin/Category";
import AdminProducts from "./pages/admin/Products";
import AdminProduct from "./pages/admin/Product";
import AdminBanners from "./pages/admin/Banners";
import AdminBanner from "./pages/admin/Banner";
import AwesomeProducts from "./pages/admin/AwesomeProducts";
import AwesomeProduct from "./pages/admin/AwesomeProduct";
import AdminSliders from "./pages/admin/Sliders";
import AdminSlider from "./pages/admin/Slider";
import AdminUsers from "./pages/admin/Users";
import AdminUser from "./pages/admin/User";
import SellerProducts from "./pages/admin/SellerProducts";
import SellerProduct from "./pages/admin/SellerProduct";
import AdminFactors from "./pages/admin/Factors";
import Orders from "./pages/admin/Orders";
import SellerOrders from "./pages/admin/SellerOrders";
import DeliverOrders from "./pages/admin/DeliverOrders";

import "./custom.css";

export default () => (
  <ConfigProvider direction="rtl">
    <Switch>
      <Route exact path={HomePath.Home} component={Home} />
      <Route path={HomePath.About} component={About} />
      <Route path={HomePath.Addresses} component={Addresses} />
      <Route path={HomePath.Categories} component={CategoriesList} />
      <Route path={HomePath.Category + ":id"} component={Category} />
      <Route path={HomePath.Coin} component={Coin} />
      <Route path={HomePath.Factors} component={Factors} />
      <Route path={HomePath.FAQ} component={FAQ} />
      <Route path={HomePath.Product + ":id"} component={Product} />
      <Route path={HomePath.Search + ":text?"} component={Search} />

      <Route path={CartPath.Cart} component={Cart} />
      <Route path={CartPath.Map} component={DeliverMap} />
      <Route path={CartPath.DeliverAddress} component={DeliverAddress} />
      <Route path={CartPath.DeliverTime} component={DeliverTime} />
      <Route path={CartPath.Factor} component={Factor} />
      <Route path={CartPath.Comeback + ":id/"} component={Comeback} />
      <Route path={CartPath.AddressesList} component={AddressesList} />
      <Route path={CartPath.NewAddress} component={NewAddress} />
      <Route path={CartPath.CompleteAddress} component={CompleteAddress} />

      <Route exact path={AdminPath.Login} component={Login} />
      <Route path={AdminPath.Dashboard} component={AdminDashboard} />
      <Route path={AdminPath.Categories} component={AdminCategories} />
      <Route path={AdminPath.Category + ":id?"} component={AdminCategory} />
      <Route path={AdminPath.Products} component={AdminProducts} />
      <Route path={AdminPath.Product + ":id?"} component={AdminProduct} />
      <Route path={AdminPath.Banners} component={AdminBanners} />
      <Route path={AdminPath.Banner + ":id?"} component={AdminBanner} />
      <Route path={AdminPath.AwesomeProducts} component={AwesomeProducts} />
      <Route
        path={AdminPath.AwesomeProduct + ":id?"}
        component={AwesomeProduct}
      />
      <Route path={AdminPath.Sliders} component={AdminSliders} />
      <Route path={AdminPath.Slider + "/:id?"} component={AdminSlider} />
      <Route path={AdminPath.Users} component={AdminUsers} />
      <Route path={AdminPath.User + ":id?"} component={AdminUser} />
      <Route path={AdminPath.SellerProducts} component={SellerProducts} />
      <Route
        path={AdminPath.SellerProduct + ":id?"}
        component={SellerProduct}
      />
      <Route path={AdminPath.Orders} component={Orders} />
      <Route path={AdminPath.SellerOrders} component={SellerOrders} />
      <Route path={AdminPath.DeliverOrders} component={DeliverOrders} />

      <Route path={AdminPath.Factors} component={AdminFactors} />
    </Switch>
  </ConfigProvider>
);
