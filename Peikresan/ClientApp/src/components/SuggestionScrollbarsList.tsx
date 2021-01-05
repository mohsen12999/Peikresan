import React from "react";
import { Link } from "react-router-dom";
import { IMoreBtn, IProduct } from "../shares/Interfaces";

import ProductThumbnail from "./ProductThumbnail";
import "./ScrollbarsList.css";

interface ISuggestionScrollbarsListProps {
  title: string;
  endTime: Date;
  products: IProduct[];
  more?: IMoreBtn;
}

const SuggestionScrollbarsList: React.FC<ISuggestionScrollbarsListProps> = ({
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
    <section className="scrollbar-main-section">
      <div className="scrollbar-title-div suggestion-title-row">
        <h4 className="scrollbar-title">{title}</h4>
        <div className="scrollbar-remain-time persian-number">
          {remainTime.hour + ":" + remainTime.min + ":" + remainTime.sec}
        </div>
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
};

export default SuggestionScrollbarsList;
