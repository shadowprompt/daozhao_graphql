const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const server = http2.createSecureServer({
  key: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost-privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost-cert.pem'))
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);