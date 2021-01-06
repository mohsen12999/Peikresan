import React from "react";
import { connect } from "react-redux";

import MyLayout from "../../components/MyLayout";
import CategoryScrollbarsList from "../../components/CategoryScrollbarsList";

import "./CategoriesList.css";
import { ApplicationState } from "../../store";
import { ICategory } from "../../shares/Interfaces";
import { HomePath } from "../../shares/Constants";

interface ICategoriesListProps {
  categories: ICategory[];
}

const CategoriesList = ({ categories }) => (
  <MyLayout>
    <div>
      <h1>لیست دسته بندی‌های اصلی</h1>
      {/* <List
            size="small"
            bordered
            dataSource={context.GetSubCategories(0)}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Link to={"/category/" + item.id} className="item-link">
                  <h2 className="item-title">{item.title}</h2>
                </Link>
              </List.Item>
            )}
          /> */}

      {categories
        .filter((c) => c.parentId == 0)
        .map((cat) => {
          let subCats = categories.filter((c) => c.parentId == c.id);
          const more = {
            show: false,
            title: "دسته‌بندی های بیشتر",
            link: HomePath.Category + cat.id,
          };
          if (subCats.length > 10) {
            subCats = subCats.slice(0, 10);
            more.show = true;
          }

          return (
            <CategoryScrollbarsList
              key={cat.id}
              title={cat.title}
              categories={subCats}
              more={more}
            />
          );
        })}
    </div>
  </MyLayout>
);

const mapStateToProps = (state: ApplicationState) => ({
  categories: state.data ? state.data.categories : [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesList);
