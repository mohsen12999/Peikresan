import React from "react";
import { connect } from "react-redux";
import { Table, Tag, Space, Button, Modal } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IOrder, ISubOrder } from "../../shares/Interfaces";

import "./Admin.css";
import { RequestStatus } from "../../shares/Constants";
import { OrderUrl } from "../../shares/URLs";
import { actionCreators } from "../../store/Auth";

interface ISellerOrdersProps {
  subOrders: ISubOrder[];

  PackageTransaction: Function;
}

const SellerOrders: React.FC<ISellerOrdersProps> = ({
  subOrders,
  PackageTransaction,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalOrder, setModalOrder] = React.useState<ISubOrder>();
  const [modalBtn, setModalBtn] = React.useState<JSX.Element[]>();

  const columns = [
    {
      title: "شماره",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "وضعیت سفارش",
      key: "orderStatus",
      render: (_: any, record: ISubOrder) =>
        record.requestStatus === RequestStatus.Pending ? (
          <Space size="middle">در انتظار جواب</Space>
        ) : (
          <Space size="middle">کالا آماده هست</Space>
        ),
    },
    {
      title: "عملیات",
      key: "action",
      render: (_: any, record: ISubOrder) => (
        <Space size="middle">
          <Tag
            color="blue"
            onClick={() => {
              setModalOrder(record);
              const buttons =
                record.requestStatus === RequestStatus.Pending
                  ? [
                      <Button
                        key="back"
                        onClick={() => {
                          PackageTransaction(OrderUrl.READY_PACKAGE, record.id);
                          setModalVisible(false);
                        }}
                      >
                        سفارش آماده هست
                      </Button>,
                    ]
                  : [
                      <Button
                        key="back"
                        onClick={() => {
                          setModalVisible(false);
                        }}
                      >
                        بستن
                      </Button>,
                    ];

              setModalBtn(buttons);
              setModalVisible(true);
            }}
          >
            نمایش سفارش
          </Tag>
        </Space>
      ),
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست سفارش ها</h1>
        {subOrders.length > 0 ? (
          <Table columns={columns} dataSource={subOrders} pagination={false} />
        ) : (
          <h2>سفارشی برای شما وجود ندارد</h2>
        )}
        <Modal
          visible={modalVisible}
          title={"سفارش " + (modalOrder && modalOrder.id ? modalOrder.id : "")}
          onOk={() => {
            setModalVisible(false);
          }}
          onCancel={() => {
            setModalVisible(false);
          }}
          footer={modalBtn}
        >
          <p>لیست سفارش‌ها</p>
          <ul>
            {modalOrder &&
              modalOrder.items.map((oi) => (
                <li>
                  {oi.title +
                    " - " +
                    oi.count +
                    " واحد - " +
                    oi.price +
                    " - " +
                    oi.price * oi.count}
                </li>
              ))}
          </ul>
        </Modal>
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  subOrders: state.auth ? state.auth.subOrders : [],
});

const mapDispatchToProps = {
  PackageTransaction: actionCreators.packageTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerOrders);
