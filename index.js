const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const sequelize = require('./util/database')
const form = require('./routes/form')

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use('/', form)

sequelize.sync().then(() => {
  app.listen(3000);
}).catch(err => console.log(err))
