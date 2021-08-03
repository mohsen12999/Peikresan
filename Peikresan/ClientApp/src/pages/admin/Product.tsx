import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Input,
  Space,
  Button,
  InputNumber,
  Checkbox,
  Cascader,
  Switch,
} from "antd";
import {
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { ICategory, IProduct } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";
import { AdminDataModel, Status } from "../../shares/Constants";
import { MakeCategoryTree } from "../../shares/Functions";
import { useHistory } from "react-router-dom";

import "./Admin.css";
import { CascaderValueType } from "antd/lib/cascader";

const { TextArea } = Input;

interface IProductProps {
  products: IProduct[];
  categories: ICategory[];
  status: Status;

  AddOrChangeElement: Function;
}

interface IParamTypes {
  id: string;
}

const Product: React.FC<IProductProps> = ({
  products,
  categories,
  status,

  AddOrChangeElement,
}) => {
  const history = useHistory();

  const { id } = useParams<IParamTypes>();

  const [file, setFile] = React.useState<File>();
  const [title, setTitle] = React.useState<string>();
  const [barcode, setBarcode] = React.useState<number>();
  const [max, setMax] = React.useState<number>();
  const [description, setDescription] = React.useState<string>();
  const [order, setOrder] = React.useState<number>();
  //const [category, setCategory] = React.useState<string>();
  const [categoryCascade, setCategoryCascade] =
    React.useState<CascaderValueType>([]);
  const [soldByWeight, setSoldByWeight] = React.useState(false);
  const [minWeight, setMinWeight] = React.useState<number>();
  const [confirm, setConfirm] = React.useState<boolean>(false);
  const [showImage, setShowImage] = React.useState<string>();

  const validateInputs = () => title && title.length > 1;

  if (id !== undefined) {
    const product = products.find((p) => p.id === Number(id));

    if (product !== undefined && title === undefined) {
      setTitle(product.title);
      setBarcode(product.barcode);
      setMax(product.max);
      setDescription(product.description);
      setOrder(product.order);
      setSoldByWeight(product.soldByWeight);
      setMinWeight(product.minWeight);
      setShowImage(product.img);
      setConfirm(product.confirm);
      setCategoryCascade([product.category]);
    }
  }

  const sendData = () => {
    if (!validateInputs() || status === Status.LOADING) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("file", file ? file : "");
    formData.append("title", title ? title : "");
    formData.append("barcode", String(barcode));
    formData.append("max", String(max));
    formData.append("description", description ? description : "");
    formData.append("order", String(order));
    formData.append(
      "category",
      categoryCascade.length > 0
        ? String(categoryCascade[categoryCascade.length - 1])
        : ""
    );

    formData.append("soldByWeight", String(soldByWeight));
    formData.append("minWeight", String(minWeight));
    formData.append("confirm", String(confirm));

    AddOrChangeElement(
      AdminDataUrl.ADD_CHANGE_PRODUCT_URL,
      AdminDataModel.Products,
      formData,
      AdminPath.Products,
      history
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
            value={categoryCascade}
            onChange={(value) => {
              setCategoryCascade(value);
              // if (value.length > 0) {
              //   setCategory(String(value[value.length - 1]));
              // }
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

          <div>
            تايید شده
            <Switch
              defaultChecked={confirm}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={(checked) => {
                setConfirm(checked);
              }}
            />
          </div>

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
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
