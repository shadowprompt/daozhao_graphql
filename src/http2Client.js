const http2 = require('http2');
const fs = require('fs');
const path = require('path')

const client = http2.connect('https://127.0.0.1:8443', {
  ca: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost-cert.pem'))
});
client.on('error', (err) => console.error(err));

const req = client.request({
  ':path': '/'
});

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => {
  data += chunk;
});
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
