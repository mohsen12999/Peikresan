import React from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Input, Space, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import MyPrivateLayout from "../../components/MyPrivateLayout";
import { ApplicationState } from "../../store";
import { IBanner } from "../../shares/Interfaces";

interface IBannerProps {
  banners: IBanner[];
}

interface IParamTypes {
  id: string;
}

const Banner: React.FC<IBannerProps> = ({ banners }) => {
  const { id } = useParams<IParamTypes>();

  let history = useHistory();

  const [file, setFile] = React.useState<File>();
  const [title, setTitle] = React.useState<string>();
  const [url, setUrl] = React.useState<string>();
  const [showImage, setShowImage] = React.useState<string>();

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
    if (!validateInputs()) return;

    var formData = new FormData();
    formData.append("id", id);
    formData.append("file", file ?? "");
    formData.append("title", title ?? "");
    formData.append("url", url ?? "");

    context.SendingBanner(formData).then((res) => {
      if (res && res.success) {
        history.push("/admin/banners");
      }
    });
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
                  const result = e.target?.result;
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
  banners: state.auth?.banners ?? [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
