const nodemailer = require("nodemailer");
const { url, frontEndUrl } = require("./Constants");
const path = require("path");
const { nodemailerConfig } = require("./config");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config({ path: path.resolve("../.env") });
const { UserModel, TempUserModel } = require("../Models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendVerificationMail = async function ({ email }, uniqueString) {
  const currentURL = url;
  //  HOTMAIL TRANSPORT
  // const transporter = nodemailer.createTransport({
  //   service: "hotmail",
  //   auth: {
  //     user: process.env.EMAIL,
  //     pass: process.env.PASSWORD,
  //   },
  // });

  // ethereal transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EEMAIL,
      pass: process.env.EPASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EEMAIL,
    to: email,
    subject: "Please Verify your Account",
    text: "Please Verify your account",
    html: `<strong>Kids Spelling Game</strong><p style="color:blue;font-size:2rem;"}}>Verify your email address</h1> <p>To finish setting up your Kids Spelling game account, we just need to make sure that this email address is yours.</p> <p>To verify your email address, click on the link <a href=${
      currentURL + "/api/v2/register/verify/" + uniqueString
    } target="__blank">Link</a>.</p> 
        <p>If you didn't request this message, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        <p>Thanks,</p>
        <p>Kids Spelling game.</p>
        <br/><br/><br/><br/>
                <p style="font-size:10px;">This is an automatic email. Replies to this email are not monitored.</p>

        `,
  };

  try {
    const mail = await transporter.sendMail(mailOptions);

    return mail;
  } catch (error) {
    console.log("Mailerror" + error);
    throw error;

    // response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   status: "Failed",
    //   msg: `Server Error. Please try again in some minutes!`,
    //   errorType: "serverError",
    // });
  }
};

// RESENDING VERIFICATION EMAIL
const resendVerficationEmail = async (request, response) => {
  const { email } = request.body;

  const currentUser = await UserModel.findOne({ email });
  // const { email } = currentUser;
  const { _id: userId, email: userEmail } = currentUser;

  const currentTempUser = await TempUserModel.findOneAndUpdate({ userId });
  // console.log(currentTempUser);
  if (!currentTempUser) return;
  const uniqueString = currentTempUser.uniqueString;
  await sendVerificationMail(
    { _id: userId, email: userEmail },
    uniqueString,
    response
  );
  const saltRounds = Number(process.env.SALT_ROUNDS);
  bcrypt.hash(uniqueString, saltRounds).then(async (hashedString) => {
    currentTempUser.uuid = hashedString;
    currentTempUser.createdAt = Date.now();
    currentTempUser.expiresAt = Date.now() + 600000;
    await currentTempUser.save();
  });

  response
    .status(StatusCodes.ACCEPTED)
    .json({ status: "Success", msg: "Verification Email Sent Successfully" });
};

// SENDING RESET PASSWORD LINK
const sendResetPasswordLink = async ({ _id, email }, response) => {
  // const currentURL = "https://kids-spelling-game.onrender.com";
  let data = { email, _id };
  let token = jwt.sign(data, process.env.JWT_KEY, { expiresIn: 60 * 10 });

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "leo.mayer28@ethereal.email",
      pass: "WM96nkaF49ShpY4mrE",
    },
  });
  // const transporter = nodemailer.createTransport({
  //   service: "hotmail",
  //   auth: {
  //     user: process.env.EMAIL,
  //     pass: process.env.PASSWORD,
  //   },
  // });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset your password for your account",
    html: `<div> <h2>Password Reset</h2>

    <p>Click the link to reset your password 
    <a href=${frontEndUrl + "/reset-password/" + token} target= _blank>Link</a>
    <p>Link expires in 10 minutes</p>
    If you didn't initiate password reset for your account. Ignore this message</p>
    </div>`,
  };

  try {
    const mail = transporter.sendMail(mailOptions);
    return mail;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendVerificationMail,
  resendVerficationEmail,
  sendResetPasswordLink,
};
