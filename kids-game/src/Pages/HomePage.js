import styled from "styled-components";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <Wrapper className="full-page">
      <nav className="header">
        <Link to="/">
          <img src={logo} alt="company-logo" />
        </Link>
      </nav>
      <div className="welcome-msg">
        <p>
          Welcome to Kids Spelling Game, an incredible app designed to make the
          journey of learning English spelling an enjoyable experience. With a
          vast collection of over 1000 commonly used words, this app caters to
          learners of all levels. From 3-letter to 11-letter words, you'll find
          a diverse range of vocabulary to explore and learn. <br />
          Kids learn how to spell in the first and second grades. Most early
          spelling words need to be memorized and it would help them: <br />
        </p>
        <ul>
          <li>Get creative.</li>
          <li>Write words out by hand.</li>
          <li> Encourage reading.</li>
          <li>Spell the word out loud.</li>
          <li>Keep words on display.</li>
          <li>Play games to practice</li>
        </ul>
      </div>
      <button className="link-btn">
        <Link to="login" className="link">
          Login/Sign up
        </Link>
      </button>
      <footer>&copy; ALTCODE {new Date().getFullYear()}</footer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: whitesmoke;
  text-align: center;
  height: 100%;
  .header {
    display: flex;
    justify-content: left;
  }
  .header img {
    height: 50px;
    border-bottom: 4px solid grey;
    /* border-radius: 10px; */
    margin-top: 20px;
    margin-left: 30px;
  }
  .welcome-msg {
    text-align: center;
    margin-top: 30px;
    margin: 30px;
    background-color: white;
    line-height: 2;
    word-spacing: 5px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 5px lightgrey;
  }
  .link {
    background-color: #3bb75e;
    padding: 10px 30px;
    border-radius: 10px;
    border: none;
    color: white;
  }
  .link:hover {
    color: white;
    transition: 2s;
  }
  .link-btn {
    margin-top: 190px;
    padding-bottom: 70px;
    background-color: transparent;
    border: none;
  }
  footer {
    position: fixed;
    bottom: 0px;
    background-color: #feffd2;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width: 769px) {
    .link-btn {
      padding-bottom: 70px;
      background-color: transparent;
      border: none;
    }
  }
`;
export default HomePage;
