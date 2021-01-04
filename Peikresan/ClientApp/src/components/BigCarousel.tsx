import React from "react";
import { Carousel } from "antd";

import "./BigCarousel.css";

const BigCarousel = () => (
  <Carousel autoplay>
    <div>
      <img
        src="/img/slider/slide-1.jpg"
        alt="slider"
        className="big-slider-img"
      />
    </div>
    <div>
      <img
        src="/img/slider/slide-2.jpg"
        alt="slider"
        className="big-slider-img"
      />
    </div>
    <div>
      <img
        src="/img/slider/slide-3.jpg"
        alt="slider"
        className="big-slider-img"
      />
    </div>
  </Carousel>
);

export default BigCarousel;
