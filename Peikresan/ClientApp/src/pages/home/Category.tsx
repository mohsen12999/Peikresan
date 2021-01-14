import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import MyLayout from "../../components/MyLayout";
import ProductThumbnail from "../../components/ProductThumbnail";
import ScrollbarsList from "../../components/ScrollbarsList";
import { ICategory, IProduct } from "../../shares/Interfaces";
import { HomePath } from "../../shares/URLs";
import { ApplicationState } from "../../store";

import "./Category.css";

interface ICategoryProps {
  products: IProduct[];
  categories: ICategory[];
}

interface IParamTypes {
  id: string;
}

const Category: React.FC<ICategoryProps> = ({ products, categories }) => {
  const { id } = useParams<IParamTypes>();

  // const category = context.GetCategory(id);
  const category = categories.find((c) => c.id == Number(id));
  const subCategories = categories.filter((c) => c.parentId == Number(id));
  const categoryProducts = products.filter((p) => p.categoryId == Number(id));

  return (
    <MyLayout>
      <div>
        <h2>
          {Number(id) === 0 || category == undefined
            ? "همه دسته بندی ها"
            : category
            ? category.title
            : "دسته بندی"}
        </h2>

        <section>
          {subCategories.map((subCat) => (
            <ScrollbarsList
              key={subCat.id}
              products={products
                .filter((p) => p.categoryId == subCat.id)
                .slice(0, 10)}
              title={subCat.title}
              more={{
                show: true,
                title: "کالاهای بیشتر",
                link: HomePath.Category + +subCat.id,
              }}
            />
          ))}
        </section>

        <section className="product-list">
          {categoryProducts.map((product) => (
            <div className="product-thumbnail" key={product.id}>
              <ProductThumbnail product={product} />
            </div>
          ))}
        </section>
      </div>
    </MyLayout>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  products: state.data ? state.data.products : [],
  categories: state.data ? state.data.categories : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
