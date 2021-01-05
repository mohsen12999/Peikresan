import React from "react";
import { Card, Button } from "antd";
import { connect } from "react-redux";

import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import "./ProductThumbnail.css";
import { IProduct } from "../shares/Interfaces";
import { ProductCount } from "../shares/Functions";
import { actionCreators } from "../store/ShopCart";
import { ApplicationState } from "../store";

const { Meta } = Card;

interface IProductThumbnailProps {
  product: IProduct;
  AddProduct: Function;
  RemoveProduct: Function;
  shopCart: number[];
}
const ProductThumbnail: React.FC<IProductThumbnailProps> = ({
  product,
  AddProduct,
  RemoveProduct,
  shopCart,
}) => (
  <Card
    className="product-thumb-card"
    hoverable
    cover={
      <Link to={"/product/" + product.id}>
        <img
          className="product-image-thumb"
          alt={"تصویر" + product.title}
          src={
            product.img && product.img !== ""
              ? product.img
              : "/img/product/product0.jpg"
          }
        />
      </Link>
    }
    actions={
      shopCart[product.id] && shopCart[product.id] !== 0
        ? [
            <PlusCircleOutlined
              translate
              style={{
                color:
                  shopCart[product.id] === product.max ? "lightgray" : "green",
              }}
              onClick={() => AddProduct(product.id, product.max)}
            />,
            <span style={{ color: "black", fontWeight: "bold" }}>
              {ProductCount(
                shopCart[product.id],
                product.soldByWeight,
                product.minWeight
              )}
            </span>,
            <MinusCircleOutlined
              translate
              style={{ color: "red" }}
              onClick={() => RemoveProduct(product.id)}
            />,
          ]
        : [
            <Button
              type="primary"
              className="buy-btn"
              icon={<ShoppingCartOutlined translate />}
              onClick={() => AddProduct(product.id, product.max)}
            >
              خرید
            </Button>,
          ]
    }
  >
    <Meta
      className="persian-number"
      title={product.title}
      description={product.price + " تومان"}
    />
  </Card>
);

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
});

const mapDispatchToProps = {
  AddProduct: actionCreators.addProduct,
  RemoveProduct: actionCreators.removeProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductThumbnail);
