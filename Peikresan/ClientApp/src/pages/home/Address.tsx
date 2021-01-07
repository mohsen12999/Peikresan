import React from "react";
import { connect } from "react-redux";
import { Input, Row, Col, Button, AutoComplete, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyLayout from "../../components/MyLayout";
import { IAddress } from "../../shares/Interfaces";

import "./Address.css";
import { ApplicationState } from "../../store";

const { TextArea } = Input;
/*
  const ValidateNewAddress = () =>
    newAddress === undefined ||
    newAddress.state === undefined ||
    newAddress.state.length < 2 ||
    newAddress.city === undefined ||
    newAddress.city.length < 2 ||
    newAddress.description === undefined ||
    newAddress.description.length < 5 ||
    newAddress.mobile === undefined ||
    newAddress.mobile.length < 5
      ? false
      : true;
*/

interface IAddressProps {
  addresses: IAddress[];
}

const Address: React.FC<IAddressProps> = ({ addresses }) => {
  const newAddressDefault = {
    name: "",
    state: "مازندران",
    city: "رامسر",
    description: "",
    level: "",
    unit: "",
    number: "",
    mobile: "",
    postalCode: "",
  };

  const [showNewAddress, setShowNewAddress] = React.useState(false);

  const [newAddress, setNewAddress] = React.useState({
    ...newAddressDefault,
  });

  const changeNewAddress = (e, name) => {
    setNewAddress({ ...newAddress, [name]: e.target.value });
  };

  const ValidateNewAddress = () =>
    newAddress === undefined ||
    newAddress.name === undefined ||
    newAddress.name.length < 2 ||
    newAddress.state === undefined ||
    newAddress.state.length < 2 ||
    newAddress.city === undefined ||
    newAddress.city.length < 2 ||
    newAddress.description === undefined ||
    newAddress.description.length < 5 ||
    newAddress.mobile === undefined ||
    newAddress.mobile.length < 5
      ? false
      : true;

  const states = [{ value: "مازندران" }, { value: "گیلان" }];
  const cities = [{ value: "رامسر" }];

  const resetAddress = () => {
    setNewAddress({ ...newAddressDefault });
    setShowNewAddress(false);
  };

  return (
    <MyLayout>
      <div className="title">آدرس های منتخب شما</div>
      <Button
        type="dashed"
        className="show-new-address-btn"
        onClick={(e) => setShowNewAddress(true)}
      >
        <PlusOutlined /> آدرس جدید
      </Button>
      <br />

      {context.addresses === undefined || context.addresses.length === 0 ? (
        <p>شما آدرسی ثبت نکرده اید</p>
      ) : (
        <div className="address-div">
          {context.addresses.map((add) => (
            <article className="address-article">
              <Popconfirm
                title="از حذف اطمینان دارید؟"
                onConfirm={(e) => {
                  console.log("delete", e);
                  context.DeleteAddresses(add.id);
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

              <div>
                {add.state + ", " + add.city + ", موبایل: " + add.mobile}
                {add.name && add.name > 0 && ", گیرنده: " + add.name}
              </div>
              <div>
                {add.description}
                {add.level && add.level.length > 0 && ", طبقه: " + add.level}
                {add.unit && add.unit.length > 0 && ", واحد: " + add.unit}
                {add.number && add.number.length > 0 && ", پلاک: " + add.number}
                {add.postalCode &&
                  add.postalCode.length > 0 &&
                  ", کدپستی: " + add.postalCode}
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="new-address-span">
        {showNewAddress && (
          <div className="new-address-span">
            <Row>
              <Col span={24}>
                <Input
                  placeholder="نام و نام خانوادگی تحویل گیرنده"
                  value={newAddress.name}
                  onChange={(e) => changeNewAddress(e, "name")}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Input
                  placeholder="موبایل"
                  value={newAddress.mobile}
                  onChange={(e) => changeNewAddress(e, "mobile")}
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

            <TextArea
              placeholder="آدرس پستی"
              value={newAddress.description}
              onChange={(e) => changeNewAddress(e, "description")}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />

            <Row style={{ direction: "rtl" }}>
              <Col span={12}>
                <Input
                  placeholder="طبقه"
                  value={newAddress.level}
                  onChange={(e) => changeNewAddress(e, "level")}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="واحد"
                  value={newAddress.unit}
                  onChange={(e) => changeNewAddress(e, "unit")}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="پلاک"
                  value={newAddress.number}
                  onChange={(e) => changeNewAddress(e, "number")}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="کدپستی"
                  style={{ width: "100%" }}
                  value={newAddress.postalCode}
                  onChange={(e) => changeNewAddress(e, "postalCode")}
                />
              </Col>
            </Row>
            <Row className="btn-row">
              <Button
                type="primary"
                disabled={!ValidateNewAddress()}
                onClick={(e) => {
                  context.AddNewAddresses({ ...newAddress });
                  resetAddress();
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
      </div>
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  addresses: state.data ? state.data.addresses : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Address);
