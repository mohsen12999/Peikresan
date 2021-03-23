import React from "react";
import { connect } from "react-redux";
import { Tabs, Radio, Row, Col, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { actionCreators } from "../../store/ShopCart";

import MyLayout from "../../components/MyLayout";

import "./DeliverTime.css";
import { ApplicationState } from "../../store";
import { IDeliverTime } from "../../shares/Interfaces";
import { DeliverDay } from "../../shares/Constants";
import { CartPath } from "../../shares/URLs";

const { TabPane } = Tabs;

interface IDeliverTimeProps {
  deliverTimes: IDeliverTime[];
  enableExpressDelivery: boolean;

  SetShopCartTime: Function;
  SetDeliverAtDoor: Function;
}

const DeliverTime: React.FC<IDeliverTimeProps> = ({
  deliverTimes,
  enableExpressDelivery,
  SetShopCartTime,
  SetDeliverAtDoor,
}) => {
  const currentHour = new Date().getHours();
  const [radioValue, setRadioValue] = React.useState<number>();

  return (
    <MyLayout>
      <React.Fragment>
        <Tabs defaultActiveKey="2" /*onChange={callback}*/>
          <TabPane tab="امروز" key="2">
            <Radio.Group
              onChange={(e) => {
                const value = e.target.value;
                setRadioValue(value);
                SetShopCartTime({
                  time: value,
                  deliverDay: DeliverDay.TODAY,
                } as IDeliverTime);
              }}
              value={radioValue}
            >
              <Row>
                {deliverTimes.map((dt) => (
                  <Col key={dt.id} span={12}>
                    <Radio
                      className="radioStyle"
                      disabled={currentHour > dt.time}
                      value={dt.time}
                    >
                      {dt.title}
                    </Radio>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </TabPane>

          <TabPane tab="فردا" key="1">
            <Radio.Group
              onChange={(e) => {
                const value = e.target.value;
                setRadioValue(value);
                SetShopCartTime({
                  time: value,
                  deliverDay: DeliverDay.TOMORROW,
                } as IDeliverTime);
              }}
              value={radioValue}
            >
              <Row>
                {deliverTimes.map((dt) => (
                  <Col key={dt.id} span={12}>
                    <Radio
                      className="radioStyle"
                      // disabled={currentHour > dt.time}
                      value={dt.time}
                    >
                      {dt.title}
                    </Radio>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </TabPane>
        </Tabs>

        {enableExpressDelivery && (
          <Radio.Group
            onChange={(e) => {
              setRadioValue(0);
              SetShopCartTime({
                time: 0,
                deliverDay: DeliverDay.EXPRESS,
              } as IDeliverTime);
            }}
            value={radioValue}
          >
            <Radio value={0}>ارسال فوری تا 59 دقیقه - 5000 تومان</Radio>
          </Radio.Group>
        )}

        <br />
        <Checkbox
          style={{ direction: "rtl" }}
          // checked={context.deliverAtDoor}
          onChange={(e) => SetDeliverAtDoor(e.target.checked)}
        >
          می‌خواهم سفارشم درب آپارتمان تحویل داده شود.
        </Checkbox>

        <div className="btnStyle">
          <Link to={CartPath.Factor}>
            <Button
              style={{ borderRadius: "16px" }}
              disabled={radioValue === undefined}
              type="primary"
            >
              ادامه خرید
            </Button>
          </Link>
        </div>
      </React.Fragment>
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  enableExpressDelivery: state.data ? state.data.enableExpressDelivery : false,
  deliverTimes: state.data ? state.data.deliverTimes : [],
});

const mapDispatchToProps = {
  SetShopCartTime: actionCreators.setShopCartTime,
  SetDeliverAtDoor: actionCreators.setDeliverAtDoor,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliverTime);
