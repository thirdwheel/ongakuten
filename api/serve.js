const fastcgi = require('node-fastcgi');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json'))

fastcgi.createServer(function (req, res)
{}).listen(config.fastcgi.sock);
