import React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";

import { ICategory } from "../constants/Interfaces";
import "./ProductThumbnail.css";

const { Meta } = Card;


const CategoryThumbnail:(props:ICategory)=>JSX.Element = ({ id, img, title }) => (
  <Link to={"/category/" + id}>
  <Card
    className="product-thumb-card"
    hoverable
    cover={
      
        <img
          className="product-image-thumb"
          alt={"تصویر" + title}
          src={img && img !== "" ? img : "/img/category/cat-0.png"}
        />
    }
  >
    <Meta className="persian-number" title={title} />
  </Card>
  </Link>
);

export default CategoryThumbnail;
