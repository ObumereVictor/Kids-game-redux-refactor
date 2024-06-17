const { nodemailerConfig } = require("./config");
const nodemailer = require("nodemailer");

const test = async () => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  transporter.verify(function (error, success) {
    if (error) {
      console.log({ error });
      return;
    } else {
      console.log({ success });
    }
  });
};

test();
// module.exports = test;
