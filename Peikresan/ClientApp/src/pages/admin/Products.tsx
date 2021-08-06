import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  Tag,
  Space,
  Popconfirm,
  Tabs,
  Tooltip,
  Button,
  Input,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { IProduct } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, Status } from "../../shares/Constants";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";

const { TabPane } = Tabs;
const { Search } = Input;

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
  //ResetStatus,
}) => {
  const [searchText, setSearchText] = React.useState("");
  const [searchedProducts, setSearchedProducts] = React.useState<IProduct[]>(
    []
  );

  React.useEffect(() => {
    if (!searchText || searchText.length == 0) {
      setSearchedProducts(products);
    }
    setSearchedProducts(
      products.filter(
        (p) =>
          p.title.includes(searchText) || String(p.barcode).includes(searchText)
      )
    );
  }, [products, searchText]);

  const columns = [
    {
      title: "شماره",
      dataIndex: "id",
      key: "id",
      sorter: (a: IProduct, b: IProduct) => a.id - b.id,
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
        <Search
          placeholder="input search text"
          value={searchText}
          onSearch={(value) => setSearchText(value)}
          style={{ width: 200 }}
        />

        <Tooltip title="کالای جدید">
          <Link to="/admin/product" className="float-add-btn">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Tooltip>

        {/* <Table columns={columns} dataSource={products} pagination={false} /> */}

        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="کالاهای تائید شده" key="1">
              <h2>لیست کالاهای تائید شده</h2>
              <Table
                columns={columns}
                dataSource={searchedProducts.filter((p) => p.confirm)}
                //pagination={false}
              />
            </TabPane>
            <TabPane tab="کالاهای تائید نشده" key="2">
              <h2>لیست کالاهای تائید نشده</h2>
              <Table
                columns={columns}
                dataSource={searchedProducts.filter((p) => !p.confirm)}
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
  products: state.auth ? state.auth.products : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
