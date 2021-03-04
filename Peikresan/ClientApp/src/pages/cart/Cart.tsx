import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "antd";

import CartItems from "../../components/CartItems";
import MyLayout from "../../components/MyLayout";
import { ApplicationState } from "../../store";
import { HomePath } from "../../shares/URLs";

import "./Cart.css";

interface ICartProps {
  shopCart: number[];
}

const Cart: React.FC<ICartProps> = ({ shopCart }) => (
  <MyLayout>
    <h1>سبد خرید</h1>
    {shopCart.filter((sc) => sc > 0).length === 0 ? (
      <div>
        <h2>سبد خرید خالی هست</h2>
        <Link to={HomePath.Home}>
          <Button type="primary">بازگشت به صفحه اصلی</Button>
        </Link>
      </div>
    ) : (
      <CartItems />
    )}
  </MyLayout>
);

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
