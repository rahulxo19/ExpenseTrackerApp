const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();

const sequelize = require('./util/database')
const form = require('./routes/form')
const User = require('./model/signup')
const Expenses = require('./model/form')
const Order = require('./model/orders')

User.hasMany(Order)
Order.belongsTo(User);

User.hasMany(Expenses)
Expenses.belongsTo(User);

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/', form)

// app.use('/', form)

sequelize.sync().then(() => {
  app.listen(3000);
}).catch(err => console.log(err))
