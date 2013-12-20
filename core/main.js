/**
 * 创建一个对nginx的门面，适用http服务
 */
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

}).listen(5542, "127.0.0.1");
