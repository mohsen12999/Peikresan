import React from "react";
import { connect } from "react-redux";

import CartItems from "../../components/CartItems";
import MyLayout from "../../components/MyLayout";
import { ApplicationState } from "../../store";

import "./Cart.css";

interface ICartProps {
  shopCart: number[];
}

const Cart: React.FC<ICartProps> = ({ shopCart }) => (
  <MyLayout>
    <h1>سبد خرید</h1>
    {shopCart.filter((sc) => sc > 0).length === 0 ? (
      <h2>سبد خرید خالی هست</h2>
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
