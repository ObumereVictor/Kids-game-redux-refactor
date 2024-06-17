import styled from "styled-components";
import tick from "../../assets/images/tick.jpeg";
import { Link } from "react-router-dom";
import {
  handleModal,
  resendVerficationEmail,
} from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const RegisterModal = ({ msg }) => {
  const dispatch = useDispatch();
  const { loading, registerData } = useSelector((store) => store.user);
  return (
    <Wrapper className="full-page">
      <div>
        <img src={tick} alt="Good" />
        <p>{msg}</p>
        <p>
          If you don't find the email in your inbox folder, check spam folder
        </p>

        <Link
          to="/login"
          className="link login-btn"
          onClick={() => dispatch(handleModal())}
        >
          Proceed to Login
        </Link>

        {registerData.email && (
          <button
            className="resend-btn"
            onClick={() => dispatch(resendVerficationEmail(registerData.email))}
            disabled={loading}
          >
            {loading ? "Resending..." : "Re-send verification Link"}
          </button>
        )}
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.main`
  position: absolute;
  top: 0px;
  background-color: lightgray;
  display: flex;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid grey;
    width: 50%;
    margin: auto;
    border-radius: 10px;
    padding: 30px;
    gap: 15px;
    background-color: whitesmoke;
  }
  img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
  }
  p {
    color: black !important;
    text-align: center;
  }
  .login-btn {
    background-color: lightgreen;
    padding: 3px 5px;
    border-radius: 5px;
    color: black;
  }
  .login-btn:hover {
    color: white;
    background-color: green;
    transition: 2s;
  }
  .resend-btn {
    padding: 5px 8px;
    border: none;
    background-color: lightgrey;
    border-radius: 5px;
    cursor: pointer;
  }
  .resend-btn:active {
    background-color: grey;
  }
`;

export default RegisterModal;
