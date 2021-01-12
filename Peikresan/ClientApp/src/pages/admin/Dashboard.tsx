import React from "react";
import { connect } from "react-redux";
import { Statistic, Row, Col, Button, Card, Divider } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { FilterOrders } from "../../shares/services/OrderFunctions";
import { Link } from "react-router-dom";
import { ApplicationState } from "../../store";
import { GetUsersRoleName } from "../../shares/Functions";
import { IOrder, ISubOrder } from "../../shares/Interfaces";
import { AdminPath, UserRole } from "../../shares/Constants";

interface IDashboardProps {
  role: string;
  orders: IOrder[];
  subOrders: ISubOrder[];
}

const dashboard: React.FC<IDashboardProps> = ({ role, orders, subOrders }) => (
  <MyPrivateLayout>
    <h1>داشبورد {GetUsersRoleName(role)}</h1>
    <h3>خوش آمدید</h3>

    <Divider dashed />

    <Row gutter={16}>
      <Col span={12}>
        <Card>
          <Statistic
            title="تعداد سفارش"
            value={
              role.toLocaleUpperCase() == UserRole.SELLER
                ? subOrders.length
                : orders.length
            }
          />
          <Link
            to={
              role.toLocaleUpperCase() == UserRole.ADMIN
                ? AdminPath.Orders
                : role.toLocaleUpperCase() == UserRole.SELLER
                ? AdminPath.SellerOrders
                : role.toLocaleUpperCase() == UserRole.DELIVERY
                ? AdminPath.DeliverOrders
                : ""
            }
          >
            <Button style={{ marginTop: 16 }} type="primary">
              نمایش سفارش‌ها
            </Button>
          </Link>
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Statistic
            title="تعداد فاکتورها"
            value={orders.filter((o) => o.orderStatus >= 45).length}
          />
          <Link to={AdminPath.Factors}>
            <Button style={{ marginTop: 16 }} type="primary">
              نمایش فاکتورها
            </Button>
          </Link>
        </Card>
      </Col>
    </Row>
  </MyPrivateLayout>
);

const mapStateToProps = (state: ApplicationState) => ({
  role: state.auth?.role ?? "",
  orders: state.auth ? state.auth.orders : [],
  subOrders: state.auth ? state.auth.subOrders : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(dashboard);
