import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, message, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { IProduct } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, Status } from "../../shares/Constants";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";

import "./Admin.css";

interface IProductsProps {
  products: IProduct[];
  status: Status;

  RemoveElement: Function;
  ResetStatus: Function;
}

const Products: React.FC<IProductsProps> = ({
  products,
  status,
  RemoveElement,
  ResetStatus,
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
      title: "شماره",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "عنوان کالا",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "تصویر کالا",
      dataIndex: "img",
      key: "img",
      render: (img: string, record: IProduct) => (
        <Space size="middle">
          <img style={{ maxWidth: "75px" }} src={img} alt={record.title} />
        </Space>
      ),
    },
    {
      title: "دسته بندی",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "تايید",
      key: "confirm",
      render: (_: any, record: IProduct) => (
        <Space size="middle">
          {record.confirm ? "تايید شده" : "تايید نشده"}
        </Space>
      ),
    },
    {
      title: "عملیات",
      key: "action",
      render: (_: any, record: IProduct) => (
        <Space size="middle">
          <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={(e) => {
              if (status === Status.LOADING) return;
              RemoveElement(
                AdminDataUrl.REMOVE_PRODUCT_URL,
                AdminDataModel.Products,
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
          <Link to={AdminPath.Product + record.id}>
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
        <h1>لیست کالا ها</h1>

        <Tooltip title="کالای جدید">
          <Link to="/admin/product" className="float-add-btn">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Tooltip>

        <Table columns={columns} dataSource={products} pagination={false} />
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  products: state.auth ? state.auth.products : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
