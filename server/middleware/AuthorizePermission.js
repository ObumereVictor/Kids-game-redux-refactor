const { StatusCodes } = require("http-status-codes");

const authorizePermission = (...role) => {
  return (request, response, next) => {
    if (!role.includes(request.role)) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: "Cannot Perform this action",
      });
    }
    next();
  };
};

module.exports = authorizePermission;
