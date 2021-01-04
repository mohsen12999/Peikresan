import React from "react";
import { IMoreBtn, IProduct } from "../shares/Interfaces";
import MultiProductCarousel from "./MultiProductCarousel";

interface IMultiProductCarouselWithTitleProps {
  title: string;
  products: IProduct[];
  more?: IMoreBtn;
}

const MultiProductCarouselWithTitle: (
  props: IMultiProductCarouselWithTitleProps
) => JSX.Element = ({ title, products, more }) => (
  <div>
    <h3 className="header-title">{title}</h3>
    <MultiProductCarousel products={products} more={more} />
  </div>
);

export default MultiProductCarouselWithTitle;
