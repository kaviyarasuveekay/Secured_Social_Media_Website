import "./register.css";

import axios from "axios";

import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerSchema } from "../../validations/RegisterValidation";

const Register = () => {
  const email = useRef();
  const username = useRef();
  const gender = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const history = useNavigate();

  const apiURL = process.env.REACT_APP_API_URL;

  const handleClick = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value !== password.current.value) {
      confirmPassword.current.setCustomValidity("Passwords don't match!");
    } else {
      let formData = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      let isValid;

      try {
        isValid = await registerSchema.isValid(formData);
        const validate = await registerSchema.validate(formData);
        console.log(validate);
      } catch (error) {
        alert(error.message);
      }

      if (isValid) {
        const user = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
          gender: gender.current.value,
        };
        try {
          const res = await axios.post(`${apiURL}auth/register`, user);
          console.log(res);
          history("/login");
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">SecureMedia</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on SecureMedia.
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              className="registerInput"
              ref={username}
              required
              minLength="4"
            />
            <input
              type="email"
              placeholder="Email"
              className="registerInput"
              ref={email}
              required
            />
            <input
              type="password"
              minLength="4"
              placeholder="Password"
              className="registerInput"
              ref={password}
              required
            />
            <input
              type="password"
              minLength="4"
              placeholder="Confirm Password"
              className="registerInput"
              ref={confirmPassword}
              required
            />

            <select className="registerInput" required ref={gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>

            <button className="registerButton" type="submit">
              Sign Up
            </button>
            <Link to={"/login"} style={{ textAlign: "center" }}>
              <button className="registerLoginButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
