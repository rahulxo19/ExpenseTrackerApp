const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path")
require("dotenv").config();

const sequelize = require("./util/database");
const form = require("./routes/form");
const User = require("./model/signup");
const Expenses = require("./model/form");
const Order = require("./model/orders");
const forgotpassword = require("./model/forgotpassword");

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User);

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream : accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", form);

// app.use('/', form)

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
