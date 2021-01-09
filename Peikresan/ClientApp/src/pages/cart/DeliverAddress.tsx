import React from "react";
import { connect } from "react-redux";
import {
  Input,
  Row,
  Col,
  Button,
  AutoComplete,
  Popconfirm,
  Select,
  Card,
} from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

import MyLayout from "../../components/MyLayout";
import { DefaultAddress } from "../../shares/Constants";
import { ValidateAddress } from "../../shares/Functions";
import AddressSpan from "../../components/AddressSpan";
import { IAddress } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators as dataActionCreators } from "../../store/Data";
import { actionCreators as shopCartActionCreators } from "../../store/ShopCart";

import "./DeliverAddress.css";

const { TextArea } = Input;
const { Option } = Select;

interface IAddressProps {
  addresses: IAddress[];
  AddAddress: Function;
  RemovedAddress: Function;
  SetDeliverAddress: Function;
}

const DeliverAddress: React.FC<IAddressProps> = ({
  addresses,
  AddAddress,
  RemovedAddress,
  SetDeliverAddress,
}) => {
  const [radioState, setRadioState] = React.useState<number>();
  const [showNewAddress, setShowNewAddress] = React.useState(false);

  const [newAddress, setNewAddress] = React.useState({
    ...DefaultAddress,
  });

  const states = [{ value: "مازندران" }, { value: "گیلان" }];
  const cities = [{ value: "رامسر" }];

  const saveAddress = () => {
    AddAddress({ ...newAddress });
    setNewAddress({ ...DefaultAddress });
    setShowNewAddress(false);
  };

  return (
    <MyLayout>
      <React.Fragment>
        <Button
          type="dashed"
          className="show-new-address-btn"
          onClick={() => setShowNewAddress(true)}
        >
          <PlusOutlined /> آدرس جدید
        </Button>
        <br />
        {showNewAddress && (
          <div className="new-address-span">
            <Row>
              <Col span={24}>
                <Input
                  placeholder="نام و نام خانوادگی تحویل گیرنده"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Input
                  placeholder="موبایل"
                  value={newAddress.mobile}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, mobile: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <AutoComplete
                  style={{ width: "100%" }}
                  options={states}
                  placeholder="استان"
                  value={newAddress.state}
                  onChange={(value) =>
                    setNewAddress({ ...newAddress, state: value })
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <AutoComplete
                  style={{ width: "100%" }}
                  options={cities}
                  placeholder="شهر"
                  value={newAddress.city}
                  onChange={(value) =>
                    setNewAddress({ ...newAddress, city: value })
                  }
                />
              </Col>
            </Row>

            {/* <Row span={24}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="منطقه"
                optionFilterProp="children"
                onChange={(value) =>
                  setNewAddress({
                    ...newAddress,
                    districtId: Number(value),
                    district: districts.find((d) => d.id == value).name,
                  })
                }
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {districts.map((district) => (
                  <Option key={district.id} value={district.id}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Row> */}

            <TextArea
              placeholder="آدرس پستی"
              value={newAddress.description}
              onChange={(e) =>
                setNewAddress({ ...newAddress, description: e.target.value })
              }
              autoSize={{ minRows: 2, maxRows: 6 }}
            />

            <Row style={{ direction: "rtl" }}>
              <Col span={12}>
                <Input
                  placeholder="طبقه"
                  value={newAddress.level}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, level: e.target.value })
                  }
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="واحد"
                  value={newAddress.unit}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, unit: e.target.value })
                  }
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="پلاک"
                  value={newAddress.number}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, number: e.target.value })
                  }
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="کدپستی"
                  style={{ width: "100%" }}
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Row className="btn-row">
              <Button
                type="primary"
                disabled={!ValidateAddress(newAddress)}
                onClick={() => {
                  saveAddress();
                }}
              >
                ذخیره آدرس
              </Button>
              <Button
                onClick={(e) => {
                  setShowNewAddress(false);
                }}
              >
                بستن
              </Button>
            </Row>
          </div>
        )}

        {addresses.length === 0 ? null : (
          <React.Fragment>
            {addresses.map((add) => (
              <Card
                title="آدرس"
                key={add.id}
                className={
                  radioState == add.id
                    ? "address-card address-card-selected"
                    : "address-card"
                }
                onClick={() => {
                  setRadioState(add.id);
                  SetDeliverAddress({ ...add });
                }}
              >
                <AddressSpan {...add} />
                <div>
                  <Popconfirm
                    title="از حذف اطمینان دارید؟"
                    onConfirm={() => {
                      RemovedAddress(add.id);
                    }}
                    onCancel={(e) => {
                      console.log("cancel delete address");
                    }}
                    okText="بله"
                    cancelText="خیر"
                  >
                    <Button type="primary" className="delete-address" danger>
                      حذف
                    </Button>
                  </Popconfirm>
                  <Button type="primary" className="edit-address">
                    ویرایش
                  </Button>
                </div>
              </Card>
            ))}
          </React.Fragment>
        )}

        <div>
          <Link to="/deliver-time">
            <Button
              type="primary"
              className="save-address-btn"
              style={{ borderRadius: "16px" }}
              disabled={radioState == null || radioState <= 0}
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
  addresses: state.data ? state.data.addresses : [],
});

const mapDispatchToProps = {
  AddAddress: dataActionCreators.addAddress,
  RemovedAddress: dataActionCreators.removedAddress,
  SetDeliverAddress: shopCartActionCreators.setShopCartAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliverAddress);
