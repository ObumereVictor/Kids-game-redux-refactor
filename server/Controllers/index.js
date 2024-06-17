const { createGame, getGame, submitGame } = require("./gameController");
const {
  registerUser,
  sendResetPasswordEmail,
  verifyEmail,
  signIn,
  verificationEmail,
  updateProfile,
  getUser,
  verifyResetPasswordLink,
  updatePassword,
} = require("./userController");

module.exports = {
  registerUser,
  sendResetPasswordEmail,
  verifyEmail,
  signIn,
  verificationEmail,
  updateProfile,
  createGame,
  getGame,
  submitGame,
  getUser,
  verifyResetPasswordLink,
  updatePassword,
};
