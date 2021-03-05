import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { useParams, useLocation, Link } from "react-router-dom";

import SimpleLayout from "../../components/SimpleLayout";
import { ApplicationState } from "../../store";
import { actionCreators as dataActionCreators } from "../../store/Data";
import { actionCreators as shopCartActionCreators } from "../../store/ShopCart";
import { CalculateTotalPrice } from "../../shares/Functions";
import { IProduct, ISellOptions } from "../../shares/Interfaces";
import { HomePath } from "../../shares/URLs";

interface IComebackProps {
  shopCart: number[];
  products: IProduct[];
  deliverAtDoor: boolean;
  sellOptions?: ISellOptions;

  ArchivedFactor: Function;
  ResetShopCart: Function;
}

interface IParamTypes {
  id: string;
}

const Comeback: React.FC<IComebackProps> = ({
  shopCart,
  products,
  deliverAtDoor,
  sellOptions,
  ArchivedFactor,
  ResetShopCart,
}) => {
  const { id } = useParams<IParamTypes>(); // order id
  let query = new URLSearchParams(useLocation().search);

  if (Number(id) !== 0) {
    if (shopCart.filter((sc) => sc > 0).length > 0) {
      ArchivedFactor(
        Number(id),
        shopCart,
        CalculateTotalPrice(shopCart, products, deliverAtDoor, sellOptions)
      );
      ResetShopCart();
    }
  }

  return (
    <SimpleLayout
      title="نتیجه عملیات بانکی"
      subTitle=""
      backPage={HomePath.Home}
    >
      {Number(id) === 0 ? (
        <div>
          <h1>اشکال در پرداخت بانکی</h1>
          <p>{query.get("error")}</p>
        </div>
      ) : (
        <div>
          <h1>پرداخت موفق بود</h1>
          <p>شماره سفارش: {id}</p>
          <p>شماره پیگیری: {query.get("trace_number")}</p>
          <Link to={HomePath.Home}>
            <Button type="primary">بازگشت به صفحه اصلی</Button>
          </Link>
        </div>
      )}
    </SimpleLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
  products: state.data ? state.data.products : [],
  deliverAtDoor: state.shopCart ? state.shopCart.deliverAtDoor : false,
  sellOptions: state.data ? state.data.sellOptions : undefined,
});

const mapDispatchToProps = {
  ArchivedFactor: dataActionCreators.archivedFactor,
  ResetShopCart: shopCartActionCreators.resetShopCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comeback);
