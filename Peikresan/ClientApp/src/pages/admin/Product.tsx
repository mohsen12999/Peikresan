import React from "react";
import { connect } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import {
  Input,
  Space,
  Button,
  InputNumber,
  // AutoComplete,
  Checkbox,
  Cascader,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { ICategory, IProduct } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminPath, AdminDataUrl, LOGIN_URL } from "../../shares/URLs";
import { AdminDataModel, Status } from "../../shares/Constants";
import { MakeCategoryTree } from "../../shares/Functions";

import "./Admin.css";

const { TextArea } = Input;

interface IProductProps {
  products: IProduct[];
  categories: ICategory[];
  status: Status;

  AddOrChangeElement: Function;
  ResetStatus: Function;
}

interface IParamTypes {
  id: string;
}

const Product: React.FC<IProductProps> = ({
  products,
  categories,
  status,

  AddOrChangeElement,
  ResetStatus,
}) => {
  const { id } = useParams<IParamTypes>();
  const history = useHistory();

  const [file, setFile] = React.useState<File>();
  const [title, setTitle] = React.useState<string>();
  const [barcode, setBarcode] = React.useState<number>();
  const [price, setPrice] = React.useState<number>();
  const [max, setMax] = React.useState<number>();
  const [description, setDescription] = React.useState<string>();
  const [order, setOrder] = React.useState<number>();
  const [category, setCategory] = React.useState<string>();
  const [soldByWeight, setSoldByWeight] = React.useState(false);
  const [minWeight, setMinWeight] = React.useState<number>();
  const [showImage, setShowImage] = React.useState<string>();

  //React.useEffect(() => {
  if (status === Status.SUCCEEDED) {
    history.push(AdminPath.Products);
    message.success("با موفقیت ذخیره شد.");
    return ResetStatus();
  } else if (status === Status.FAILED) {
    message.error("اشکال در ذخیره");
    return ResetStatus();
  }
  //}, [status]);

  const validateInputs = () => title && title.length > 1 && price;

  if (id !== undefined) {
    const product = products.find((p) => p.id === Number(id));

    if (product !== undefined && title === undefined) {
      setTitle(product.title);
      setBarcode(product.barcode);
      setPrice(product.price);
      setMax(product.max);
      setDescription(product.description);
      setOrder(product.order);
      setSoldByWeight(product.soldByWeight);
      setMinWeight(product.minWeight);
      setShowImage(product.img);
    }
  }

  const sendData = () => {
    if (!validateInputs() || status === Status.LOADING) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("file", file ? file : "");
    formData.append("title", title ? title : "");
    formData.append("barcode", String(barcode));
    formData.append("price", String(price));
    formData.append("max", String(max));
    formData.append("description", description ? description : "");
    formData.append("order", String(order));
    formData.append("category", category ? category : "");
    formData.append("soldByWeight", soldByWeight ? "1" : "0");
    formData.append("minWeight", String(minWeight));

    AddOrChangeElement(
      AdminDataUrl.ADD_CHANGE_PRODUCT_URL,
      AdminDataModel.Products,
      formData
    );
  };

  return (
    <MyPrivateLayout>
      <div className="admin-container">
        <h1>محصول</h1>
        <Space direction="vertical">
          <img style={{ maxWidth: "300px" }} src={showImage} alt="عکس محصول" />
          <input
            id="product-img"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const file = files[0];
                setFile(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target ? e.target.result : undefined;
                  if (result) {
                    setShowImage(result as string);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <Button
            icon={<UploadOutlined />}
            onClick={() => {
              const productImage = document.getElementById("product-img");
              if (productImage) {
                productImage.click();
              }
            }}
          >
            بارگزاری عکس
          </Button>

          <Input
            className="input-style"
            placeholder="نام محصول"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <InputNumber
            className="input-style"
            placeholder="قیمت"
            value={price}
            onChange={(value) => {
              setPrice(Number(value));
            }}
          />
          <InputNumber
            className="input-style"
            placeholder="بارکد"
            value={barcode}
            onChange={(value) => {
              setBarcode(Number(value));
            }}
          />
          <InputNumber
            className="input-style"
            value={max}
            placeholder="حداکثر تعداد"
            onChange={(value) => {
              setMax(Number(value));
            }}
          />
          <TextArea
            rows={4}
            value={description}
            placeholder="توضیحات"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <InputNumber
            className="input-style"
            value={order}
            placeholder="ترتیب"
            onChange={(value) => {
              setOrder(Number(value));
            }}
          />

          {/* <AutoComplete
                options={context.categories.map((cat) => ({
                  value: cat.title,
                }))}
                placeholder="نام دسته بندی"
                filterOption={(inputValue, option) =>
                  option.value.indexOf(inputValue) !== -1
                }
              /> */}

          <Cascader
            style={{ width: "100%" }}
            options={MakeCategoryTree(0, categories)}
            placeholder="نام دسته بندی"
            onChange={(value) => {
              if (value.length > 0) {
                setCategory(String(value[value.length - 1]));
              }
            }}
          />

          <Checkbox
            /* checked={checked} */
            checked={soldByWeight}
            onChange={(e) => {
              setSoldByWeight(e.target.checked);
            }}
          >
            خرید وزنی
          </Checkbox>
          {soldByWeight && (
            <InputNumber
              value={minWeight}
              placeholder="وزن پایه"
              onChange={(value) => {
                setMinWeight(Number(value));
              }}
            />
          )}

          <Button
            type="primary"
            disabled={!validateInputs()}
            onClick={sendData}
          >
            ذخیره
          </Button>
        </Space>
      </div>
    </MyPrivateLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  products: state.auth ? state.auth.products : [],
  categories: state.auth ? state.auth.categories : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  AddOrChangeElement: actionCreators.addOrChangeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);