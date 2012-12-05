///<reference path='lib.d.ts' />
///<reference path='Node.d.ts' />

import http = module('http');
import greet = module('./Greeter');


var greeter = new greet.Greeter();

console.log('server starting');

var server = http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.write(greeter.sayHello());
    res.end();
});
server.listen(8000);
console.log('Server running on port 8000');
