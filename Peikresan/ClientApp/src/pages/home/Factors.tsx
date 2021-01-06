import React from "react";
import { connect } from "react-redux";

import MyLayout from "../../components/MyLayout";
import { IFactor } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";

interface IFactorsProps {
  factors: IFactor[];
}

const factors: React.FC<IFactorsProps> = ({ factors }) => (
  <MyLayout>
    <h1>فاکتور خرید شما</h1>
    {factors.length == 0 ? (
      <div>
        <h2>سابقه خریدی برای شما وجود ندارد</h2>
      </div>
    ) : (
      <div>شما {factors.length} فاکتور خرید دارید</div>
    )}
  </MyLayout>
);

const mapStateToProps = (state: ApplicationState) => ({
  products: state.data ? state.data.products : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(factors);
