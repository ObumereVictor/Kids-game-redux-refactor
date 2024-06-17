import { useDispatch } from "react-redux";
import customAxios from "../../utils/axios";
import Cookies from "js-cookie";
import { getGame } from "../game/gameSlice";

const createGameThunk = async (game, thunkAPI) => {
  const token = Cookies.get("token");

  try {
    const response = await customAxios.post("/api/v2/create-game", game, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response.data.msg || "Cannot add game, Try Again"
    );
  }
};

const getGameThunk = async (_, thunkAPI) => {
  const token = Cookies.get("token");

  try {
    const response = await customAxios("/api/v2/get-game", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

const postGameThunk = async (gameDetails, thunkAPI) => {
  const token = Cookies.get("token");
  let { gameId, game } = gameDetails;

  let gameArray = [];
  game = game.map((g) => [...g.game]);
  game = gameArray.concat(...game);

  const gameData = { game, gameId };
  try {
    const response = await customAxios.post("/api/v2/submit-game", gameData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      thunkAPI.dispatch(getGame());
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export { createGameThunk, getGameThunk, postGameThunk };
