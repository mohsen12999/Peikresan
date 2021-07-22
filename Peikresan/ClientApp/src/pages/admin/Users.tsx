import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, Tooltip, Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IUser } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminDataUrl, AdminPath } from "../../shares/URLs";
import { AdminDataModel, Status, UserRole } from "../../shares/Constants";

const { TabPane } = Tabs;

import "./Admin.css";

interface IUsersProps {
  users: IUser[];
  status: Status;

  RemoveElement: Function;
}

const Users: React.FC<IUsersProps> = ({ users, status, RemoveElement }) => {
  const columns = [
    {
      title: "عنوان",
      key: "title",
      dataIndex: "title",
      render: (title: string, record: IUser) => (
        <Space size="middle">{title}</Space>
      ),
    },
    {
      title: "نام و نام خانوادگی",
      key: "fullName",
      dataIndex: "fullName",
      render: (fullName: string, record: IUser) => (
        <Space size="middle">{fullName}</Space>
      ),
    },
    {
      title: "نقش",
      key: "role",
      dataIndex: "role",
      render: (role: string, record: IUser) => (
        <Space size="middle">{role}</Space>
      ),
    },
    {
      title: "عملیات",
      key: "action",
      render: (text: any, record: IUser) => (
        <Space size="middle">
          <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={(e) => {
              if (status === Status.LOADING) return;
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
          <Tag
            color="blue"
            onClick={() => {
              // open modal
            }}
          >
            نمایش کاربر
          </Tag>
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

        {/* <Table columns={columns} dataSource={users} pagination={false} /> */}

        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="فروشگاه‌ها" key="1">
              <h2>لیست فروشگاه‌ها</h2>
              <Table
                columns={columns}
                dataSource={users.filter(
                  (u) => u.role.toUpperCase() === UserRole.SELLER
                )}
                //pagination={false}
              />
            </TabPane>
            <TabPane tab="پیک‌ها" key="2">
              <h2>لیست پیک‌ها</h2>
              <Table
                columns={columns}
                dataSource={users.filter(
                  (u) => u.role.toUpperCase() === UserRole.DELIVERY
                )}
                //pagination={false}
              />
            </TabPane>
            <TabPane tab="مدیران سایت" key="3">
              <h2>لیست مدیران سایت</h2>
              <Table
                columns={columns}
                dataSource={users.filter(
                  (u) => u.role.toUpperCase() === UserRole.ADMIN
                )}
                //pagination={false}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  users: state.auth ? state.auth.users : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
