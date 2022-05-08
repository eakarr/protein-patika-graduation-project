import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Categories from "../../components/Categories/Categories";
import Products from "../../components/Products/Products";

import bannerImage from "../../assets/bannerImage2x.png";
import "./Home.scss";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  return (
    <div>
      <Header />
      <div className="home-main-container">
        <div className="bottom-container">
          <img src={bannerImage} alt="Banner" className="banner" />
          <Categories setSelectedCategory={setSelectedCategory} setCategoryIds={setCategoryIds} />
          <Products selectedCategory={selectedCategory} categoryIds={categoryIds} />
        </div>
      </div>
    </div>
  );
};

export default Home;
