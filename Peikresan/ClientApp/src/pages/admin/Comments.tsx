import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { IComment } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, Status } from "../../shares/Constants";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";

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
  //React.useEffect(() => {
  // if (status === Status.SUCCEEDED) {
  //   message.success("با موفقیت حذف شد.");
  //   ResetStatus();
  // } else if (status === Status.FAILED) {
  //   message.error("اشکال در حذف");
  //   ResetStatus();
  // }
  //}, [status]);

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
          {/* <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={(e) => {
              if (status === Status.LOADING) return;
              RemoveElement(
                AdminDataUrl.REMOVE_CATEGORY_URL,
                AdminDataModel.Categories,
                record.id
              );
            }}
            onCancel={(e) => {
              console.log("cancel delete");
            }}
            okText="بله"
            cancelText="خیر"
          >
            <Tag color="red">حذف</Tag>
          </Popconfirm> */}
          <Link to={AdminPath.Category + record.id}>
            <Tag
              color="blue"
              // onClick={() => {
              //   console.log("edit cat", record.id);
              // }}
            >
              نمایش کامنت
            </Tag>
          </Link>
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
