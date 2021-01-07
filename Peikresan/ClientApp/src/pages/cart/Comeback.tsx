import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { useParams, useLocation, Link } from "react-router-dom";

import MyLayout from "../../components/MyLayout";
import { ApplicationState } from "../../store";
import { actionCreators as dataActionCreators } from "../../store/Data";
import { actionCreators as shopCartActionCreators } from "../../store/ShopCart";
import { CalculateTotalPrice } from "../../shares/Functions";
import { IProduct } from "../../shares/Interfaces";

interface IComebackProps {
  shopCart: number[];
  products: IProduct[];
  ArchivedFactor: Function;
  ResetShopCart: Function;
}

interface IParamTypes {
  id: string;
}

const Comeback: React.FC<IComebackProps> = ({
  shopCart,
  products,
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
        CalculateTotalPrice(shopCart, products)
      );
      ResetShopCart();
    }
  }

  return (
    <MyLayout>
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
          <Link to="/">
            <Button type="primary">بازگشت به صفحه اصلی</Button>
          </Link>
        </div>
      )}
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  shopCart: state.shopCart ? state.shopCart.shopCart : [],
  products: state.data ? state.data.products : [],
});

const mapDispatchToProps = {
  ArchivedFactor: dataActionCreators.archivedFactor,
  ResetShopCart: shopCartActionCreators.resetShopCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comeback);
