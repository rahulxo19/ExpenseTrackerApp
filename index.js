const http = require('http');
// const routes = require('./routes');

const express = require('express');
const app = express();

const server = http.createServer(app);

app.use((req, res, next) => {
  next();

})
app.use((req, res, next) => {
  res.send('<h2>Hello from 2nd middleware</h2>')
})

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
