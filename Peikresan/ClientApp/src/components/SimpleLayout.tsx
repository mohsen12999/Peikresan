import React from "react";
import { PageHeader } from "antd";
import { CartPath, HomePath } from "../shares/URLs";
import { useHistory } from "react-router-dom";

interface ISimpleLayoutProps {
  title: string;
  subTitle: string;
  backPage: CartPath | HomePath;
}

const SimpleLayout: React.FC<ISimpleLayoutProps> = ({
  title,
  subTitle,
  backPage,
  children,
}) => {
  const history = useHistory();

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push(backPage)}
        title={title}
        subTitle={subTitle}
      />
      <div>{children}</div>
    </div>
  );
};

export default SimpleLayout;
