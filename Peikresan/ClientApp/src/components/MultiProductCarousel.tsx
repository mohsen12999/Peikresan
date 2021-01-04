import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { Link } from "react-router-dom";

import ProductThumbnail from "./ProductThumbnail";
import { IProduct, IMoreBtn } from "../shares/Interfaces";

import "./MultiProductCarousel.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

interface IMultiProductCarouselProps {
  products: IProduct[];
  more?: IMoreBtn;
}

const MultiProductCarousel: (
  props: IMultiProductCarouselProps
) => JSX.Element = ({ products, more }) => {
  const [carousel, setCarousel] = React.useState<Carousel | null>();

  React.useEffect(() => {
    if (carousel) {
      const width = window.innerWidth;
      if (width < 464) {
        carousel.goToSlide(5, true);
      } else if (width < 1024) {
        carousel.goToSlide(3, true);
      } else {
        carousel.goToSlide(2, true);
      }
    }
  }, [carousel]);

  return (
    <Carousel
      ref={(el) => {
        setCarousel(el);
      }}
      autoPlay={false}
      swipeable={true}
      responsive={responsive}
      arrows={false}
      removeArrowOnDeviceType={["tablet", "mobile"]}
      deviceType={"mobile"}
      className="carousel-class"
    >
      {products.map((product) => (
        <div className="product-thumbnail" key={product.id}>
          <ProductThumbnail {...product} />
        </div>
      ))}
      {more && more.show && (
        <div className="product-thumbnail more-link-div">
          <Link to={more.link}>{more.title}</Link>
        </div>
      )}
    </Carousel>
  );
};

export default MultiProductCarousel;
