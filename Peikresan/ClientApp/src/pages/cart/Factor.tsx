import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Button, Divider, message } from "antd";

import MyLayout from "../../components/MyLayout";
import { IAddress, IDeliverTime } from "../../shares/Interfaces";

import "./Factor.css";
import { ApplicationState } from "../../store";

interface IFactorProps {
  shopCart: number[];
  address: IAddress;
  deliverTime: IDeliverTime;
  deliverAtDoor: boolean;
}

const Factor: React.FC<IFactorProps> = ({
  shopCart,
  address,
  deliverTime,
  deliverAtDoor,
}) => {
  const [loading, setLoading] = React.useState(false);

  const [token, setToken] = React.useState();
  const [terminalID, setTerminalID] = React.useState();
  const [url, setUrl] = React.useState("https://mabna.shaparak.ir:8080/Pay");
  const [form, setForm] = React.useState();

  const [mobileProblem, setMobileProblem] = React.useState(false);

  let history = useHistory();

  const { total } = context.GetShopCart();
  const SendToBank = () => {
    if (loading) return;
    setLoading(true);

    context.SendCart().then((res) => {
      if (res && res.success) {
        // history.push(res.url);
        setToken(res.token);
        setTerminalID(res.tid);
        setUrl(res.url);
        setMobileProblem(true);
        form.dispatchEvent(new Event("submit"));
        document.querySelector("form").submit();
      } else {
        message.error("اشکال در ارتباط با بانک");
      }
      setLoading(false);
    });
  };

  return (
    <MyLayout>
      <div className="factor-span">
        <h2>فاکتور پرداختی</h2>
        <Row>
          <Col span={12}>{total}</Col>
          <Col span={12}>قیمت مجموع</Col>
        </Row>
        <Row>
          <Col span={12}>
            {context.DeliverPrice(total) !== 0
              ? context.DeliverPrice(total)
              : "رایگان"}
          </Col>
          <Col span={12}>هزینه ارسال</Col>
        </Row>
        {context.deliverAtDoor && (
          <Row>
            <Col span={12}>2000</Col>
            <Col span={12}>هزینه تحویل درب واحد</Col>
          </Row>
        )}
        <Divider />
        <Row>
          <Col span={12}>
            {total +
              context.DeliverPrice(total) +
              (context.deliverAtDoor ? 2000 : 0)}
          </Col>
          <Col span={12}>هزینه کل</Col>
        </Row>

        {!mobileProblem && (
          <Button type="primary" disabled={loading} onClick={SendToBank}>
            پرداخت
          </Button>
        )}

        <form
          method="post"
          action={url}
          ref={(ref) => {
            setForm(ref);
          }}
          // style={{ display: "none" }}
        >
          <input
            type="hidden"
            name="TerminalID"
            id="TerminalID"
            value={terminalID}
          />
          <input type="hidden" name="token" id="token" value={token} />
          <Button
            type="primary"
            style={{ display: mobileProblem ? "inline-block" : "none" }}
            htmlType="submit"
          >
            ارسال به بانک
          </Button>
        </form>
      </div>
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
  address: state.shopCart ? state.shopCart.address : [],
  deliverTime: state.shopCart ? state.shopCart.deliverTime : [],
  deliverAtDoor: state.shopCart ? state.shopCart.deliverAtDoor : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Factor);
