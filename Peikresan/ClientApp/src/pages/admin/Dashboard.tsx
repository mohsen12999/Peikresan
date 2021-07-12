import React from "react";
import { connect } from "react-redux";
import { Statistic, Row, Col, Button, Card, Divider } from "antd";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { Link } from "react-router-dom";
import { ApplicationState } from "../../store";
import { GetUsersRoleName } from "../../shares/Functions";
import {
  IComment,
  IOrder,
  IProduct,
  ISubOrder,
  IUser,
} from "../../shares/Interfaces";
import { UserRole } from "../../shares/Constants";
import { AdminPath } from "../../shares/URLs";

interface IDashboardProps {
  role: string;
  orders: IOrder[];
  subOrders: ISubOrder[];
  products: IProduct[];
  users: IUser[];
  comments: IComment[];
}

const dashboard: React.FC<IDashboardProps> = ({
  role,
  orders,
  subOrders,
  products,
  users,
  comments,
}) => (
  <MyPrivateLayout>
    <h1>داشبورد {GetUsersRoleName(role)}</h1>
    <h3>خوش آمدید</h3>

    <Divider dashed />

    {role.toLocaleUpperCase() === UserRole.ADMIN && (
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="تعداد کالا" value={products.length} />
            <Link to={AdminPath.Products}>
              <Button style={{ marginTop: 16 }} type="primary">
                نمایش کالاها
              </Button>
            </Link>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="تعداد فروشگاه"
              value={
                users.filter((u) => u.role.toUpperCase() === UserRole.SELLER)
                  .length
              }
            />
            <Link to={AdminPath.Users}>
              <Button style={{ marginTop: 16 }} type="primary">
                نمایش فروشگاه‌ها
              </Button>
            </Link>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="تعداد پیک"
              value={
                users.filter((u) => u.role.toUpperCase() === UserRole.DELIVERY)
                  .length
              }
            />
            <Link to={AdminPath.Users}>
              <Button style={{ marginTop: 16 }} type="primary">
                نمایش پیک‌ها
              </Button>
            </Link>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="تعداد کامنت" value={comments.length} />
            <Link to={AdminPath.Comments}>
              <Button style={{ marginTop: 16 }} type="primary">
                نمایش کامنت‌ها
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    )}
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="تعداد سفارش"
            value={
              role.toLocaleUpperCase() === UserRole.SELLER
                ? subOrders.length
                : orders.length
            }
          />
          <Link
            to={
              role.toLocaleUpperCase() === UserRole.ADMIN
                ? AdminPath.Orders
                : role.toLocaleUpperCase() === UserRole.SELLER
                ? AdminPath.SellerOrders
                : role.toLocaleUpperCase() === UserRole.DELIVERY
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
      <Col span={6}>
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
  role: state.auth ? state.auth.role : "",
  orders: state.auth ? state.auth.orders : [],
  subOrders: state.auth ? state.auth.subOrders : [],
  products: state.auth ? state.auth.products : [],
  users: state.auth ? state.auth.users : [],
  comments: state.auth ? state.auth.comments : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(dashboard);
