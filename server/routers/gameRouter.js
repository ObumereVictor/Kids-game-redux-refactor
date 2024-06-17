const express = require("express");
const gameRouter = express.Router();
const AuthenticateUser = require("../middleware/AuthenticateUser");
const authorizePermission = require("../middleware/AuthorizePermission");
const { createGame, getGame, submitGame } = require("../Controllers");

gameRouter.post(
  "/api/v2/create-game",
  AuthenticateUser,
  authorizePermission("admin"),
  createGame
);
gameRouter.get("/api/v2/get-game", AuthenticateUser, getGame);
gameRouter.post("/api/v2/submit-game", AuthenticateUser, submitGame);

module.exports = gameRouter;
