import styled from "styled-components";
import { Loading, SelectDifficulty } from "../../Components";
import { useState } from "react";
import { createGame } from "../../features/game/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateGamePage = () => {
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.game);
  let [game, setGame] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const dispatch = useDispatch();

  const handleCreateGame = (e) => {
    // e.stopImmediatePropagation();
    e.preventDefault();
    game = game.trim();
    const newGame = { game, difficulty };
    if (!game & (game.length < 3)) {
      toast.error("Input more than three letters for game");
      return;
    }

    // alphabet regex
    const regex = /^[A-Za-z]+$/;
    if (!regex.test(game)) {
      return toast.error("Enter Only letters");
    }
    dispatch(createGame(newGame));
    setGame("");
  };

  const handleChange = (e) => {
    setDifficulty(e.target.value);
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <Wrapper className="full-page">
      <h2>Create Game</h2>
      <form onSubmit={handleCreateGame}>
        <div className="create-game">
          <input
            type="text"
            name="addgame"
            id="addgame"
            placeholder="Add Game"
            onChange={(e) => setGame(e.target.value)}
            value={game}
          />
        </div>
        <SelectDifficulty handleChange={handleChange} />

        <div className="cg-btn">
          <button onClick={() => navigate("/dashboard")}>Go Back</button>

          <button type="submit">Create Game</button>
        </div>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  form {
    background-color: whitesmoke;
    width: 50%;
    height: 30%;
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 40px;
    border-radius: 0px 0px 12px 12px;
    padding: 20px;
  }
  .create-game {
    display: flex;
  }
  label {
    width: 20%;
  }
  input {
    flex-grow: 1;
    padding: 15px 10px;
    border: none;
    border-radius: 10px;
  }
  input:focus {
    border: 1px solid black;
  }
  .cg-btn {
    display: flex;
    justify-content: space-evenly;
    gap: 40px;
  }
  .cg-btn button {
    flex-grow: 1;
    padding: 15px 10px;
    border: none;
    border-radius: 10px;
  }
  .cg-btn button:nth-of-type(1) {
    /* background-color: red; */
  }
  .cg-btn button:nth-of-type(2) {
    /* background-color: green; */
  }
`;

export default CreateGamePage;
