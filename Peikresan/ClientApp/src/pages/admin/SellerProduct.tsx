import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Space, Button, InputNumber, AutoComplete } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IProduct, ISellerProduct } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";
import { AdminDataModel, Status } from "../../shares/Constants";

import "./Admin.css";

interface ISellerProductProps {
  sellerProducts: ISellerProduct[];
  products: IProduct[];
  status: Status;

  AddOrChangeElement: Function;
}

interface IParamTypes {
  id: string;
}

const SellerProduct: React.FC<ISellerProductProps> = ({
  sellerProducts,
  products,
  status,
  AddOrChangeElement,
}) => {
  const { id } = useParams<IParamTypes>();

  const [product, setProduct] = React.useState<string>();
  const [count, setCount] = React.useState<number>();
  const [price, setPrice] = React.useState<number>();

  const validateInputs = () => product && product.length > 1 && count;

  if (id !== undefined) {
    const sellerProduct = sellerProducts.find(
      (p) => p.productId === Number(id)
    );
    if (sellerProduct !== undefined && product === undefined) {
      setProduct(sellerProduct.productTitle);
      setCount(sellerProduct.count);
      setPrice(sellerProduct.price);
    }
  }

  const sendData = () => {
    if (!validateInputs() || status === Status.LOADING) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("product", product ? product : "");
    formData.append("count", String(count));
    formData.append("price", String(price));

    AddOrChangeElement(
      AdminDataUrl.ADD_CHANGE_SELLER_PRODUCT_URL,
      AdminDataModel.SellerProducts,
      formData,
      AdminPath.SellerProducts
    );
  };

  return (
    <MyPrivateLayout>
      <div className="admin-container">
        <h1>محصول</h1>
        <Space direction="vertical">
          <AutoComplete
            style={{ minWidth: "350px" }}
            options={products.map((prod) => ({
              value: prod.title,
            }))}
            placeholder=" نام محصول"
            filterOption={(inputValue, option) =>
              option !== undefined && option.value.indexOf(inputValue) !== -1
            }
            onChange={(value) => {
              setProduct(value);
            }}
          />

          <InputNumber
            className="input-style"
            value={count}
            placeholder="تعداد"
            onChange={(value) => {
              setCount(Number(value));
            }}
          />

          <InputNumber
            className="input-style"
            value={price}
            placeholder="قیمت"
            onChange={(value) => {
              setPrice(Number(value));
            }}
          />

          <br />

          <Button
            type="primary"
            disabled={!validateInputs()}
            onClick={sendData}
          >
            ذخیره
          </Button>
        </Space>
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  sellerProducts: state.auth ? state.auth.sellerProducts : [],
  products: state.auth ? state.auth.products : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  AddOrChangeElement: actionCreators.addOrChangeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerProduct);
