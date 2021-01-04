import React from "react";
import { Link } from "react-router-dom";

import CategoryThumbnail from "./CategoryThumbnail";
import { IMoreBtn,ICategory } from "../shares/Interfaces";

import "./ScrollbarsList.css";

interface ICategoryScrollbarsListProps {
  title:string;
  categories?:ICategory[];
  more:IMoreBtn;
}

const CategoryScrollbarsList:(props:ICategoryScrollbarsListProps)=>JSX.Element = ({ title, categories, more }) => (
  <section className="scrollbar-main-section">
    <div className="scrollbar-title-div">
      <h4 className="scrollbar-title">
        {title}{" "}
        <Link style={{ float: "left" }} to={more.link}>
          مشاهده همه
        </Link>
      </h4>
    </div>
    <section className="scrollbar-list-row">
      {categories && categories.length > 0 && (
        <React.Fragment>
          {categories.map((cat) => (
            <div className="product-thumbnail" key={cat.id}>
              <CategoryThumbnail {...cat} />
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

export default CategoryScrollbarsList;
