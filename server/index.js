const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const { userRouter, gameRouter } = require("./routers");
const start = require("./utils/ConnectDb");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(gameRouter);
const connect = async () => {
  try {
    await start();
    app.listen(port, console.log(`Server is listening on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

connect();
