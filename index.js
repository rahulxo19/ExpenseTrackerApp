const express = require('express');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const shop = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', admin)

app.use('/shop', shop)

app.use((req, res, next) => {
  res.status(404).send('<h1> Page Not Found</h1>');
})

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
