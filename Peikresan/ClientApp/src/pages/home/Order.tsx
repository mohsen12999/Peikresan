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

const Order = () => {
  const { id } = useParams<IParamTypes>();

  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [order, setOrder] = React.useState<IOrder>();
  const [subOrders, setSubOrders] = React.useState<ISubOrder[]>();

  React.useEffect(() => {
    axios
      .post(OrderUrl.ORDER_DATA, { id })
      .then((response) => {
        if (response && response.data && response.data.success) {
          setLoading(false);
          setSuccess(true);
          setOrder(response.data.order);
          setSubOrders(response.data.suborders);
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
          <h4>اطلاعات سفارش {order && order.id}</h4>
          {subOrders &&
            subOrders.map((so) => (
              <div>
                <h4>نام فروشنده: {so.sellerName}</h4>
                <p>آدرس: {so.sellerAddress}</p>
                <p>لیست اقلام:</p>
                <ul>
                  {so.items.map((item) => (
                    <li>{item.title + " - " + item.count + " واحد"}</li>
                  ))}
                </ul>
              </div>
            ))}

          <div>
            <h4>آدرس خریدار: </h4>
            <div>{order && <AddressSpan {...order} />}</div>
            {order && order.deliverAtDoor && <p>تحویل درب واحد</p>}
            <p>نام خریدار: {order && order.name}</p>
          </div>
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

export default Order;
