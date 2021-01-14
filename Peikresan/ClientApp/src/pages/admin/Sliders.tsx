import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, message, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ISlider } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, Status } from "../../shares/Constants";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";

import "./Admin.css";

interface ISlidersProps {
  sliders: ISlider[];
  status: Status;

  RemoveElement: Function;
  ResetStatus: Function;
}

const Sliders: React.FC<ISlidersProps> = ({
  sliders,
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
      title: "تصویر",
      dataIndex: "img",
      key: "img",
      render: (img: string, record: ISlider) => (
        <Space size="middle">
          <img
            style={{ maxWidth: "75px" }}
            src={img}
            alt={"slider_" + record.id}
          />
        </Space>
      ),
    },
    {
      title: "عملیات",
      key: "action",
      render: (_: any, record: ISlider) => (
        <Space size="middle">
          <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={() => {
              if (status === Status.LOADING) return;
              RemoveElement(
                AdminDataUrl.REMOVE_SLIDER_URL,
                AdminDataModel.Sliders,
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
          <Link to={AdminPath.Slider + record.id}>
            <Tag
              color="blue"
              // onClick={() => {
              //   console.log("edit cat", record.id);
              // }}
            >
              تغییر
            </Tag>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست اسلایدرها</h1>

        <Tooltip title="کالای جدید">
          <Link to={AdminPath.Slider} className="float-add-btn">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Tooltip>

        <Table columns={columns} dataSource={sliders} pagination={false} />
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  sliders: state.auth ? state.auth.sliders : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sliders);
