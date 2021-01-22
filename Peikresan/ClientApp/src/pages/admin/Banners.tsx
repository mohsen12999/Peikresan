import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, message, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { IBanner } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, Status } from "../../shares/Constants";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";

import "./Admin.css";

interface IBannersProps {
  banners: IBanner[];
  status: Status;

  RemoveElement: Function;
  ResetStatus: Function;
}

const Banners: React.FC<IBannersProps> = ({
  banners,
  status,
  RemoveElement,
  ResetStatus,
}) => {
  //React.useEffect(() => {
  if (status === Status.SUCCEEDED) {
    message.success("با موفقیت حذف شد.");
    ResetStatus();
  } else if (status === Status.FAILED) {
    message.error("اشکال در حذف");
    ResetStatus();
  }
  //}, [status]);

  const columns = [
    {
      title: "شماره",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "عنوان",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "تصویر",
      dataIndex: "img",
      key: "img",
      render: (img: string, record: IBanner) => (
        <Space size="middle">
          <img style={{ maxWidth: "75px" }} src={img} alt={record.title} />
        </Space>
      ),
    },
    {
      title: "عملیات",
      key: "action",
      render: (_: any, record: IBanner) => (
        <Space size="middle">
          <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={() => {
              if (status === Status.LOADING) return;
              RemoveElement(
                AdminDataUrl.REMOVE_BANNER_URL,
                AdminDataModel.Banners,
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
          </Popconfirm>
          <Link to={"/admin/banner/" + record.id}>
            <Tag color="blue">تغییر</Tag>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست بنرها</h1>

        <Tooltip title="بنر جدید">
          <Link to={AdminPath.Banner} className="float-add-btn">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Tooltip>

        <Table columns={columns} dataSource={banners} pagination={false} />
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  banners: state.auth ? state.auth.banners : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Banners);
