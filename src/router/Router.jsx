import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie'

import Account from "../pages/Account/Account";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import SignUp from "../pages/SignUp/SignUp";
import UploadProduct from "../pages/UploadProduct/UploadProduct";

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (Cookies.get("AccessToken") && Cookies.get("email")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/upload-product" element={<UploadProduct />} />
            <Route path="/products/:id" element={<ProductDetails />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products/:id" element={<ProductDetails />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default Router;
