import React from "react";
import { connect } from "react-redux";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { ProductCount } from "../shares/Functions";
import { actionCreators } from "../store/ShopCart";

import "./ChangeableProductCount.css";

interface IChangeableProductCountProps {
  id: number;
  count: number;
  max: number;
  soldByWeight: boolean;
  minWeight: number;
  AddProduct: Function;
  RemoveProduct: Function;
}

const ChangeableProductCount: React.FC<IChangeableProductCountProps> = ({
  id,
  count,
  max,
  soldByWeight,
  minWeight,
  AddProduct,
  RemoveProduct,
}) => (
  <div className="product-span-count">
    <PlusCircleOutlined
      translate
      className={count === max ? "add-product-btn disabled" : "add-product-btn"}
      onClick={() => AddProduct(id, max)}
    />
    <span className="persian-number count-span">
      {ProductCount(count, soldByWeight, minWeight)}
    </span>
    <MinusCircleOutlined
      translate
      className={
        Number(count) === 0
          ? "remove-product-btn disabled"
          : "remove-product-btn"
      }
      onClick={() => RemoveProduct(id)}
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
