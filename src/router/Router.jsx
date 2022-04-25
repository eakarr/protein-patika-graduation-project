import { Routes, Route } from "react-router-dom";
import Account from "../pages/Account/Account";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import SignUp from "../pages/SignUp/SignUp";
import UploadProduct from "../pages/UploadProduct/UploadProduct";

const Router = () => {
  return (
    <>
      <Routes>
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
      </Routes>
    </>
  );
};

export default Router;
