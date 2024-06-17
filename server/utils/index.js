const bcrypt = require("bcrypt");
const { TempUserModel } = require("../Models");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { cloudinaryConfig } = require("../utils/config");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// HASHING PASSWORD
const hashPassword = async (password) => {
  let hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );
  return hashedPassword;
};

// CREATING NEW TEMP USER
const createTempUser = async (
  uniqueString,
  saltRounds,
  _id,
  email,
  verified
) => {
  try {
    bcrypt.hash(uniqueString, saltRounds).then(async (hashedString) => {
      await TempUserModel.create({
        userId: _id,
        uuid: hashedString,
        uniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
      });
    });
  } catch (error) {
    throw error;
  }
  // return response.status(201).json({
  //   status: "Success",
  //   msg: "Registration Successful",
  //   userId: _id,
  //   verified,
  //   email,
  // });
};

const uploadImage = async (request, response) => {
  let image = request.file;
  if (!image) {
    return;
  }
  //  CHECK FILE TYPE
  if (!image.mimetype.startsWith("image/")) {
    return response.status(StatusCodes.FORBIDDEN).json({
      status: "Failed",
      msg: "Upload an image file",
      errorType: "notimage",
    });
  }

  // CHECKING IMAGE SIZE

  if (image.size > 1500000) {
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({
      status: "Failed",
      msg: "File size it too big. Please select an image with lower MB",
      errorType: "fileerror",
    });
  }

  cloudinaryConfig;

  const imageUrl = await cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      return response.status(StatusCodes.NOT_IMPLEMENTED).json({
        status: "Failed",
        msg: "Cannot Upload Image, Try Again Later",
      });
    }
    image = result.secure_url;
    response
      .status(StatusCodes.OK)
      .json({ status: "Success", msg: "Profile Updated successfully", image });
  });

  streamifier.createReadStream(image.buffer).pipe(imageUrl);
};

const checkPermission = (requestUser, resourceUserId) => {
  try {
    if (requestUser.role === "admin") return;
    if (requestUser.userId === resourceUserId.toString()) return;
  } catch (error) {
    throw new Error({
      status: "Failed",
      msg: "Cannot Perform this action",
      error,
    });
  }
};

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

module.exports = {
  hashPassword,
  createTempUser,
  uploadImage,
  checkPermission,
  shuffleArray,
};
