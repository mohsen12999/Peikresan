import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import { HomePath } from "../../shares/URLs";
import SimpleLayout from "../../components/SimpleLayout";

const Notfound = () => (
  <SimpleLayout title="آدرس پیدا نشد" subTitle="" backPage={HomePath.Home}>
    <h4>صفحه مورد نظر پیدا نشد.</h4>
    <Link to={HomePath.Home}>
      <Button type="primary">بازگشت به صفحه اصلی</Button>
    </Link>
  </SimpleLayout>
);

export default Notfound;
