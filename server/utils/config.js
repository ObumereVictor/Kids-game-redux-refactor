const cloudinary = require("cloudinary");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: path.resolve("../.env") });

const cloudinaryConfig = cloudinary.config({
  api_key: "858253899162874",
  api_secret: "3AuAD3U-5ygWT-NaE6Qxzt0eowI",
  secure: true,
  cloud_name: "dcuy6upus",
});
const nodemailerConfig = {
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

module.exports = { nodemailerConfig, cloudinaryConfig };
