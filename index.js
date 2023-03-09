const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (req,res,next) => {
  res.send('<form action="/" method="POST"><input type="text" name="title"><input type="number" name="size"><button type=submit>Submit</button></form>')
})

app.use('/', (req,res,next) => {

  if(req.method === "POST"){
    console.log(req.body);
  res.send('<h1>Product has been added</h1>');
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
