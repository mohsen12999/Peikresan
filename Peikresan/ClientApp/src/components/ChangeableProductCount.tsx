import React from "react";
import { connect } from "react-redux";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { ProductCount } from "../shares/Functions";
import { actionCreators } from "../store/ShopCart";

import "./ChangeableProductCount.css";
import { IShopCartProduct } from "../shares/Interfaces";

interface IChangeableProductCountProps {
  product: IShopCartProduct;
  AddProduct: Function;
  RemoveProduct: Function;
}

const ChangeableProductCount: React.FC<IChangeableProductCountProps> = ({
  product,
  AddProduct,
  RemoveProduct,
}) => (
  <div className="product-span-count">
    <PlusCircleOutlined
      className={
        product.count === product.max
          ? "add-product-btn disabled"
          : "add-product-btn"
      }
      onClick={() => AddProduct(product.id, product.max)}
    />
    <span className="persian-number count-span">
      {ProductCount(product.count, product.soldByWeight, product.minWeight)}
    </span>
    <MinusCircleOutlined
      className={
        Number(product.count) === 0
          ? "remove-product-btn disabled"
          : "remove-product-btn"
      }
      onClick={() => RemoveProduct(product.id)}
    />
  </div>
);

const mapStateToProps = () => {};

const mapDispatchToProps = {
  AddProduct: actionCreators.addProduct,
  RemoveProduct: actionCreators.removeProduct,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeableProductCount);
