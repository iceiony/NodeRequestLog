///<reference path='lib.d.ts' />
///<reference path='./Definitions/node.d.ts' />
import format = module('./FormatOutput');
import http = module('http');

export class ResponseHandler {
    formatter:format.SimpleFormatOutput;

    constructor() {
        this.formatter = new format.SimpleFormatOutput();
    }

    public handle(req:http.ServerRequest, res:http.ServerResponse) {
        var self:ResponseHandler = this,
            postData = "";

        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Charset": "utf-8"
        });
        res.write(req.method + '\n');
        res.write(req.connection.remoteAddress + '\n');
        res.write(req.url + '\n');
        res.write(self.formatter.formatJSON(JSON.stringify(req.headers)));

        req.on('data', function (data) {
            postData += data.toString();
        });

        req.on('end', function () {
            process.nextTick(function () {
                res.end(postData);
            });
        });
    }
}