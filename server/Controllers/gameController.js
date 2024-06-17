const { StatusCodes } = require("http-status-codes");
const { GameModel, UserModel } = require("../Models");
const { checkPermission, shuffleArray } = require("../utils");

const createGame = async (request, response) => {
  let { game, difficulty } = request.body;
  const user = request.user;
  game.toUpperCase().trim();

  const currentUser = await UserModel.findOne({ _id: user });

  checkPermission(currentUser.role, user);
  let games = await GameModel.find({}).select("game");

  let iterator = games.values();

  for (let values of iterator) {
    let t = values.game.map((game) => game.game).join("");
    if (t === game) {
      return response
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ status: "Failed", msg: "Game is already avaliable" });
    }
  }

  game = [...game];
  game = game.map((game, index) => {
    return { gid: index, game };
  });
  const newGame = await GameModel.create({ game, difficulty });
  console.log(newGame);

  return response
    .status(StatusCodes.CREATED)
    .json({ status: "Success ", msg: " Game Added" });
};

const getGame = async (request, response) => {
  try {
    const user = request.user;
    let currentUser = await UserModel.findOne({ _id: user });

    currentUser.gamesPlayed.map((game) => [...game]).join("");

    const userGames = await GameModel.find({
      difficulty: currentUser.difficulty,
    }).select("game");

    let avaliableGames = userGames.map((games) => {
      return games.game;
    });

    let currentGames = avaliableGames.filter((game, index) => {
      let wordsArray = [];
      let words = game.map((game) => [...game.game]);
      words = wordsArray.concat(...words).join("");

      if (currentUser.gamesPlayed.includes(words)) {
        return game !== game;
      }
      return game;
    });

    let currentGame = await currentGames[0];
    // console.log(currentGame);
    let gameId;

    if (!currentGame) {
      return response.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        msg: "You don't have any game available, change the difficulty level on your profile or try again later",
        errorType: "nogameerror",
      });
    }
    let currentGameWord = currentGame.map((g) => g.game).join("");
    let games = await GameModel.find({}).select("game");
    let iterator = games.values();

    for (let values of iterator) {
      let game = values.game.map((g) => g.game).join("");
      if (currentGameWord === game) {
        gameId = values._id;
      }
    }

    const game = shuffleArray([...currentGame]);
    let answer = [...currentGame];
    answer = answer.map((answer) => answer.game);

    if (currentUser.difficulty === "Easy") {
      return response.status(200).json({
        status: "Success",
        msg: "You have a game to play",
        gameId,
        game,
        answer,
      });
    }

    return response.status(200).json({
      status: "Success",
      msg: "You have a game to play",
      gameId,
      game,
    });
  } catch (error) {
    console.log(error);
  }
};

const submitGame = async (request, response) => {
  const { game, gameId } = request.body;
  const user = request.user.toString();
  const userAnswer = game.join("");

  let findGameArray = [];
  let findGame = await GameModel.findOne({ _id: gameId });
  // console.log(findGame);
  findGame = findGame.game.map((game) => [...game.game]);
  findGame = findGameArray.concat(...findGame).join("");
  console.log({ findGame, userAnswer });
  // return response.status(StatusCodes.OK);
  if (userAnswer !== findGame) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Did not get the correct spelling" });
  }
  const currentUser = await UserModel.findOne({ _id: user });
  await currentUser.gamesPlayed.push(findGame);
  await currentUser.save();
  return response
    .status(StatusCodes.OK)
    .json({ status: "Success", msg: "You got the spelling correct" });
};
module.exports = { createGame, getGame, submitGame };
