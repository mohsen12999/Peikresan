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
  role: string;
  userId: string;
  orders: IOrder[];
  subOrders: ISubOrder[];

  AnswerOrder: Function;
}

const SellerOrders: React.FC<ISellerOrdersProps> = ({
  role,
  userId,
  orders,
  subOrders,
  AnswerOrder,
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
      render: (_: any, record: ISubOrder) => (
        <Space size="middle">در انتظار جواب</Space>
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
              let buttons = [
                <Button
                  key="back"
                  onClick={() => {
                    setModalVisible(false);
                  }}
                >
                  بستن
                </Button>,
              ];

              if (
                // userRole == "seller" &&
                record.requestStatus === RequestStatus.Pending //  &&
                // record.sellerId == context.admin.id
                // record.SubOrders.filter(
                //   (sb) => sb.id == context.admin.id
                // ).length > 0
              ) {
                buttons = [
                  <Button
                    key="back"
                    onClick={() => {
                      AnswerOrder(
                        OrderUrl.SELLER_ANSWER,
                        userId,
                        record.id,
                        false
                      );
                      setModalVisible(false);
                    }}
                  >
                    رد سفارش
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    onClick={() => {
                      AnswerOrder(
                        OrderUrl.SELLER_ANSWER,
                        userId,
                        record.id,
                        true
                      );
                      setModalVisible(false);
                    }}
                  >
                    قبول سفارش
                  </Button>,
                ];
              }
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
                <li>{oi.title + " - " + oi.count + " واحد"}</li>
              ))}
          </ul>
        </Modal>
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  role: state.auth ? state.auth.role : "",
  userId: state.auth ? state.auth.id : "",
  orders: state.auth ? state.auth.orders : [],
  subOrders: state.auth ? state.auth.subOrders : [],
});

const mapDispatchToProps = {
  AnswerOrder: actionCreators.answerOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerOrders);
