const mongoose = require("mongoose");

const GameModel = mongoose.Schema({
  game: {
    type: Object,
  },
  difficulty: {
    type: String,
  },
});

module.exports = mongoose.model("Game", GameModel);
