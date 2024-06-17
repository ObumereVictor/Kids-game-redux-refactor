import styled from "styled-components";
import logo from "../assets/images/logo-white.png";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../features/user/userSlice";
import { Loading } from "../Components";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.user);
  const [newPassword, setNewPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) {
      setNewPassword("");
      return toast.error("Please enter a new password");
    }
    if (newPassword.length < 6) {
      return toast.error("Your Password must be at least 6 characters");
    }
    const details = { newPassword, token };
    dispatch(updatePassword(details));
    setNewPassword("");
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <Wrapper className="full-page">
      <nav>
        <img src={logo} alt="company logo" />
      </nav>
      <form onSubmit={updatePasswordSubmit}>
        <h3>Reset your password</h3>
        <p style={{ color: "black" }}>
          Hi, Please enter your new password to continue
        </p>
        <input
          type="text"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
        />

        <button className="reset-btn" disabled={loading}>
          {loading ? "Loading...." : "Reset Password"}
        </button>
      </form>

      <p>
        Remember your password?{" "}
        <Link to="/login" className="link login">
          Login
        </Link>
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background-color: #011b33;
  text-align: center;
  img {
    height: 70px;
    margin: 30px;
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
  .reset-btn {
    padding: 5px;
    background-color: green;
    color: white;
    font-weight: bold;
    border-radius: 5px;
    padding: 10px 10px;
  }
  p {
    margin-top: 20px;
    color: white;
  }
  .login {
    color: white;
  }
  .login:hover {
    text-decoration: underline;
  }
`;

export default ResetPassword;
