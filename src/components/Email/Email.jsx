import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import accountIcon from "../../assets/account-icon.svg";
import "./Email.scss";
const Email = () => {
  // Get email information from cookie and display on account page.
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setEmail(Cookies.get("email"));
  }, []);

  const logOutHandler = () => {
    Cookies.remove("AccessToken");
    Cookies.remove("email");
    navigate("/", { replace: true });
  };
  return (
    <div className="e-mail-wrapper">
      <div className="email-left-side">
        <div className="account-logo">
          <img alt="account-icon" src={accountIcon}></img>
        </div>
        <div className="e-mail"> {email}</div>
      </div>
      <button
        id="logout-button"
        className="button-secondary"
        onClick={logOutHandler}
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default Email;
