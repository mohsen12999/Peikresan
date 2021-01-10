import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Divider, message } from "antd";

import MyLayout from "../../components/MyLayout";
import {
  IAddress,
  IBankData,
  IDeliverTime,
  IProduct,
  ISellOptions,
} from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import {
  CalculateShopCartTotalPrice,
  CalculateDeliverPrice,
} from "../../shares/Functions";
import { actionCreators } from "../../store/ShopCart";

import "./Factor.css";

interface IFactorProps {
  products: IProduct[];
  shopCart: number[];
  address?: IAddress;
  deliverTime?: IDeliverTime;
  deliverAtDoor: boolean;
  loading: boolean;
  sellOptions?: ISellOptions;
  bankData?: IBankData;
  SendCart: Function;
}

const Factor: React.FC<IFactorProps> = ({
  products,
  shopCart,
  deliverAtDoor,
  loading,
  sellOptions,
  bankData,
  deliverTime,
  address,
  SendCart,
}) => {
  // const [url, setUrl] = React.useState("https://mabna.shaparak.ir:8080/Pay");
  let history = useHistory();
  const shopCartTotalPrice = CalculateShopCartTotalPrice(shopCart, products);
  const deliverPrice = sellOptions
    ? CalculateDeliverPrice(shopCartTotalPrice, deliverAtDoor, sellOptions)
    : 0;

  const SendToBank = () => {
    if (loading) return;
    SendCart(shopCart, address, deliverTime, deliverAtDoor);
  };

  return (
    <MyLayout>
      <div className="factor-span">
        <h2>فاکتور پرداختی</h2>
        <Row>
          <Col span={12}>{shopCartTotalPrice}</Col>
          <Col span={12}>قیمت مجموع</Col>
        </Row>
        <Row>
          <Col span={12}>{deliverPrice !== 0 ? deliverPrice : "رایگان"}</Col>
          <Col span={12}>هزینه ارسال</Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12}>{shopCartTotalPrice + deliverPrice}</Col>
          <Col span={12}>هزینه کل</Col>
        </Row>

        <Button type="primary" disabled={loading} onClick={SendToBank}>
          پرداخت
        </Button>

        {bankData && bankData.success && (
          <form method="post" action={bankData.url} style={{ display: "none" }}>
            <input
              type="hidden"
              name="TerminalID"
              id="TerminalID"
              value={bankData.terminalId}
            />
            <input
              type="hidden"
              name="token"
              id="token"
              value={bankData.token}
            />
          </form>
        )}
      </div>
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  products: state.data ? state.data.products : [],
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
  address: state.shopCart?.address,
  deliverTime: state.shopCart?.deliverTime,
  deliverAtDoor: state.shopCart ? state.shopCart.deliverAtDoor : false,
  loading: state.shopCart ? state.shopCart.loading : false,
  sellOptions: state.data?.sellOptions,
  bankData: state.shopCart?.bankData,
});

const mapDispatchToProps = {
  SendCart: actionCreators.sendCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Factor);
