import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
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

  const getToken = Cookies.get("AccessToken");
  const getEmail = Cookies.get("email");

  /* Login request */
  const postLogin = async (email, password) => {
    await api
      .post("/auth/local", {
        identifier: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
        Cookies.set("AccessToken", response.data.jwt);
        Cookies.set("email", response.data.user.email);
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
      navigate(0);
    }
  }, [getToken, getEmail, navigate]);

  const emailInputHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordInputHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <div className="main-container">
        <img src={mannequin} alt="Mannequin" id="login-image" />
        <div className="right-side">
          <Link to="/" className="logo">
            <img src={ikinciElLogo} alt="İkinci El Project" id="login-logo" />
          </Link>
          <div className="login">
            <p className="title">Giriş Yap</p>
            <p className="note">Fırsatlardan yararlanmak için giriş yap!</p>
            <form onSubmit={handleSubmit(formSubmitHandler)}>

              {/* Email validations */}
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
                onChange={emailInputHandler}
              />

              {/* Password validations */}
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
                onChange={passwordInputHandler}
              />
              
              <p className="forgot-password">Şifremi Unuttum</p>
              <button className="button" id="login-button">
                Giriş Yap
              </button>
            </form>

            <div className="toSignup">
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
