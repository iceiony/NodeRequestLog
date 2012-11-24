var http = require('http');

var greet = require('./Greeter');
var greeter = greet.Greeter;

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
