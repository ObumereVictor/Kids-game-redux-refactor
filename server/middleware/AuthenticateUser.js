const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { verifyToken } = require("../utils/index");
const { UserModel } = require("../Models");

const AuthenticateUser = async (request, response, next) => {
  let authenticationToken = request.headers.authorization;
  if (!authenticationToken.startsWith("Bearer ")) {
    return response.status(StatusCodes.UNAUTHORIZED).json({
      status: "Failed",
      msg: "Invalid Token",
    });
  }
  authenticationToken = authenticationToken.split(" ")[1];
  const data = jwt.verify(authenticationToken, process.env.JWT_KEY);
  const { _id: tokenID, exp } = data;

  if (exp > Date.now()) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Token Expired, Login!!",
      errorType: "invalidToken",
    });
  }
  const findUser = await UserModel.findOne({ _id: tokenID });
  const { _id: userId, role } = findUser;
  if (tokenID !== userId.toString()) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Invalid Token..." });
  }

  request.user = userId;
  request.role = role;
  next();
};

module.exports = AuthenticateUser;
