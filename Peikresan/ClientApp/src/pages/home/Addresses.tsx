import React from "react";
import { connect } from "react-redux";
import { Input, Row, Col, Button, AutoComplete, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyLayout from "../../components/MyLayout";
import { IAddress } from "../../shares/Interfaces";
import { DefaultAddress } from "../../shares/Constants";
import { ValidateAddress } from "../../shares/Functions";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Data";
import AddressSpan from "../../components/AddressSpan";

import "./Addresses.css";

const { TextArea } = Input;

interface IAddressesProps {
  addresses: IAddress[];
  AddAddress: Function;
  RemovedAddress: Function;
}

const Addresses: React.FC<IAddressesProps> = ({
  addresses,
  AddAddress,
  RemovedAddress,
}) => {
  const [showNewAddress, setShowNewAddress] = React.useState<boolean>(false);

  const [newAddress, setNewAddress] = React.useState<IAddress>({
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
      <div className="title">آدرس های منتخب شما</div>
      <Button
        type="dashed"
        className="show-new-address-btn"
        onClick={() => setShowNewAddress(true)}
      >
        <PlusOutlined /> آدرس جدید
      </Button>
      <br />

      {addresses.length === 0 ? (
        <p>شما آدرسی ثبت نکرده اید</p>
      ) : (
        <div className="address-div">
          {addresses.map((add) => (
            <article className="address-article">
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

              <Button
                type="primary"
                className="edit-address"
                onClick={() => {
                  setNewAddress({ ...add });
                  setShowNewAddress(true);
                }}
              >
                ویرایش
              </Button>

              <AddressSpan {...add} />
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
                onClick={() => saveAddress()}
              >
                ذخیره آدرس
              </Button>
              <Button
                onClick={() => {
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

const mapDispatchToProps = {
  AddAddress: actionCreators.addAddress,
  RemovedAddress: actionCreators.removedAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(Addresses);
