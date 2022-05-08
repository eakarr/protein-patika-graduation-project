import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../services/api";
import errorToastify from "../../helpers/errorToastify";

import "./SignUp.scss";
import mannequin from "../../assets/signUp.png";
import ikinciElLogo from "../../assets/logo.svg";

const SignUp = () => {
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

  /* Create new user */
  const postSignUp = async (email, password) => {
    await api
      .post("/auth/local/register", {
        username: email,
        email: email,
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
          errorToastify("Bu kullanıcı zaten sistemde kayıtlı!");
        }
      });
  };

  const formSubmitHandler = () => {
    if (errors.email || errors.password) {
      return;
    }
    postSignUp(email, password);
  };

  /* Prevents user from going back to sign up page */
  useEffect(() => {
    if (getToken && getEmail) {
      navigate("/", { replace: true });
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
        <img src={mannequin} alt="Mannequin" id="signup-image" />
        <div className="right-side">
          <Link to="/" className="logo">
            <img src={ikinciElLogo} alt="İkinci El Project" id="signup-logo" />
          </Link>
          <div className="sign-up">
            <h1 className="title">Üye Ol</h1>
            <p className="note">Fırsatlardan yararlanmak için üye ol!</p>
            <form onSubmit={handleSubmit(formSubmitHandler)}>
              {/* Email validations */}
              <label>Email</label>
              <input
                type="text"
                className="input"
                placeholder="Email@example.com"
                id={errors.email && "signup-email-error"}
                {...register("email", {
                  required: true,
                  pattern: /\S+@\S+\.\S+/,
                })}
                onChange={emailInputHandler}
                value={email}
              />
              {errors.email && (
                <p style={{ color: "#f77474" }}>
                  {"Lütfen geçerli eposta adresini giriniz!"}
                </p>
              )}
              {/* Password validations */}
              <label>Şifre</label>
              <input
                type="password"
                id={errors.password && "signup-password-error"}
                placeholder="Password"
                className="input"
                {...register("password", {
                  required: true,
                  minLength: 8,
                  maxLength: 20,
                })}
                onChange={passwordInputHandler}
                value={password}
              />
              {errors.password && (
                <p style={{ color: "#f77474" }}>
                  {"Şifre minimum 8, maksimum 20 karakter içermelidir!"}
                </p>
              )}
              <button className="button" id="signup-button">
                Üye Ol
              </button>
            </form>

            <div className="toLogin">
              <p>
                Hesabın var mı?{" "}
                <Link className="link" to="/login">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
