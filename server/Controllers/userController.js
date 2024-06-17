const { UserModel, TempUserModel } = require("../Models");
const { hashPassword, createTempUser } = require("../utils");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const {
  sendVerificationMail,
  sendResetPasswordLink,
} = require("../utils/mail");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.resolve("../.env") });
const { frontEndUrl } = require("../utils/Constants");

const registerUser = async (request, response) => {
  let { first_name, last_name, email, age, password, username } = request.body;

  email = email.toLowerCase().trim();
  first_name = first_name.trim();
  last_name = last_name.trim();
  password = password.trim();
  username = username.trim();

  // NO INPUT FOUND
  if (!first_name || !last_name || !email || !age || !password || !username) {
    return response
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ status: "Failed", msg: "No Fields", errorType: "nofields" });
  }

  // SETTING ROLE
  const isFirstCount = (await UserModel.countDocuments({})) === 0;
  const role = isFirstCount ? "admin" : "user";

  // CHECKING IF EMAIL IS A DUPLICATE

  const isEmailAvaliable = await UserModel.findOne({ email });

  if (isEmailAvaliable) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Email avaliable",
      errorType: "emailexist",
    });
  }

  // CHECKING IF USERNAME IS A DUPLICATE
  const isUserNameAvaliable = await UserModel.findOne({ username });
  if (isUserNameAvaliable) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Username Avaliable",
      errorType: "usernameexist",
    });
  }
  // HASHING PASSWORD
  const hashedPassword = await hashPassword(password);

  const user = {
    firstname: first_name,
    lastname: last_name,
    email,
    age,
    password,
    username,
  };
  try {
    const token = jwt.sign({ email }, `${process.env.EPASSWORD}`, {
      expiresIn: 60 * 20,
    });
    // console.log(token);

    const sendEmail = await sendVerificationMail({ email }, token);
    // console.log(sendEmail);

    const newUser = await UserModel.create({
      ...user,
      role,
      password: hashedPassword,
    });
    // console.log(newUser);
    const { _id, email: tempEmail, verified } = newUser;

    // CREATING TEMP USER

    const saltRounds = Number(process.env.SALT_ROUNDS);
    createTempUser(token, saltRounds, _id, email, verified);
    // HASHING THE UNIQUE STRING

    // let uniqueString = uuidv4() + _id;
    return response
      .status(StatusCodes.CREATED)
      .json({ msg: "Registration Successful" });
    // CREATING TEMP USER
  } catch (error) {
    // console.log({ error });

    // mail is sending but there is name error

    // HANDLING MONGOOSE ERROR
    // if (
    //   error.errors.firstname?.kind === "regexp" ||
    //   error.errors.lastname?.kind === "regexp"
    // ) {
    //   return response.status(StatusCodes.BAD_REQUEST).json({
    //     status: "Failed",
    //     msg: `First Name or Last name should contain only letters`,

    //     errorType: "firstnameError",
    //   });
    // }
    // if (error.errors.firstname) {
    //   return response.status(StatusCodes.BAD_REQUEST).json({
    //     status: "Failed",
    //     msg: `First Name ${error.errors.firstname.message} letters`,
    //     errorType: "firstnameError",
    //   });
    // }
    // if (error.errors.lastname) {
    //   return response.status(StatusCodes.BAD_REQUEST).json({
    //     status: "Failed",
    //     msg: `Last Name ${error.errors.lastname.message} letters`,
    //     errorType: "lastnameError",
    //   });
    // }
    // if (error.errors.username) {
    //   return response.status(StatusCodes.BAD_REQUEST).json({
    //     status: "Failed",
    //     msg: `Username ${error.errors.username.message} letters`,
    //     errorType: "usernameError",
    //   });
    // }
    // if (error.errors.password) {
    //   return response.status(StatusCodes.BAD_REQUEST).json({
    //     status: "Failed",
    //     msg: `Password ${error.errors.password.message}`,
    //     errorType: "passwordError",
    //   });
    // } else {
    return response.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      msg: "Server Error, Try again",
      status: "Failed",
    });
  }
  // }
};

// SEND RESET PASSWORD EMAIL
const sendResetPasswordEmail = async (request, response) => {
  const { email } = request.body;

  // NO INPUT
  if (!email) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Input your email address",
      errorType: "noInputError",
    });
  }

  // CHECKING IF USER EXIST
  const user = await UserModel.findOne({ email });
  // console.log(user);
  if (!user) {
    return response
      .status(StatusCodes.OK)
      .json({ status: "Success", msg: "Email Sent Successfully" });
  }
  // return response.end();
  const { _id } = user;

  await sendResetPasswordLink({ _id, email }, response);

  return response
    .status(StatusCodes.OK)
    .json({ status: "Success", msg: "Email Sent Successfully" });
};

