import React from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Input, Space, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IBanner } from "../../shares/Interfaces";
import { actionCreators } from "../../store/Auth";
import { AdminPath, AdminDataUrl } from "../../shares/URLs";
import { AdminDataModel, Status } from "../../shares/Constants";

interface IBannerProps {
  banners: IBanner[];
  status: Status;

  AddOrChangeElement: Function;
  ResetStatus: Function;
}
interface IParamTypes {
  id: string;
}

const Banner: React.FC<IBannerProps> = ({
  banners,
  status,
  AddOrChangeElement,
  ResetStatus,
}) => {
  const { id } = useParams<IParamTypes>();
  const history = useHistory();

  const [file, setFile] = React.useState<File>();
  const [title, setTitle] = React.useState<string>();
  const [url, setUrl] = React.useState<string>();
  const [showImage, setShowImage] = React.useState<string>();

  //React.useEffect(() => {
  if (status === Status.SUCCEEDED) {
    message.success("با موفقیت ذخیره شد.");
    history.push(AdminPath.Categories);
    return ResetStatus();
  } else if (status === Status.FAILED) {
    message.error("اشکال در ذخیره");
    return ResetStatus();
  }
  //}, [status]);

  const validateInputs = () => title && title.length > 1 && url;

  if (id) {
    const banner = banners.find((b) => b.id === Number(id));
    if (banner && title === undefined) {
      setTitle(banner.title);
      setUrl(banner.url);
      setShowImage(banner.img);
    }
  }

  const sendData = () => {
    if (!validateInputs() || status == Status.LOADING) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("file", file ? file : "");
    formData.append("title", title ? title : "");
    formData.append("url", url ? url : "");

    AddOrChangeElement(
      AdminDataUrl.ADD_CHANGE_BANNER_URL,
      AdminDataModel.Banners,
      formData
    );
  };

  return (
    <MyPrivateLayout>
      <div className="admin-container">
        <h1>بنر</h1>
        <Space direction="vertical">
          <img style={{ maxWidth: "300px" }} src={showImage} alt="عکس بنر" />
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
              const productImageElement = document.getElementById(
                "product-img"
              );
              if (productImageElement) {
                productImageElement.click();
              }
            }}
          >
            بارگزاری عکس
          </Button>

          <Input
            className="input-style"
            placeholder="نام بنر"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <Input
            className="input-style"
            placeholder="لینک بنر"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
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
  banners: state.auth ? state.auth.banners : [],
  status: state.auth ? state.auth.status : Status.INIT,
});

const mapDispatchToProps = {
  AddOrChangeElement: actionCreators.addOrChangeElement,
  ResetStatus: actionCreators.resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
