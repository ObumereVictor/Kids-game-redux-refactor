import React, { useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/images/logo-white.png";
import { useSelector, useDispatch } from "react-redux";
import {
  setSignUp,
  getUserInputs,
  handleTerms,
  registerUser,
  loginUser,
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import { Loading, TermsAndCondition } from "../Components";
import { Link, useNavigate } from "react-router-dom";
import { emailValidator } from "../utils";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    login,
    email,
    password,
    first_name,
    last_name,
    age,
    username,
    terms,
    loading,

    showTerms,

    user,
  } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.completedProfile === false && user.verified) {
      return navigate("/complete-profile");
    }
    if (user?.completedProfile && user.verified && user) {
      return navigate("/dashboard");
    }
  }, [user, navigate]);

  // HANDLE USER INPUT ONCHANGE
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "terms") {
      value = e.target.checked;
    }
    dispatch(getUserInputs({ name, value }));
  };

  // HANDLE USER INPUT SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    // LOGIN USER SUBMIT
    if (login) {
      if (!email || !password) {
        toast.error("Enter the required fields to login");
        return;
      }
      const userDetails = { email, password };
      // login user dispatch
      // emailValidator(email);
      dispatch(loginUser(userDetails));

      return;
    }

    // REGISTER USER SUBMIT
    if (
      !email ||
      !first_name ||
      !last_name ||
      !username ||
      !password ||
      !age ||
      !terms
    ) {
      toast.error("Enter the required fields");
      return;
    }

    if (first_name.length < 3) {
      toast.error("First name must be more than 2 letters");
      return;
    }
    if (first_name.length > 20) {
      toast.error("First name must be less than 20 letters");
      return;
    }
    if (last_name.length < 3) {
      toast.error("Last name must be more than 2 letters");
      return;
    }
    if (last_name.length > 20) {
      toast.error("Last name must be less than 20 letters");
      return;
    }
    if (username.length < 3) {
      toast.error("Username must be more than 2 letters");
      return;
    }
    if (username.length > 12) {
      toast.error("Username must be less than 12 letters");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be more than 6 letters");
      return;
    }

    // EMAIL VALIDATION

    const valid = emailValidator(email);

    if (valid !== false) {
      const userDetails = {
        email,
        first_name,
        last_name,
        username,
        password,
        age,
      };
      dispatch(registerUser(userDetails));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Wrapper className="full-page">
      <nav className="header">
        <img src={logo} alt="company-logo" onClick={() => navigate("/")} />
      </nav>
      <form onSubmit={handleSubmit}>
        <p className="form-header"> {login ? "LOGIN" : "SIGN UP"}</p>
        {!login && (
          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            onChange={handleChange}
            value={first_name}
          />
        )}
        {!login && (
          <input
            type="text"
            placeholder="Last  Name"
            name="last_name"
            onChange={handleChange}
            value={last_name}
          />
        )}
        {!login && (
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={username}
          />
        )}
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={password}
        />
        {!login && (
          <input
            type="number"
            placeholder="age"
            min={1}
            name="age"
            onChange={handleChange}
            value={age}
          />
        )}
        {!login && (
          <div>
            <input
              type="checkbox"
              id="terms"
              name="terms"
              onChange={handleChange}
              value={terms}
            />
            {"  "}
            <label id="terms" onClick={() => dispatch(handleTerms())}>
              Terms and conditons
            </label>
          </div>
        )}

        <button type="submit" className="submit-btn">
          {login ? "Login in to account" : "Create an account"}
        </button>
      </form>
      <span>
        {login ? (
          <span>
            New to Kids game?{" "}
            <span
              className="loginOrSignUp"
              onClick={() => dispatch(setSignUp())}
            >
              Sign up
            </span>
          </span>
        ) : (
          <p>
            Already have an account?{" "}
            <span
              className="loginOrSignUp"
              onClick={() => dispatch(setSignUp())}
            >
              Login
            </span>
          </p>
        )}
      </span>

      {login && (
        <Link
          to={"/reset-password"}
          className="link reset"
          state={{ name: "Hello" }}
        >
          Forgot your password?
        </Link>
      )}
      {showTerms && <TermsAndCondition />}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background-color: darkslateblue;
  text-align: center;
  .header img {
    height: 50px;
  }
  .form-header {
    margin: 20px;
    color: black;
  }
  form {
    background-color: whitesmoke;
    height: fit-content;
    width: 400px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 38px 30px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  input {
    padding-left: 10px;
    padding: 5px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    padding: 10px 10px;
  }
  input:focus {
    outline: 1px solid blue;
  }
  .submit-btn {
    padding: 5px;
    background-color: green;
    color: white;
    font-weight: bold;
    border-radius: 5px;
    padding: 10px 10px;
  }
  span,
  p {
    color: #fff;
  }
  .loginOrSignUp:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  .reset {
    display: block;
    margin-top: 20px;
    color: white;
  }
  .reset:hover {
    text-decoration: underline;
  }
  @media screen and (max-width: 769px) {
    form {
      width: 80%;
      overflow: hidden;
    }
  }
`;
export default LoginPage;
