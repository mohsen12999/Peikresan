import React from "react";
import { connect } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { Space, Button, InputNumber, message, AutoComplete } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IProduct, ISellerProduct } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminPath, AdminDataUrl, LOGIN_URL } from "../../shares/URLs";
import { AdminDataModel, Status } from "../../shares/Constants";

import "./Admin.css";

interface ISellerProductProps {
  sellerProducts: ISellerProduct[];
  products: IProduct[];
  status: Status;

  AddOrChangeElement: Function;
  ResetStatus: Function;
}

interface IParamTypes {
  id: string;
}

const SellerProduct: React.FC<ISellerProductProps> = ({
  sellerProducts,
  products,
  status,
  AddOrChangeElement,
  ResetStatus,
}) => {
  const { id } = useParams<IParamTypes>();
  const history = useHistory();

  const [product, setProduct] = React.useState<string>();
  const [count, setCount] = React.useState<number>();

  //React.useEffect(() => {
  if (status === Status.SUCCEEDED) {
    history.push(AdminPath.SellerProducts);
    message.success("با موفقیت ذخیره شد.");
    return ResetStatus();
  } else if (status === Status.FAILED) {
    message.error("اشکال در ذخیره");
    return ResetStatus();
  }
  //}, [status]);

  const validateInputs = () => product && product.length > 1 && count;

  if (id !== undefined) {
    const sellerProduct = sellerProducts.find((p) => p.id === Number(id));
    if (sellerProduct !== undefined && product === undefined) {
      setProduct(sellerProduct.productTitle);
      setCount(sellerProduct.count);
    }
  }

  const sendData = () => {
    if (!validateInputs() || status === Status.LOADING) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("product", product ?? "");
    formData.append("count", String(count));

    AddOrChangeElement(
      AdminDataUrl.ADD_CHANGE_SELLER_PRODUCT_URL,
      AdminDataModel.SellerProducts,
      formData
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
              option?.value.indexOf(inputValue) !== -1
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
  sellerProducts: state.auth?.sellerProducts ?? [],
  products: state.auth?.products ?? [],
  status: state.auth?.status ?? Status.INIT,
});

const mapDispatchToProps = {
  AddOrChangeElement: actionCreators.addOrChangeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerProduct);
