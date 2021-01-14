import React from "react";
import { connect } from "react-redux";
import { Table, Tag, Space, Button, Menu, Dropdown, Modal } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IOrder, ISubOrder } from "../../shares/Interfaces";
import AddressSpan from "../../components/AddressSpan";
import { OrderStatusDescription } from "../../shares/Functions";

import "./Admin.css";

interface IOrdersProps {
  orders: IOrder[];
  subOrders: ISubOrder[];
}

const Orders: React.FC<IOrdersProps> = ({ orders, subOrders }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalOrder, setModalOrder] = React.useState<IOrder>();
  const [modalBtn, setModalBtn] = React.useState<JSX.Element[]>();

  // const makeMenu = (
  //   orderId: number,
  //   users: IUser[],
  //   role: string,
  //   func: Function
  // ) => (
  //   <Menu onClick={(e) => func(orderId, e.key)}>
  //     {users
  //       .filter((u) => u.role.toUpperCase() == role)
  //       .map((user) => (
  //         <Menu.Item key={user.id}>{user.fullName}</Menu.Item>
  //       ))}
  //   </Menu>
  // );

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
              setModalBtn(buttons);
              setModalVisible(true);
            }}
          >
            نمایش سفارش
          </Tag>

          {/* {userRole == "admin" &&
            (record.orderStatus == 10 || record.orderStatus == 23) && (
              <Dropdown
                overlay={makeMenu(
                  record.id,
                  context.users,
                  "seller",
                  context.ChoosingSeller
                )}
                arrow
              >
                <Button>انتخاب فروشنده</Button>
              </Dropdown>
            )}

          {userRole == "admin" &&
            (record.orderStatus == 27 || record.orderStatus == 33) && (
              <Dropdown
                overlay={makeMenu(
                  record.id,
                  context.users,
                  "delivery",
                  context.ChoosingDeliver
                )}
                arrow
              >
                <Button>انتخاب پیک</Button>
              </Dropdown>
            )} */}
        </Space>
      ),
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست سفارش ها</h1>
        {orders.length > 0 ? (
          <Table columns={columns} dataSource={orders} pagination={false} />
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
                <div>
                  <h4>نام فروشنده: </h4>
                  <p>آدرس: </p>
                  <p>لیست اقلام:</p>
                  <ul>
                    {so.items.map((item) => (
                      <li>{item.title + " - " + item.count + " واحد"}</li>
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
