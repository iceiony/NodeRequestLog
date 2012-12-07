///<reference path='lib.d.ts' />
///<reference path='node.d.ts' />
///<reference path='mongodb.d.ts'/>

import http = module('http');
import mongo = module('mongodb');
import format = module('./FormatOutput');

class ServerWrapper {
    formatter:format.SimpleFormatOutput;
    mongo_server_config:mongo.Server;
    dataCollection:mongo.Collection;

    constructor() {
        console.log("Initialising...")

        var instance = this,
            mongo_server_config = new mongo.Server("127.0.0.1", 27017, {});

        this.formatter = new format.SimpleFormatOutput();
        this.dataCollection = null;

        new mongo.Db('RequestLog', mongo_server_config, {w: 1}).open(function (error, client) {
            if (error) throw error;
            instance.dataCollection = new mongo.Collection(client, 'requestData');
        });
    }

    public handleResponse(req:http.ServerRequest, res:http.ServerResponse) {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.write(req.method + '\n');
        res.write(req.connection.remoteAddress + '\n');
        res.write(req.url + '\n');
        res.write(this.formatter.formatJASON(JSON.stringify(req.headers)));

        req.on('data', function (data) {
            res.write(data.toString());
        });
        res.end();
    }

    public recordRequest(req:http.ServerRequest) {
        console.log("Saving request");
        this.dataCollection.insert({
            method: req.method,
            url: req.url,
            ip: req.connection.remoteAddress,
            headers: req.headers
        }, {safe: false});
        console.log("Request saved");
    }

    public start() {
        console.log('Server starting');

        var instance = this,
            server = http.createServer(function (req, res) {
                    instance.handleResponse(req, res);
                    instance.recordRequest(req);
                });
        server.listen(8000);

        console.log('Server running on port 8000');
    }
}

var localServer:ServerWrapper = new ServerWrapper();
localServer.start();