// VERIFY EMAIL LINK
const verifyEmail = async (request, response) => {
  const { uniqueString } = request.params;

  const token = jwt.verify(uniqueString, `${process.env.EPASSWORD}`);
  const currentUser = await UserModel.findOne({ email: token.email });
  const currentTempUser = await TempUserModel.findOne({
    userId: currentUser._id,
  });

  if (!currentTempUser) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .sendFile(path.resolve(__dirname, "../views/linkExpired.html"));
  }
  const isUniqueStringOk = await bcrypt.compare(
    uniqueString,
    currentTempUser.uuid
  );
  if (!isUniqueStringOk) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send(
        `<div><h2>Error!!!</h2> <h3>Not authorized to perform this action</h3></div>`
      );
  }
  if (currentTempUser.expiresAt < Date.now()) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .sendFile(path.resolve(__dirname, "../views/linkExpired.html"));
  }
  currentUser.verified = true;
  await currentUser.save();
  await TempUserModel.deleteOne({ userId: currentUser._id });
  return response
    .status(StatusCodes.OK)
    .sendFile(path.resolve(__dirname, "../views/emailVerified.html"));
};

// SIGN IN USER
const signIn = async (request, response, next) => {
  let { email, password } = request.body;

  email = email.toLowerCase().trim();
  password = password.trim();
  // console.log(email);

  if (!email || !password) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: "Failed",
      msg: "Please Input the fields",
      errorType: "noFields",
    });
  }
  const user = await UserModel.findOne({ email });

  // IF USER IS NOT AVAILABLE
  if (!user) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: "Failed",
      msg: "Email doesn't exist, Please Sign Up",
      errorType: "invalidEmail",
    });
  }

  // IF PASSWORD DOESNT MATCH
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: "Failed",
      msg: "Invalid Password",
      errorType: "invalidPassword",
    });
  }

  let {
    _id,
    verified,
    completedProfile,
    difficulty,
    role,
    username,
    age,
    profilePic,
  } = user;
  // CREATING TOKEN
  const token = jwt.sign({ _id, role }, process.env.JWT_KEY, {
    expiresIn: "10d",
  });

  // response.cookie("login_token", token, {
  //   // httpOnly: false,
  //   maxAge: 60 * 60 * 24,
  //   secure: true,
  //   // domain: "kids-spelling-game.onrender.com",
  //   path: "/",
  //   sameSite: "strict",
  // });
  let userData = {
    verified,
    userId: _id,
    email: user.email,
    username,
    age,
    profilePic,
    difficulty,
    role,
  };

  // IS USER VERIFIED
  const isUserVerified = await TempUserModel.findOne({ userId: _id });
  if (isUserVerified) {
    // SEND VERIFICATION EMAIL
    return response.status(StatusCodes.OK).json({
      status: "Success",
      msg: "Please verify your account",
      responseType: "verifyAccount",
      ...userData,
    });
  }
  userData = {
    ...userData,
    token,
    completedProfile,
    username,
    age,
    profilePic,
    difficulty,
  };
  if (!completedProfile) {
    return response.status(StatusCodes.OK).json({
      status: "Success",
      msg: "Please complete your profile",
      responseType: "completeProfile",
      ...userData,
    });
  }
  userData = { ...userData };
  response.status(StatusCodes.OK).json({
    status: "Success",
    msg: "Sucessfully logged in",
    responseType: "loggedIn",
    token,
    ...userData,
  });

  next();
};

const updateProfile = async (request, response) => {
  const { profilePic, difficulty } = request.body;
  const user = request.user;
  await UserModel.findOneAndUpdate(
    { _id: user },
    { profilePic, difficulty, completedProfile: true }
  );
  return response.status(StatusCodes.OK).json({
    status: "Success",
    msg: "Profile Updated Successfully",
    profilePic,
    difficulty,
  });
};

const getUser = async (request, response) => {
  let { token } = request.body;

  if (!token) return;
  const { _id } = jwt.verify(token, process.env.JWT_KEY);

  const user = await UserModel.findOne({ _id });
  const { username } = user;

  return response.status(StatusCodes.OK).json({
    user: { username },
  });
};

//    VERIFY PASSWORD LINK
const verifyResetPasswordLink = async (request, response) => {
  response.redirect(frontEndUrl + `/reset-password/:token`);
};

//     UPDATE PASSWORD
const updatePassword = async (request, response) => {
  const { newPassword, token } = request.body;

  // COMPARE TOKEN
  try {
    const isTokenOk = jwt.verify(token, process.env.JWT_KEY);
    // console.log(isTokenOk);

    const { _id, email } = isTokenOk;
    const saltRounds = Number(process.env.SALT_ROUNDS);

    const hashedUpdatedPassword = await bcrypt.hash(newPassword, saltRounds);
    const user = await UserModel.findOneAndUpdate(
      { _id },
      { password: hashedUpdatedPassword }
    );
    await user.save();
    // console.log(user.username);
    return response
      .status(StatusCodes.CREATED)
      .json({ status: "Success", msg: "Password Changed!" });
  } catch (error) {
    // console.log(error);

    // EXPIRED JWT
    if (error.message === "jwt expired") {
      return response.status(StatusCodes.NOT_ACCEPTABLE).json({
        status: "Failed",
        msg: "Reset password link has expired",
        errorType: "linkexpired",
      });
    }

    // CHECKING MONGOOSE PASSWORD ERROR
    if (error.errors.password) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: `Password ${error.errors.password.properties.message}`,
        errorType: "mongooseError",
      });
    }
  }

  response.end();
};

module.exports = {
  registerUser,
  sendResetPasswordEmail,
  verifyEmail,
  signIn,
  updateProfile,
  getUser,
  verifyResetPasswordLink,
  updatePassword,
};
