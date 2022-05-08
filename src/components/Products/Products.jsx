import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import "./Products.scss";
import errorIcon from "../../assets/error-icon.svg";

const Products = (props) => {
  const { selectedCategory, categoryIds } = props;
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    await api
      .get("/products", { params: { _limit: 5000 } })
      .then((response) => {
        setProducts(response);
        console.log(response);
      })
      .catch((error) => {
        console.log("Product fetch problem: ", error);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const productDetailRouterHandler = (id) => {
    navigate("/products/" + id);
    navigate(0);
  };

  return (
    <>
      {products.status !== 200 && (
        <div className="loading">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
      {products.status === 200 && (
        <div className="product-box">
          {products.data
            .filter((product) => {
              if (
                selectedCategory === "" ||
                product?.category?.id === selectedCategory ||
                (!categoryIds.includes(selectedCategory) &&
                  !categoryIds.includes(product?.category?.id))
              ) {
                return product;
              }
            })
            .map((item) => (
              <div
                onClick={() => productDetailRouterHandler(item.id)}
                className="product-card"
                key={item.id}
              >
                {item?.image?.url ? (
                  <div className="image">
                    <img
                      alt="Product"
                      src={"https://bootcamp.akbolat.net" + item?.image?.url}
                    ></img>
                  </div>
                ) : (
                  <div className="image">
                    <img src={errorIcon} alt="Error" />
                  </div>
                )}
                <div className="top-info">
                  <div className="product-title">{item?.brand}</div>
                  <div id="product-color">
                    <p>
                      <span>Renk: </span>
                      {item?.color}
                    </p>
                  </div>
                </div>
                <div className="product-price">{item?.price} TL</div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Products;
