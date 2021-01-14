import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, message, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ISellerProduct } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, Status } from "../../shares/Constants";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";

import "./Admin.css";

interface ISellerProductsProps {
  sellerProducts: ISellerProduct[];
  status: Status;

  RemoveElement: Function;
  ResetStatus: Function;
}

const SellerProducts: React.FC<ISellerProductsProps> = ({
  sellerProducts,
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
      title: "نام کالا",
      key: "product",
      render: (text: any, record: ISellerProduct) => (
        <Space size="middle">
          {record.productId + " - " + record.productTitle}
        </Space>
      ),
    },
    {
      title: "تعداد",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "عملیات",
      key: "action",
      render: (text: any, record: ISellerProduct) => (
        <Space size="middle">
          <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={(e) => {
              if (status === Status.LOADING) return;
              RemoveElement(
                AdminDataUrl.REMOVE_SELLER_PRODUCT_URL,
                AdminDataModel.SellerProducts,
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
          <Link to={AdminPath.SellerProduct + record.id}>
            <Tag color="blue">تغییر</Tag>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <MyPrivateLayout>
      <div>
        <h1>لیست کالاها</h1>

        <Tooltip title="کالای جدید">
          <Link to={AdminPath.SellerProduct} className="float-add-btn">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Tooltip>

        {sellerProducts.length > 0 ? (
          <Table
            columns={columns}
            dataSource={sellerProducts}
            pagination={false}
          />
        ) : (
          <div>
            <h3>برای شما کالایی ثبت نشده</h3>
            <Link to={AdminPath.SellerProduct}>
              <Button type="primary">ثبت کالا برای فروشگاه</Button>
            </Link>
          </div>
        )}
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  sellerProducts: state.auth ? state.auth.sellerProducts : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerProducts);
