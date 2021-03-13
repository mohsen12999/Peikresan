import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useParams } from "react-router-dom";

import { HomePath, OrderUrl } from "../../shares/URLs";
import SimpleLayout from "../../components/SimpleLayout";
import { IOrder, ISubOrder } from "../../shares/Interfaces";
import AddressSpan from "../../components/AddressSpan";

interface IParamTypes {
  id: string;
}

const Suborder = () => {
  const { id } = useParams<IParamTypes>();

  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [subOrder, setSubOrder] = React.useState<ISubOrder>();

  React.useEffect(() => {
    axios
      .post(OrderUrl.SUBORDER_DATA, { id })
      .then((response) => {
        if (response && response.data && response.data.success) {
          setLoading(false);
          setSuccess(true);
          setSubOrder(response.data.subOrder);
        } else {
          setLoading(false);
          setSuccess(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(false);
        console.log(error);
      });
  }, []);

  return (
    <SimpleLayout title="اطلاعات سفارش" subTitle="" backPage={HomePath.Home}>
      {loading ? (
        <h4>در حال دریافت اطلاعات</h4>
      ) : success ? (
        <div>
          <h4>اطلاعات سفارش {subOrder && subOrder.id}</h4>
          <ul>
            {subOrder &&
              subOrder.items.map((oi) => (
                <li>
                  {oi.title +
                    " - " +
                    oi.count +
                    " واحد - " +
                    oi.price +
                    " - " +
                    oi.price * oi.count}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div>خطا در دریافت اطلاعات</div>
      )}
      <Link to={HomePath.Home}>
        <Button type="primary">بازگشت به صفحه اصلی</Button>
      </Link>
    </SimpleLayout>
  );
};

export default Suborder;
