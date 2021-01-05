import React from "react";
import Carousel from "react-multi-carousel";

const responsive = {
  mobile: {
    breakpoint: { max: 4000, min: 0 },
    items: 1,
  },
};

interface ISimpleSliderProps {
  images: string[];
}

const SimpleSlider: React.FC<ISimpleSliderProps> = ({ images }) => (
  <Carousel
    autoPlay={true}
    swipeable={true}
    responsive={responsive}
    arrows={false}
    ssr={true} // means to render carousel on server-side.
    infinite={true}
    //removeArrowOnDeviceType={["tablet", "mobile"]}
    deviceType={"mobile"}
  >
    {images.map((img, index) => (
      <div key={index}>
        <img src={img} alt={"img_" + index} style={{ width: "100%" }} />
      </div>
    ))}
  </Carousel>
);

export default SimpleSlider;
