const express = require("express");
const userRouter = express.Router();
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
} = require("../Controllers");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { resendVerficationEmail } = require("../utils/mail");
const { uploadImage } = require("../utils");
const AuthenticateUser = require("../middleware/AuthenticateUser");

userRouter.post("/api/v2/register", registerUser);
// userRouter.post("/api/v2/register/:userId", resendVerficationEmail);
userRouter.post("/api/v2/forgot-password", sendResetPasswordEmail);
userRouter.get("/api/v2/register/verify/:uniqueString", verifyEmail);
userRouter.post("/api/v2/login", signIn);
userRouter.post("/api/v2/verify-email/:email", resendVerficationEmail);
userRouter.post(
  "/api/v2/upload-image",
  upload.single("profilepic"),
  uploadImage
);
userRouter.patch("/api/v2/update-profile", AuthenticateUser, updateProfile);
userRouter.post("/api/v2/user", getUser);
userRouter
  .route("/api/v2/reset-password/:token")
  .get(verifyResetPasswordLink)
  .post(updatePassword);

module.exports = userRouter;
