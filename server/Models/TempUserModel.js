const mongoose = require("mongoose");

const TempUserModel = mongoose.Schema({
  userId: String,
  uuid: String,
  uniqueString: String,
  createdAt: Date,

  expiresAt: Date,
});

module.exports = mongoose.model("TempKids", TempUserModel);
