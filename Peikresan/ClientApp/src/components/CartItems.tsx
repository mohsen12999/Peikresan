import React from "react";
import { connect } from "react-redux";
import { List, Tag, Button } from "antd";
import { Link } from "react-router-dom";

import ChangeableProductCount from "./ChangeableProductCount";

import "./CartItems.css";
import { actionCreators } from "../store/ShopCart";
import { ApplicationState } from "../store";
import { IProduct } from "../shares/Interfaces";
import { GetShopCartProducts, ShopCartTotalPrice } from "../shares/Functions";

interface ICartItemProps {
  shopCart: number[];
  products: IProduct[];
  DeleteProduct: Function;
}

const CartItems: React.FC<ICartItemProps> = ({
  shopCart,
  products,
  DeleteProduct,
}) => {
  return (
    <List
      header={<div className="cart-items-header">محصولات</div>}
      footer={
        <div>
          <div className="cart-items-footer persian-number">
            قیمت مجموع: {ShopCartTotalPrice(shopCart, products)}
          </div>
          <Link to="/deliver-address">
            <Button style={{ borderRadius: "16px" }} type="primary">
              ادامه خرید
            </Button>
          </Link>
        </div>
      }
      bordered
      dataSource={GetShopCartProducts(shopCart, products)}
      renderItem={(item) => (
        <List.Item>
          <div className="cart-items-single-row">
            <Link to={"/product/" + item.id}>
              <img className="cart-items-img" src={item.img} alt={item.title} />
            </Link>
            <div className="cart-items-middle">
              <h3 className="cart-items-title">{item.title}</h3>
              <div className="cart-items-middle-bottom">
                <div className="persian-number">{item.price}</div>

                <div className="cart-items-count-span">
                  <ChangeableProductCount product={item} />
                </div>
              </div>
            </div>
            <div>
              <div className="cart-items-delete-product">
                <Tag
                  color="red"
                  style={{ borderRadius: "14px" }}
                  onClick={() => DeleteProduct(item.id)}
                >
                  حذف کالا
                </Tag>
              </div>
              <div className="persian-number">{item.count * item.price}</div>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
  products: state.data ? state.data.products : [],
});

const mapDispatchToProps = {
  DeleteProduct: actionCreators.deleteProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);
