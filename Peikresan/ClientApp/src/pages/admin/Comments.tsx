import React from "react";
import { connect } from "react-redux";
import { Table, Tag, Space, Button, Modal } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { IComment } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { Status } from "../../shares/Constants";

interface ICategoriesProps {
  comments: IComment[];
  status: Status;

  RemoveElement: Function;
}

const Comments: React.FC<ICategoriesProps> = ({
  comments,
  status,
  RemoveElement,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalComment, setModalComment] = React.useState<IComment>();
  const [modalBtn, setModalBtn] = React.useState<JSX.Element[]>();

  const columns = [
    // {
    //   title: "شماره",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "نام نظر دهنده",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "کد و نام کالا",
      dataIndex: "productId",
      key: "productId",
      render: (productId: number, record: IComment) => (
        <Space size="middle">{productId + " / " + record.product}</Space>
      ),
    },
    {
      title: "امتیاز",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "ایمیل",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "شماره تماس",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "عملیات",
      key: "action",
      render: (_: any, record: IComment) => (
        <Space size="middle">
          <Tag
            color="blue"
            onClick={() => {
              setModalComment(record);
              const buttons = record.accept
                ? [
                    <Button
                      key="hidden"
                      // onClick={() => {
                      //   PackageTransaction(OrderUrl.READY_PACKAGE, record.id);
                      //   setModalVisible(false);
                      // }}
                    >
                      عدم نمایش
                    </Button>,
                    <Button
                      key="delete"
                      // onClick={() => {
                      //   PackageTransaction(OrderUrl.READY_PACKAGE, record.id);
                      //   setModalVisible(false);
                      // }}
                    >
                      حذف کامنت
                    </Button>,
                  ]
                : [
                    <Button
                      key="show"
                      // onClick={() => {
                      //   PackageTransaction(OrderUrl.READY_PACKAGE, record.id);
                      //   setModalVisible(false);
                      // }}
                    >
                      تایید کامنت
                    </Button>,
                    <Button
                      key="delete"
                      // onClick={() => {
                      //   PackageTransaction(OrderUrl.READY_PACKAGE, record.id);
                      //   setModalVisible(false);
                      // }}
                    >
                      حذف کامنت
                    </Button>,
                  ];
              setModalBtn(buttons);
              setModalVisible(true);
            }}
          >
            نمایش کامنت
          </Tag>
        </Space>
      ),
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست کامنت‌ها</h1>

        <Table
          columns={columns}
          dataSource={comments}
          // pagination={false}
        />
      </div>

      <Modal
        visible={modalVisible}
        title={
          "کامنت " + (modalComment && modalComment.id ? modalComment.id : "")
        }
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        footer={modalBtn}
      >
        {modalComment && (
          <div>
            <p>نام نظر دهنده: {modalComment.name}</p>
            <p>نام محصول: {modalComment.product}</p>
            <p>موبایل: {modalComment.mobile}</p>
            <p>ایمیل: {modalComment.email}</p>
            <p>امتیاز: {modalComment.score}</p>
            <p>توضیح: {modalComment.description}</p>
            <p>وضعیت: {modalComment.accept ? "تائید شده" : "تائید نشده"} </p>
          </div>
        )}
      </Modal>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  comments: state.auth ? state.auth.comments : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
