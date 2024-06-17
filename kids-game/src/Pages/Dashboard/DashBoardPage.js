import styled from "styled-components";
import { NavBar } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getGame } from "../../features/game/gameSlice";

const DashBoardPage = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Wrapper className="full-page">
      <NavBar />
      <section>
        <p>
          Be aware the games you get is based on the difficulty level set on
          your profile and it can be changed in the edit profile section <br />{" "}
          Happy Playing!!!
        </p>
        <div className="game-btn">
          {user.role === "admin" ? (
            <>
              <button
                onClick={() => {
                  dispatch(getGame());
                  navigate("/play-game");
                }}
              >
                Play game
              </button>
              <Link to="/create-game">
                <button>Create game</button>
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                dispatch(getGame());
                navigate("/play-game");
              }}
            >
              Play game
            </button>
          )}
        </div>
      </section>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  section {
    background-color: whitesmoke;
    height: 60%;
    width: 70%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 50px;
    border-radius: 0px 0px 20px 20px;
  }
  p {
    text-align: center;
    line-height: 2;
    letter-spacing: 1.5px;
    color: dark;
  }
  .game-btn {
    margin-top: 60px;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
  .game-btn button {
    /* background-color: green; */
    padding: 12px 10px;
    border-radius: 10px;
    background-color: #3bb75e;
    border: none;
    color: white;
    opacity: 0.8;
    cursor: pointer;
  }
`;

export default DashBoardPage;
