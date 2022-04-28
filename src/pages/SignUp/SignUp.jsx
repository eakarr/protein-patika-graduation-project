import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
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

  const formSubmitHandler = () => {
    if (errors.email || errors.password) {
      return;
    }
    postSignUp(email, password);
  };

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

  /* Prevents user from going back to sign up page */
  useEffect(() => {
    if (getToken && getEmail) {
      navigate("/", { replace: true });
    }
  }, [getToken,getEmail,navigate]);

  return (
    <>
      <div className="main-container">
        <img src={mannequin} alt="Mannequin" id="signup-image" />
        <div className="right-side">
          <div className="logo">
            <img src={ikinciElLogo} alt="İkinci El Project" id="signup-logo" />
          </div>
          <div className="sign-up">
            <p className="title">Üye Ol</p>
            <p className="note">Fırsatlardan yararlanmak için üye ol!</p>
            <form onSubmit={handleSubmit(formSubmitHandler)}>
              <label>Email</label>
              {/* Email validations */}
              <input
                type="text"
                className="input"
                placeholder="Email@example.com"
                id={errors.email && "signup-email-error"}
                {...register("email", {
                  required: true,
                  pattern: /\S+@\S+\.\S+/,
                })}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <label>Şifre</label>
              {/* Password validations */}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
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
