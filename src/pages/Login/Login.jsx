import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import errorToastify from "../../helpers/errorToastify";

import "./Login.scss";
import mannequin from "../../assets/signUp.png";
import ikinciElLogo from "../../assets/logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const getToken = localStorage.getItem("AccessToken");
  const getEmail = localStorage.getItem("email");

  /* Login */
  const postLogin = async (email, password) => {
    await api
      .post("/auth/local", {
        identifier: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("AccessToken", response.data.jwt);
        localStorage.setItem("email", response.data.user.email);
        navigate("/", { replace: true }); /* Navigates to the Home page */
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToastify("Emailiniz veya şifreniz hatalı.");
        }
      });
  };

  const formSubmitHandler = () => {
    if (errors.email || errors.password) {
      return;
    }
    postLogin(email, password);
  };

  /* Prevents user from going back to login page */
  useEffect(() => {
    if (getToken && getEmail) {
      navigate("/", { replace: true }); /* Navigates to the Home page */
    }
  }, [getToken,getEmail,navigate]);

  return (
    <>
      <div className="main-container">
        <img src={mannequin} alt="Mannequin" id="login-image" />
        <div className="right-side">
          <div className="logo">
            <img src={ikinciElLogo} alt="İkinci El Project" id="login-logo" />
          </div>
          <div className="login">
            <p className="title">Giriş Yap</p>
            <p className="note">Fırsatlardan yararlanmak için giriş yap!</p>
            <form onSubmit={handleSubmit(formSubmitHandler)}>
              <label>Email</label>
              <input
                type="text"
                className="input"
                placeholder="Email@example.com"
                id={errors.email && "login-email-error"}
                {...register("email", {
                  required: true,
                  pattern: /\S+@\S+\.\S+/,
                })}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <label>Şifre</label>
              <input
                type="password"
                id={errors.password && "login-password-error"}
                placeholder="Password"
                className="input"
                {...register("password", {
                  required: true,
                  minLength: 8,
                  maxLength: 20,
                })}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <p className="forgot-password">Şifremi Unuttum</p>
              <button className="button" id="login-button">
                Giriş Yap
              </button>
            </form>
            <div className="toLogin">
              <p>
                Hesabın yok mu?{" "}
                <Link className="link" to="/signup">
                  Üye Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
