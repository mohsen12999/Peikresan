import React from "react";
import { connect } from "react-redux";
import { Button, Popconfirm, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, Redirect } from "react-router-dom";

import SimpleLayout from "../../components/SimpleLayout";
import { CartPath, HomePath } from "../../shares/URLs";
import AddressSpan from "../../components/AddressSpan";
import { IAddress } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators as dataActionCreators } from "../../store/Data";
import { actionCreators as shopCartActionCreators } from "../../store/ShopCart";

import "./DeliverAddress.css";

// TODO: add location to address

interface IAddressesListProps {
  addresses: IAddress[];

  RemovedAddress: Function;
  SetDeliverAddress: Function;
}

const AddressesList: React.FC<IAddressesListProps> = ({
  addresses,
  RemovedAddress,
  SetDeliverAddress,
}) => {
  const [radioState, setRadioState] = React.useState<number>();

  return addresses.length === 0 ? (
    <Redirect to={CartPath.NewAddress} />
  ) : (
    <SimpleLayout title="انتخاب آدرس مقصد" subTitle="" backPage={HomePath.Home}>
      {addresses.map((add) => (
        <Card
          title="آدرس"
          key={add.id}
          className={
            radioState === add.id
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
          </div>
        </Card>
      ))}

      <Link to={CartPath.NewAddress}>
        <Button type="dashed" className="show-new-address-btn">
          <PlusOutlined /> آدرس جدید
        </Button>
      </Link>

      <div>
        <Link to={HomePath.Home}>
          <Button
            type="primary"
            className="save-address-btn"
            style={{ borderRadius: "16px" }}
            disabled={radioState === undefined || radioState < 0}
          >
            انتخاب محصول
          </Button>
        </Link>
      </div>
    </SimpleLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  addresses: state.data ? state.data.addresses : [],
});

const mapDispatchToProps = {
  RemovedAddress: dataActionCreators.removedAddress,
  SetDeliverAddress: shopCartActionCreators.setShopCartAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressesList);
