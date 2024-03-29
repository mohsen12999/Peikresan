import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, message, Tooltip, Button } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

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
  UploadFile: Function;
}

const SellerProducts: React.FC<ISellerProductsProps> = ({
  sellerProducts,
  status,
  RemoveElement,
  UploadFile,
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
      title: "بارکد",
      dataIndex: "productBarcode",
      key: "productBarcode",
    },
    {
      title: "تعداد",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "قیمت",
      dataIndex: "price",
      key: "price",
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
                record.productId
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
          <Link to={AdminPath.SellerProduct + record.productId}>
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
        <Tooltip title="بارگزاری فایل اکسل محصولات">
          <input
            type="file"
            name="excel_file"
            id="excel_file"
            className="hidden-input"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                var formData = new FormData();
                formData.append("file", files[0] ? files[0] : "");

                UploadFile(
                  AdminDataUrl.UPLOAD_SELLER_PRODUCT_URL,
                  formData,
                  AdminDataModel.SellerProducts
                );
              }
            }}
          />
          <Button
            icon={<UploadOutlined />}
            onClick={() => {
              document.getElementById("excel_file")?.click();
            }}
            className="float-upload-btn"
          >
            فایل اکسل محصولات
          </Button>
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
  UploadFile: actionCreators.uploadFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerProducts);
