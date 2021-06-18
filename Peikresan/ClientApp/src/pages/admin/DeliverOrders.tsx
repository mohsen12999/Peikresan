import React from "react";
import { connect } from "react-redux";
import { Table, Tag, Space, Button,InputNumber, Modal } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IOrder, ISubOrder } from "../../shares/Interfaces";
import { UserRole, OrderStatus } from "../../shares/Constants";
import AddressSpan from "../../components/AddressSpan";
import { OrderUrl } from "../../shares/URLs";

import "./Admin.css";
import { actionCreators } from "../../store/Auth";
import { OrderStatusDescription } from "../../shares/Functions";

// only for delivery

interface IDeliverOrdersProps {
  orders: IOrder[];
  subOrders: ISubOrder[];

  PackageTransaction: Function;
  DeliverPackage: Function;
}

const DeliverOrders: React.FC<IDeliverOrdersProps> = ({
  orders,
  subOrders,

  PackageTransaction,
  DeliverPackage,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalOrder, setModalOrder] = React.useState<IOrder>();
  const [modalBtn, setModalBtn] = React.useState<JSX.Element[]>();
  const [confirmCode, setConfirmCode] = React.useState<number>();

  const columns = [
    {
      title: "شماره",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "نام خریدار",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "وضعیت سفارش",
      key: "orderStatus",
      render: (_: any, record: IOrder) => (
        <Space size="middle">
          {OrderStatusDescription(record.orderStatus)}
        </Space>
      ),
    },
    {
      title: "عملیات",
      key: "action",
      render: (_: any, record: IOrder) => (
        <Space size="middle">
          <Tag
            color="blue"
            onClick={() => {
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
              // if (
              //   role.toUpperCase() === UserRole.DELIVERY &&
              //   record.orderStatus === OrderStatus.AssignToDeliver
              // ) {
              //   buttons = [
              //     <Button
              //       key="back"
              //       onClick={() => {
              //         AnswerOrder(
              //           OrderUrl.DELIVER_ANSWER,
              //           userId,
              //           record.id,
              //           false
              //         );
              //         setModalVisible(false);
              //       }}
              //     >
              //       رد سفارش
              //     </Button>,
              //     <Button
              //       key="submit"
              //       type="primary"
              //       onClick={() => {
              //         AnswerOrder(
              //           OrderUrl.DELIVER_ANSWER,
              //           userId,
              //           record.id,
              //           true
              //         );
              //         setModalVisible(false);
              //       }}
              //     >
              //       قبول سفارش
              //     </Button>,
              //   ];
              // } else
              if (record.orderStatus <= OrderStatus.DeliverAccepted) {
                buttons = [
                  <Button
                    key="back"
                    onClick={() => {
                      PackageTransaction(
                        OrderUrl.GET_PRODUCT_FROM_SELLER,
                        record.id
                      );

                      //context.DeliverGettingProduct(record.id);
                      setModalVisible(false);
                    }}
                  >
                    تحویل گرفتن همه کالا‌ها از فروشنده
                  </Button>,
                ];
              } else if (
                record.orderStatus === OrderStatus.DeliveryGetProduct
              ) {
                buttons = [
                  <InputNumber
              value={confirmCode}
              placeholder="وزن پایه"
              onChange={(value) => {
                setConfirmCode(Number(value));
              }}
            />
                  ,
                  <Button
                    key="back"
                    onClick={() => {
                      DeliverPackage(
                        OrderUrl.DELIVER_PRODUCT_TO_CUSTOMER,
                        record.id,
                        confirmCode
                      );
                      //context.DeliverGettingProduct(record.id);
                      setModalVisible(false);
                    }}
                  >
                    تحویل به مشتری
                  </Button>,
                ];
              }
              setModalOrder(record);
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

  const filterOrders =
    orders.length > 0
      ? orders.filter((o) => o.orderStatus >= 10 && o.orderStatus < 50)
      : [];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست سفارش ها</h1>
        {filterOrders.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filterOrders}
            pagination={false}
          />
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

          {modalOrder &&
            subOrders &&
            subOrders
              .filter((so) => so.orderId === modalOrder.id)
              .map((so) => (
                <div key={so.id}>
                  <h4>نام فروشنده: {so.sellerName}</h4>
                  <p>آدرس: {so.sellerAddress}</p>
                  <p>لیست اقلام:</p>
                  <ul>
                    {so.items.map((item) => (
                      <li>
                        {item.title +
                          " - " +
                          item.count +
                          " واحد - " +
                          item.price +
                          " - " +
                          item.price * item.count}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

          <div>
            <h4>آدرس خریدار: </h4>
            <div>{modalOrder && <AddressSpan {...modalOrder} />}</div>
            {modalOrder && modalOrder.deliverAtDoor && <p>تحویل درب واحد</p>}
            <p>نام خریدار: {modalOrder && modalOrder.name}</p>
          </div>
        </Modal>
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  orders: state.auth ? state.auth.orders : [],
  subOrders: state.auth ? state.auth.subOrders : [],
});

const mapDispatchToProps = {
  PackageTransaction: actionCreators.packageTransaction,
  DeliverPackage: actionCreators.deliverPackage,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliverOrders);
