const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

const form = require("./routes/form");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", form);

// app.use('/', form)

mongoose
  .connect(
    "mongodb://btree:Qawsed@ac-ikgx6e8-shard-00-00.0aajqa9.mongodb.net:27017,ac-ikgx6e8-shard-00-01.0aajqa9.mongodb.net:27017,ac-ikgx6e8-shard-00-02.0aajqa9.mongodb.net:27017/expenseTracker?ssl=true&replicaSet=atlas-izr0i8-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("connected to local host 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
