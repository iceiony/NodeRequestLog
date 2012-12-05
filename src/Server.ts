///<reference path='lib.d.ts' />
///<reference path='Node.d.ts' />

import http = module('http');
import format = module('./FormatOutput');


var formatter = new format.SimpleFormatOutput();

console.log('server starting');

var server = http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
	
	res.write(req.method+'\n');
	res.write(req.url+'\n');
    res.write(formatter.formatJASON(JSON.stringify(req.headers)));
	
	req.on('data',function(data){
		res.write(data.toString());
	});
    res.end();
});

server.listen(8000);
console.log('Server running on port 8000');
