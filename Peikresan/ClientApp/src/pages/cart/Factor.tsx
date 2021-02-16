import React from "react";
import { connect } from "react-redux";
import { Row, Col, Button, Divider } from "antd";

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
import { Status } from "../../shares/Constants";

import "./Factor.css";

interface IFactorProps {
  products: IProduct[];
  shopCart: number[];
  address?: IAddress;
  deliverTime?: IDeliverTime;
  deliverAtDoor: boolean;
  status: Status;
  sellOptions?: ISellOptions;
  bankData?: IBankData;
  SendCart: Function;
}

const Factor: React.FC<IFactorProps> = ({
  products,
  shopCart,
  deliverAtDoor,
  status,
  sellOptions,
  bankData,
  deliverTime,
  address,
  SendCart,
}) => {
  // const [url, setUrl] = React.useState("https://mabna.shaparak.ir:8080/Pay");
  const shopCartTotalPrice = CalculateShopCartTotalPrice(shopCart, products);
  const deliverPrice = sellOptions
    ? CalculateDeliverPrice(
        shopCartTotalPrice,
        deliverAtDoor,
        sellOptions,
        deliverTime?.deliverDay
      )
    : 0;

  const SendToBank = () => {
    if (status === Status.LOADING) return;
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

        <Button
          type="primary"
          disabled={status === Status.LOADING}
          onClick={SendToBank}
        >
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
  address: state.shopCart ? state.shopCart.address : undefined,
  deliverTime: state.shopCart ? state.shopCart.deliverTime : undefined,
  deliverAtDoor: state.shopCart ? state.shopCart.deliverAtDoor : false,
  status: state.shopCart ? state.shopCart.status : Status.IDLE,
  sellOptions: state.data ? state.data.sellOptions : undefined,
  bankData: state.shopCart ? state.shopCart.bankData : undefined,
});

const mapDispatchToProps = {
  SendCart: actionCreators.sendCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Factor);
