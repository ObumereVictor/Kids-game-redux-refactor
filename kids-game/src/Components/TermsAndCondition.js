import styled from "styled-components";
import { useDispatch } from "react-redux";
import { handleTerms } from "../features/user/userSlice";

const TermsAndCondition = () => {
  const dispatch = useDispatch();
  return (
    <Wrapper className="full-page">
      <div className="termscon">
        <h2>Terms and Conditions</h2>
        <p>Please read this terms of use carefully.</p>
        <p>
          This terms apply to your use of our game whether on your computer or
          mobile devices. These terms also apply to any other services we may
          provide in relation to the game such as customer support, social
          media, community channels and other websites.
        </p>
        <ul>
          <li>The information you provided is for the game use only.</li>
          <li>
            You are responsible for the activities on your account, it’s yours,
            don’t share it!
          </li>
          <li>Don’t make payment to anyone to make use of this game </li>
        </ul>
        <div>
          <button
            className="agree-btn"
            onClick={() => {
              dispatch(handleTerms());
            }}
          >
            I agree
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  position: absolute;
  top: 0px;
  background-color: whitesmoke;
  display: flex;
  justify-content: center;
  p {
    color: black !important;
  }
  li {
    list-style: none;
  }
  .termscon {
    height: 50%;
    background-color: white;
    width: 60%;
    margin: auto;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 10px grey;
    padding: 10px;
    gap: 30px;
  }

  .agree-btn {
    width: 30%;
    border: none;
    padding: 4px 7px;
    border-radius: 5px;
    background-color: aliceblue;
  }
  .agree-btn:hover {
    background-color: blue;
    color: white;
    transition: 1s;
  }
  @media screen and (max-width: 769px) {
    .termscon {
      height: 90%;
      width: 80%;
    }
  }
`;

export default TermsAndCondition;
