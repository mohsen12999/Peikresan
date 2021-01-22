import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import MyLayout from "../../components/MyLayout";
import ProductThumbnail from "../../components/ProductThumbnail";
import { IProduct } from "../../shares/Interfaces";
import { ApplicationState } from "../../store";

import "./Category.css";

interface ISearchProps {
  products: IProduct[];
}

interface IParamTypes {
  text: string;
}

const Search: React.FC<ISearchProps> = ({ products }) => {
  const { text } = useParams<IParamTypes>();
  const searchTxt = text === undefined ? "" : text.trim();
  const selectedProduct = products.filter((p) => p.title.includes(searchTxt));

  // products
  return (
    <MyLayout>
      <div>
        <h2>نتایج جستجو در مورد {searchTxt}</h2>
        {selectedProduct && selectedProduct.length > 0 ? (
          <section className="product-list">
            {products.map((product) => (
              <div className="product-thumbnail" key={product.id}>
                <ProductThumbnail product={product} />
              </div>
            ))}
          </section>
        ) : (
          <p>کالا پیدا نشد</p>
        )}
      </div>
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  products: state.data ? state.data.products : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
