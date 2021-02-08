import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Tag, Space, Popconfirm, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ICategory } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";
import { actionCreators } from "../../store/Auth";
import { AdminDataModel, Status } from "../../shares/Constants";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";

interface ICategoriesProps {
  categories: ICategory[];
  status: Status;

  RemoveElement: Function;
}

const Categories: React.FC<ICategoriesProps> = ({
  categories,
  status,
  RemoveElement,
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
      title: "عنوان دسته",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "تصویر دسته",
      dataIndex: "img",
      key: "img",
      render: (img: string, record: ICategory) => (
        <Space size="middle">
          <img style={{ maxWidth: "75px" }} src={img} alt={record.title} />
        </Space>
      ),
    },
    {
      title: "عملیات",
      key: "action",
      render: (_: any, record: ICategory) => (
        <Space size="middle">
          <Popconfirm
            title="از حذف اطمینان دارید؟"
            onConfirm={(e) => {
              if (status === Status.LOADING) return;
              RemoveElement(
                AdminDataUrl.REMOVE_CATEGORY_URL,
                AdminDataModel.Categories,
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
          <Link to={AdminPath.Category + record.id}>
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
        <h1>لیست دسته‌بندی‌ها</h1>

        <Tooltip title="دسته‌بندی جدید">
          <Link to={AdminPath.Category} className="float-add-btn">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        </Tooltip>

        <Table columns={columns} dataSource={categories} pagination={false} />
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  categories: state.auth ? state.auth.categories : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  RemoveElement: actionCreators.removeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
