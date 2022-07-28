import "./login.css";

import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../contexts/AuthContext";
import { loginSchema } from "../../validations/LoginValidation";

const Login = () => {
  const email = useRef();
  const password = useRef();

  const { isFetching, dispatch, error } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();

    let formData = {
      email: email.current.value,
      password: password.current.value,
    };

    let isValid;

    try {
      isValid = await loginSchema.isValid(formData);
      const validate = await loginSchema.validate(formData);
      console.log(validate);
    } catch (error) {
      alert(error.message);
    }

    if (isValid) {
      loginCall(
        {
          email: email.current.value,
          password: password.current.value,
        },
        dispatch
      );
      alert(error);
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SecureMedia</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on SecureMedia.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              className="loginInput"
              ref={email}
              required
            />
            <input
              placeholder="Password"
              type="password"
              minLength="4"
              className="loginInput"
              ref={password}
              required
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link to={"/register"} style={{ textAlign: "center" }}>
              <button className="loginRegisterButton">
                {isFetching ? (
                  <CircularProgress color="white" size="20px" />
                ) : (
                  "Create a New Account"
                )}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
