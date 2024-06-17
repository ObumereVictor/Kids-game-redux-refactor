import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../../Components";
import { ReactSortable, Sortable, MultiDrag, Swap } from "react-sortablejs";
import { reOrderList, postGame } from "../../features/game/gameSlice";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-white.png";

const PlayGamePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { loading, gameDetails } = useSelector((store) => store.game);
  let { user } = useSelector((store) => store.user);

  let game = gameDetails.game;

  useEffect(() => {
    if (game === undefined) {
      return navigate("/dashboard");
    }
  }, [gameDetails]);

  return game !== undefined && !loading ? (
    <Wrapper className="full-page">
      <header>
        <img src={logo} alt="company logo" />
      </header>

      <h3>{user.username} is currently playing</h3>
      <h4>Arrange the letters to the correct spelling...</h4>
      <section className="sortable">
        <ReactSortable
          className="game-ele"
          tag={"div"}
          list={game.map((x) => ({ ...x, chosen: true }))}
          setList={(newState) => dispatch(reOrderList(newState))}
          swap
          swapClass={"sortable-swap-highlight"}
        >
          {game.map((spelling) => {
            return (
              <button className="game" key={spelling.gid}>
                {spelling.game}
              </button>
            );
          })}
        </ReactSortable>
        {gameDetails.answer && (
          <div className="game-ele">
            {gameDetails.answer &&
              gameDetails.answer.map((answer, index) => {
                return (
                  <button className="answer" disabled={true} key={index}>
                    {" "}
                    {answer}
                  </button>
                );
              })}
          </div>
        )}
      </section>

      <div className="game-btns">
        <button className="cancel" onClick={() => navigate("/dashboard")}>
          Cancel
        </button>
        <button
          className="submit"
          onClick={() => dispatch(postGame(gameDetails))}
        >
          Submit
        </button>
      </div>
    </Wrapper>
  ) : (
    <Loading />
  );
};

const Wrapper = styled.section`
  background-color: #6895d2;
  text-align: center;
  .sortable {
    background-color: whitesmoke;
    width: 70%;
    margin: auto;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 30px;
    padding: 10px 5px;
    border-radius: 10px;
    margin-bottom: 100px;
    flex-direction: column;
  }
  .game,
  .answer {
    color: black !important;
    width: 40px;
    margin: auto;
    height: 80%;
    font-size: 20px;
    text-transform: capitalize;
  }
  .game-btns {
    width: 70%;
    margin: auto;
    display: flex;
    justify-content: space-evenly;
  }
  .game-btns button {
    padding: 15px 30px;
    border-radius: 5px;
    cursor: pointer;
  }
  .game-ele {
    display: flex;
    height: 100px;
  }
  .game {
    background-color: white;
    color: black;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 0 0 0 black;
  }

  .game:hover {
    transform: translateY(-4px) translateX(-2px);
    box-shadow: 2px 5px 0 0 black;
  }

  .game:active {
    transform: translateY(2px) translateX(1px);
    box-shadow: 0 0 0 0 black;
  }
  .cancel:hover {
    background-color: #f28585;
    transition: 1.5s;
    color: white;
  }
  .submit:hover {
    background-color: greenyellow;
    transition: 1.5s;
  }
`;

export default PlayGamePage;
