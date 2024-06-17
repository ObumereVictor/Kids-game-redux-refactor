import styled from "styled-components";
import logo from "../assets/images/logo-white.png";
import { Link, useNavigate } from "react-router-dom";
import { emailValidator } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { getUserInputs, resetUserPassword } from "../features/user/userSlice";
import { Loading } from "../Components";
import { toast } from "react-toastify";
const ForgotPasswordPage = () => {
  const { email, loading } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    dispatch(getUserInputs({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Input your email address");
      return;
    }
    const valid = emailValidator(email);
    if (valid !== false) {
      dispatch(resetUserPassword(email));
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Wrapper className="full-page">
      <img src={logo} alt="company-logo" onClick={() => navigate("/")} />
      <form onSubmit={handleSubmit}>
        <h2>Reset Your Password</h2>
        <input
          type="text"
          placeholder="Enter your Email address"
          name="email"
          onChange={handleChange}
          value={email}
        />
        <button>Request reset</button>
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

const Wrapper = styled.div`
  background-color: darkslateblue;
  text-align: center;
  width: 100vw;
  img {
    height: 70px;
    margin: 30px;
  }
  form {
    background-color: whitesmoke;
    height: 20%;
    width: 50%;
    margin: auto;
    flex-direction: column;
    display: flex;
    gap: 20px;
    padding: 30px 15px;
    border-radius: 5px;
  }
  h2 {
    font-size: 20px;
  }
  input,
  button {
    padding: 7px;
  }
  input {
    border: 0.3px solid lightgray;
    border-radius: 5px;
    padding: 15px 10px;
  }
  input:focus {
    outline: 1px solid blue;
  }
  button {
    border: none;
    border-radius: 10px;
    background-color: #3bb75e;
    color: whitesmoke;
    font-weight: bold;
    font-size: 15px;
    text-shadow: 0px 0px 1px black;
    border-color: #3bb75e;
    padding: 20px 10px;
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
  @media screen and (max-width: 769px) {
    form {
      width: 80%;
    }
    button {
      padding: 10px 7px;
    }
  }
`;
export default ForgotPasswordPage;
