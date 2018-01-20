let http = require('http');
let app = require('./app');

const PORT = process.env.PORT || 8000;

let server = http.createServer( app );

server.listen( PORT );