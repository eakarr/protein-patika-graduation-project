import React, { useEffect, useState } from "react";
import api from "../../services/api";

import "./Categories.scss";

const Categories = (props) => {
  const { setSelectedCategory, setCategoryIds } = props;
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    await api
      .get("/categories")
      .then((response) => {
        setCategories(response);
        setCategoryIds(response.data.map((each) => each.id).slice(0,13))
        console.log(response);
      })
      .catch((error) => {
        console.log("Category fetch problem: ", error);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {categories.status === 200 && (
        <div className="categories focus">
          <div
            tabIndex="1"
            className="categories-item"
            onClick={() => setSelectedCategory("")}
          >
            Hepsi
          </div>
          {categories.data.slice(0, 13).map((category) => (
            <div
              tabIndex="1"
              className="categories-item"
              onClick={() => setSelectedCategory(category.id)}
              key={category.id}
            >
              {category.name}
            </div>
          ))}
          <div
            className="categories-item"
            onClick={() => setSelectedCategory("other")}
          >
            Diğer
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
