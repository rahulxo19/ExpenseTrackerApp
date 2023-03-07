const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        let message = '';
        if (fs.existsSync(__dirname + '/message.txt')) {
          message = fs.readFileSync(__dirname + '/message.txt', 'utf8');
        }
        res.write('<html>');
        res.write('<head><title>Home</title></head>');
        res.write('<body>');
        if (message) {
          res.write(`<p>${message}</p>`);
        }
        res.write('<form action="/message" method="POST">');
        res.write('<input type="text" name="message">');
        res.write('<button type="submit">Submit</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
      }
  else if(url === '/message' && req.method === 'POST'){
    const body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    })
    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1];
        console.log(message);
        fs.writeFile( __dirname+ '/message.txt', message, err => {
            res.statusCode = 302;
    res.setHeader('Location','/')
    return res.end();
        });
    })
    }

});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
