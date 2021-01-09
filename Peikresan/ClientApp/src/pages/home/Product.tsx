import React from "react";
import { connect } from "react-redux";
import { Tabs, Button } from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

import MyLayout from "../../components/MyLayout";

import "./Product.css";
import { ApplicationState } from "../../store";
import { IProduct } from "../../shares/Interfaces";
import { ProductCount } from "../../shares/Functions";
import { actionCreators } from "../../store/ShopCart";
const { TabPane } = Tabs;

interface IProductProps {
  products: IProduct[];
  shopCart: number[];
  AddProduct: Function;
  RemoveProduct: Function;
}

interface IParamTypes {
  id: string;
}

const Product: React.FC<IProductProps> = ({
  products,
  shopCart,
  AddProduct,
  RemoveProduct,
}) => {
  const { id } = useParams<IParamTypes>();
  const product = products.find((p) => p.id === Number(id));
  const count = product?.id ? shopCart[product.id] ?? 0 : 0;

  return (
    <MyLayout>
      {product ? (
        <React.Fragment>
          <img src={product.img} alt={product.title} className="product-img" />
          <h3 className="product-text">{product.title}</h3>
          <Tabs defaultActiveKey="2" /*onChange={callback}*/>
            <TabPane tab="نظرات کاربران" key="1">
              <p>تاکنون نظری از طرف کاربران ذخیره نشده</p>
            </TabPane>

            <TabPane tab="توضیحات" key="2">
              <p>{product.description}</p>
            </TabPane>
          </Tabs>
          <h3 className="product-text">{product.price} تومان</h3>
          {count === 0 ? (
            <Button
              type="primary"
              className="buy-btn"
              style={{ marginBottom: "2rem" }}
              icon={<ShoppingCartOutlined />}
              onClick={() => AddProduct(product.id, product.max)}
            >
              خرید
            </Button>
          ) : (
            <React.Fragment>
              <MinusCircleOutlined
                style={{ color: "red" }}
                onClick={() => RemoveProduct(id)}
              />
              <span dir="rtl" className="product-text product-count">
                {ProductCount(count, product.soldByWeight, product.minWeight)}
              </span>
              <PlusCircleOutlined
                style={{
                  color: count === product.max ? "lightgray" : "green",
                }}
                onClick={() => AddProduct(product.id, product.max)}
              />
            </React.Fragment>
          )}
          {/* <ChangeableProductCount
                {...product}
                AddProduct={context.AddProduct}
                RemoveProduct={context.RemoveProduct}
              /> */}
        </React.Fragment>
      ) : (
        <h1>محصول پیدا نشد</h1>
      )}
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  products: state.data ? state.data.products : [],
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
});

const mapDispatchToProps = {
  AddProduct: actionCreators.addProduct,
  RemoveProduct: actionCreators.removeProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
