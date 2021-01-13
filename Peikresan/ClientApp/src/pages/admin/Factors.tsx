import React from "react";
import { connect } from "react-redux";
import { Table, Space } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IAdminFactor } from "../../shares/Interfaces";
import { OrderStatusDescription } from "../../shares/Functions";

import "./Admin.css";

interface IFactorsProps {
  factors: IAdminFactor[];
}

const Factors: React.FC<IFactorsProps> = ({ factors }) => {
  const columns = [
    {
      title: "شماره",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "نام خریدار",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "وضعیت سفارش",
      key: "orderStatus",
      render: (_: any, record: IAdminFactor) => (
        <Space size="middle">
          {OrderStatusDescription(record.factorStatusDescription)}
        </Space>
      ),
    },
    {
      title: "مجموع قیمت",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "شماره پیگیری",
      dataIndex: "traceNumber",
      key: "traceNumber",
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست فاکتور‌ها</h1>
        {factors.length > 0 ? (
          <Table columns={columns} dataSource={factors} pagination={false} />
        ) : (
          <h2>فاکتوری برای شما وجود ندارد</h2>
        )}
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  factors: state.auth ? state.auth.factors : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Factors);
