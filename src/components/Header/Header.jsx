import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./Header.scss";
import ikinciElLogo from "../../assets/logo.svg";
import plusIcon from "../../assets/plus-icon.svg";
import userIcon from "../../assets/user-icon.svg";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* Token authentication */
  useEffect(() => {
    if (Cookies.get("AccessToken") || Cookies.get("email")) {
      setIsLoggedIn(true);
    }
  }, []);

  /* Page Routes */
  const navigate = useNavigate();
  const pageRouterHandler = (route) => {
    navigate(route);
    navigate(0);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="header-logo">
          <img
            src={ikinciElLogo}
            alt="İkinci El Project"
            onClick={() => {
              pageRouterHandler("/");
            }}
          />
        </div>
        <div className="user">
          {isLoggedIn ? (
            <>
              <button
                className="button-secondary"
                id="header-product-add-button"
                onClick={() => {
                  pageRouterHandler("/upload-product");
                }}
              >
                <img src={plusIcon} alt="Plus Icon" /> Ürün Ekle
              </button>
              <button
                className="button-secondary"
                id="header-account-button"
                onClick={() => {
                  pageRouterHandler("/account");
                }}
              >
                <img src={userIcon} alt="User Icon" /> Hesabım
              </button>
            </>
          ) : (
            <button
              className="button-secondary"
              id="header-login-button"
              onClick={() => {
                pageRouterHandler("/login");
              }}
            >
              <img src={userIcon} alt="User Icon" /> Giriş Yap
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
