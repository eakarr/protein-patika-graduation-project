import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import "./SignUp.scss";
import mannequin from "../../assets/signUp.png";
import ikinciElLogo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // useEffect(() => {

  // }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    if (errors.email || errors.password) {
      setError(true);
    }
  }, [errors]);

  return (
    <>
      <div className="main-container">
        <img src={mannequin} alt="signupimage" id="signup-image" />
        <div className="right-side">
          <div className="logo">
            <img src={ikinciElLogo} alt="signuplogo" id="signup-logo" />
          </div>
          <div className="sign-up">
            <p className="title">Üye Ol</p>
            <p className="note">Fırsatlardan yararlanmak için üye ol!</p>
            <form onSubmit={handleSubmit(onSubmit)}>
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
