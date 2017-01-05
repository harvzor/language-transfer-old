var http = require('http');
var st = require('st');

http.createServer(
    st({ path: __dirname, index: 'index.html', cache: true})
).listen(process.env.port);

