"use strict";

console.log('server starting');

var http = require('http');
var server = http.createServer(
    function(req,res){
        res.writeHead(200,{"Content-Type": "text/plain"});
        res.write("hello world");
        res.end();
    }
);
server.listen(8000);

console.log('Server running on port 8000');
