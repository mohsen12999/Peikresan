import React from "react";
import "./MultiProductCarousel.css";
import MultiProductCarousel from "./MultiProductCarousel";
import { IMoreBtn, IProduct } from "../shares/Interfaces";

interface ISuggestionProductCarouselProps {
  title: string;
  endTime: Date;
  products: IProduct[];
  more?: IMoreBtn;
}

const SuggestionProductCarousel: React.FC<ISuggestionProductCarouselProps> = ({
  title,
  endTime,
  products,
  more,
}) => {
  const hour = endTime.getHours();
  const min = endTime.getMinutes();
  const sec = endTime.getSeconds();

  const endDate = new Date();
  endDate.setHours(hour, min, sec);
  if (endDate < new Date()) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const [remainTime, setRemainTime] = React.useState({
    hour: "0",
    min: "0",
    sec: "0",
  });

  const calcRemainTime = () => {
    const nowTime = new Date();
    const remainMilliseconds = endDate.getTime() - nowTime.getTime();
    const second = Math.floor(remainMilliseconds / 1000);
    const minute = Math.floor(second / 60);
    const hour = String(Math.floor(minute / 60));

    const sec = second % 60 > 10 ? String(second % 60) : "0" + (second % 60);
    const min = minute % 60 > 10 ? String(minute % 60) : "0" + (minute % 60);

    setRemainTime({ hour: hour, min: min, sec: sec });
  };

  React.useEffect(() => {
    setInterval(() => {
      calcRemainTime();
    }, 1000);
  }, []);

  return (
    <div>
      <div className="suggestion-first-line">
        <h3 className="suggestion-title">{title}</h3>
        <div className="suggestion-time persian-number">
          {remainTime.hour + ":" + remainTime.min + ":" + remainTime.sec}
        </div>
      </div>
      <MultiProductCarousel products={products} more={more} />
    </div>
  );
};

export default SuggestionProductCarousel;
