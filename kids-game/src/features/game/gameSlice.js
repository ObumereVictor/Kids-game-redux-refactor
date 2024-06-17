import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
  createGameThunk,
  getGameThunk,
  postGameThunk,
} from "../thunks/gameThunk";
import { toast } from "react-toastify";

const initialState = {
  newGame: "",
  loading: false,
  gameDetails: {},
};

export const createGame = createAsyncThunk("game/createGame", createGameThunk);

export const getGame = createAsyncThunk("game/getGame", getGameThunk);

export const postGame = createAsyncThunk("game/postGame", postGameThunk);

const game = createSlice({
  name: "game",
  initialState,
  reducers: {
    reOrderList: (state, { payload }) => {
      state.gameDetails = { ...state.gameDetails, game: [...payload] };
    },
    clearGame: () => {
      return { ...initialState };
    },
  },

  // CREATE GAME
  extraReducers: (builder) => {
    builder.addCase(createGame.pending, (state) => {
      state = state.loading = true;
    });
    builder.addCase(createGame.fulfilled, (state, { payload }) => {
      state = state.loading = false;
      toast.success(payload.msg);
    });
    builder.addCase(createGame.rejected, (state, { payload }) => {
      state = state.loading = false;
      toast.error(payload);
    });

    // GET GAME
    builder.addCase(getGame.pending, (state) => {
      state = state.loading = true;
    });
    builder.addCase(getGame.fulfilled, (state, { payload }) => {
      const { game, gameId, answer } = payload;
      state.gameDetails = {
        ...state.gameDetails,
        game,
        gameId,
        answer,
      };
      state.loading = false;
    });
    builder.addCase(getGame.rejected, (state, { payload }) => {
      // state = state.loading = false;
      // state = state.gameDetails = {};
      toast.error(payload, {
        autoClose: 5000,
      });
      return { ...state, loading: false, gameDetails: {} };
    });

    // SUBMIT GAME
    builder.addCase(postGame.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postGame.fulfilled, (state, { payload }) => {
      toast.success(payload.msg);
    });
    builder.addCase(postGame.rejected, (state, { payload }) => {
      state.loading = false;
      toast.error(payload);
    });
  },
});

export const { reOrderList, clearGame } = game.actions;

export default game.reducer;
