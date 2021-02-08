import React from "react";
import { connect } from "react-redux";
import { Input, Row, Col, Button, AutoComplete } from "antd";
import { Link } from "react-router-dom";

import SimpleLayout from "../../components/SimpleLayout";
import { CartPath, HomePath } from "../../shares/URLs";
import { ValidateAddress } from "../../shares/Functions";
import { ApplicationState } from "../../store";
import { IAddress } from "../../shares/Interfaces";
import { DefaultAddress } from "../../shares/Constants";
import { actionCreators as shopCartActionCreators } from "../../store/ShopCart";
import { actionCreators as dataActionCreators } from "../../store/Data";

import "./DeliverAddress.css";

const { TextArea } = Input;

interface ICompleteAddressProps {
  address?: IAddress;

  SetDeliverAddress: Function;
  GetAddressFromLocation: Function;
  AddAddress: Function;
}

const CompleteAddress: React.FC<ICompleteAddressProps> = ({
  address,
  SetDeliverAddress,
  GetAddressFromLocation,
  AddAddress,
}) => {
  React.useEffect(() => {
    // https://developers.neshan.org/api/reverse-geocoding/
    SetDeliverAddress({ ...DefaultAddress });

    GetAddressFromLocation();
    // TODO: get product from 3 near shops
  }, []);

  // const [newAddress, setNewAddress] = React.useState<IAddress>({
  //   ...DefaultAddress,
  // });

  const states = [{ value: "مازندران" }, { value: "گیلان" }];
  const cities = [{ value: "رامسر" }];

  return (
    <SimpleLayout
      title="انتخاب آدرس مقصد"
      subTitle=""
      backPage={CartPath.NewAddress}
    >
      <div className="new-address-span">
        <Row>
          <Col span={12}>
            <AutoComplete
              style={{ width: "100%" }}
              options={states}
              placeholder="استان"
              value={address?.state}
              onChange={(value) =>
                // setNewAddress({ ...newAddress, state: value })
                SetDeliverAddress({ ...address, state: value })
              }
              disabled
            />
          </Col>

          <Col span={12}>
            <AutoComplete
              style={{ width: "100%" }}
              options={cities}
              placeholder="شهر"
              value={address?.city}
              onChange={(value) =>
                // setNewAddress({ ...newAddress, city: value })
                SetDeliverAddress({ ...address, city: value })
              }
              disabled
            />
          </Col>
        </Row>

        <TextArea
          placeholder="آدرس پستی"
          value={address?.formattedAddress}
          onChange={(e) =>
            // setNewAddress({ ...newAddress, description: e.target.value })
            SetDeliverAddress({ ...address, formattedAddress: e.target.value })
          }
          autoSize={{ minRows: 2, maxRows: 6 }}
          disabled
        />

        <TextArea
          placeholder="آدرس تکمیلی مثل پلاک یا نام ساختمان و پلاک"
          value={address?.description}
          onChange={(e) =>
            // setNewAddress({ ...newAddress, description: e.target.value })
            SetDeliverAddress({ ...address, description: e.target.value })
          }
          autoSize={{ minRows: 2, maxRows: 6 }}
        />

        <Row>
          <Col span={24}>
            <Input
              placeholder="نام و نام خانوادگی تحویل گیرنده"
              value={address?.name}
              onChange={(e) =>
                // setNewAddress({ ...newAddress, name: e.target.value })
                SetDeliverAddress({ ...address, name: e.target.value })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input
              placeholder="موبایل"
              value={address?.mobile}
              onChange={(e) =>
                //setNewAddress({ ...newAddress, mobile: e.target.value })
                SetDeliverAddress({ ...address, mobile: e.target.value })
              }
            />
          </Col>
        </Row>

        {ValidateAddress(address) && (
          <Row className="btn-row">
            <Link to={HomePath.Home}>
              <Button
                type="primary"
                disabled={!ValidateAddress(address)}
                onClick={() => {
                  AddAddress(address);
                }}
              >
                تائید آدرس
              </Button>
            </Link>
          </Row>
        )}
      </div>
    </SimpleLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  address: state.shopCart?.address,
});

const mapDispatchToProps = {
  SetDeliverAddress: shopCartActionCreators.setShopCartAddress,
  GetAddressFromLocation: shopCartActionCreators.getAddressFromLocation,
  AddAddress: dataActionCreators.addAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompleteAddress);
