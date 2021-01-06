import React from "react";
import { connect } from "react-redux";
import { Carousel, Card } from "antd";
import { Link } from "react-router-dom";

import ScrollbarsList from "../../components/ScrollbarsList";
import SuggestionScrollbarsList from "../../components/SuggestionScrollbarsList";
import ScrollbarBadge from "../../components/ScrollbarBadge";
import MyLayout from "../../components/MyLayout";
import {
  IProduct,
  ICategory,
  IBanner,
  ISlider,
  IBadge,
} from "../../shares/Interfaces";
import { HomePath } from "../../shares/Constants";
import { GetProductsFromList } from "../../shares/Functions";
import { ApplicationState } from "../../store";

import "./Home.css";

const { Meta } = Card;

interface IHomeProps {
  products: IProduct[];
  categories: ICategory[];
  suggestions: number[];
  newest: number[];
  mostSells: number[];
  sliders: ISlider[];
  banners: IBanner[];
}

const Home: React.FC<IHomeProps> = ({
  products,
  categories,
  suggestions,
  newest,
  mostSells,
  sliders,
  banners,
}) => (
  <MyLayout>
    <section>
      <Carousel autoplay>
        {sliders.map((slider) => (
          <div key={slider.id}>
            <img
              src={slider.img}
              alt={"slider " + slider.id}
              className="slider-img"
            />
          </div>
        ))}
      </Carousel>
    </section>

    <section className="badge-scroll">
      <ScrollbarBadge
        badges={categories
          .filter((cat) => cat.parentId == 0)
          .map(
            (c) =>
              ({
                id: c.id,
                text: c.title,
                url: HomePath.Category + c.id,
              } as IBadge)
          )}
      />
    </section>

    <section className="suggestion">
      <SuggestionScrollbarsList
        products={GetProductsFromList(suggestions, products)}
        title="پیشنهاد شگفت انگیز"
        endTime={new Date(new Date().setHours(23, 59, 59))}
        more={{
          title: "کالاهای بیشتر",
          link: HomePath.Suggestions,
          show: true,
        }}
      />
    </section>

    <section className="banner-section">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          to={banner.url}
          className={
            banner.bannerType === 1
              ? "banner big"
              : banner.bannerType === 2
              ? "banner little"
              : "banner small"
          }
        >
          {/* <img src={banner.img} alt="banner" /> */}

          <Card
            className="product-thumb-card banner-thumb"
            hoverable
            cover={
              <div className="banner-cover">
                <img
                  className="product-image-thumb"
                  alt={"تصویر" + banner.title}
                  src={
                    banner.img && banner.img !== ""
                      ? banner.img
                      : "/img/category/cat-0.png"
                  }
                />
                <div className="banner-cover-title">
                  <span>{banner.title}</span>
                </div>
              </div>
            }
          >
            {/* <Meta className="persian-number" title={banner.title} /> */}
          </Card>
        </Link>
      ))}
    </section>

    <div className="suggestion">
      <ScrollbarsList
        products={GetProductsFromList(mostSells, products)}
        title="محصولات پرفروش"
        more={{ title: "کالاهای بیشتر", link: HomePath.MostSells, show: true }}
      />
    </div>

    <div className="suggestion">
      <ScrollbarsList
        products={GetProductsFromList(newest, products)}
        title="جدیدترین محصولات"
        more={{ title: "کالاهای بیشتر", link: HomePath.Newest, show: true }}
      />
    </div>
  </MyLayout>
);

const mapStateToProps = (state: ApplicationState) => ({
  products: state.data ? state.data.products : [],
  categories: state.data ? state.data.categories : [],
  sliders: state.data ? state.data.sliders : [],
  suggestions: state.data ? state.data.suggestions : [],
  mostSells: state.data ? state.data.mostSells : [],
  newest: state.data ? state.data.newest : [],
  banners: state.data ? state.data.banners : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
