import React from "react";
import { Link } from "react-router-dom";
import { IMoreBtn, IProduct } from "../shares/Interfaces";

import ProductThumbnail from "./ProductThumbnail";
import "./ScrollbarsList.css";

interface IScrollbarsListProps {
  title: string;
  products: IProduct[];
  more?: IMoreBtn;
}

const ScrollbarsList: React.FC<IScrollbarsListProps> = ({
  title,
  products,
  more,
}) => (
  <section className="scrollbar-main-section">
    <div className="scrollbar-title-div">
      <h4 className="scrollbar-title">
        {title}
        {more && (
          <Link style={{ float: "left" }} to={more.link}>
            مشاهده همه
          </Link>
        )}
      </h4>
    </div>
    <section className="scrollbar-list-row">
      {products && products.length > 0 && (
        <React.Fragment>
          {products.map((product) => (
            <div className="product-thumbnail" key={product.id}>
              <ProductThumbnail product={product} />
            </div>
          ))}
          {more && more.show && (
            <div className="product-thumbnail more-link-div">
              <Link to={more.link}>{more.title}</Link>
            </div>
          )}
        </React.Fragment>
      )}
    </section>
  </section>
);

export default ScrollbarsList;
