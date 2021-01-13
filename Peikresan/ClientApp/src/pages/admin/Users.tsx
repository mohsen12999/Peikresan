import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IUser } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminDataUrl, AdminPath } from "../../shares/URLs";
import { AdminDataModel, Status } from "../../shares/Constants";

import "./Admin.css";

interface IUsersProps {
  users: IUser[];
  status: Status;

  RemoveElement: Function;
  ResetStatus: Function;
}

const Users: React.FC<IUsersProps> = ({
  users,
  status,

  RemoveElement,
  ResetStatus,
}) => {
  const columns = [
    {
      title: "نام و نام خانوادگی",
      key: "fullName",
      dataIndex: "fullName",
      render: (fullName, record) => <Space size="middle">{fullName}</Space>,
    },
    {
      title: "نقش",
      key: "role",
      dataIndex: "role",
      render: (role, record) => <Space size="middle">{role}</Space>,
    },
    {
      title: "عملیات",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={(e) => {
              if (status == Status.LOADING) return;
              RemoveElement(
                AdminDataUrl.REMOVE_USER_URL,
                AdminDataModel.Users,
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
          <Link to={AdminPath.User + record.id}>
            <Tag color="blue">تغییر</Tag>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست کاربران</h1>

        <Tooltip title="کاربر جدید">
          <Link to={AdminPath.User} className="float-add-btn">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Tooltip>

        <Table columns={columns} dataSource={users} pagination={false} />
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  users: state.auth?.users ?? [],
  status: state.auth?.status ?? Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
