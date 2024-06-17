import { Link } from "react-router-dom";
import styled from "styled-components";

const ErrorPage = () => {
  return (
    <Wrapper className="full-page">
      <h2>404!! </h2>
      <h3>Page not Found</h3>
      <Link to="/" className="link">
        Back to home
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  gap: 20px;
  .link {
    background-color: blanchedalmond;
    width: 30%;
    padding: 10px;
    align-self: center;
  }
`;
export default ErrorPage;
