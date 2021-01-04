import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

import { IMoreBtn } from "../shares/Interfaces";
import "./MultiCarousel.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 4,
  },
};

interface IMultiCarouselProps {
  title: string;
  images: string[];
  more?: IMoreBtn;
}

const MultiCarousel: (props: IMultiCarouselProps) => JSX.Element = ({
  title,
  images,
  more,
}) => (
  <div>
    <h3 className="header-title">{title}</h3>
    <Carousel
      autoPlay={false}
      swipeable={true}
      responsive={responsive}
      arrows={false}
      removeArrowOnDeviceType={["tablet", "mobile"]}
      deviceType={"mobile"}
    >
      {images.map((img) => (
        <div>
          <img src={img} alt="multi-slide" className="multi-slide-img" />
        </div>
      ))}
      {more && more.show && (
        <div className="more-link-div">
          <Link to={more.link}>{more.title}</Link>
        </div>
      )}
    </Carousel>
  </div>
);

export default MultiCarousel;
