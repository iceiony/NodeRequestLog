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
        var instance = this,
            postData = "";
        process.nextTick(function(){
            res.writeHead(200, {
                "Content-Type": "text/plain",
                "Charset": "utf-8"
            });
            res.write(req.method + '\n');
            res.write(req.connection.remoteAddress + '\n');
            res.write(req.url + '\n');
            res.write(instance.formatter.formatJSON(JSON.stringify(req.headers)));
            console.log("headers printed");
        });

        req.on('data', function (data) {
            postData += data.toString();
        });

        req.on('end', function(){
            process.nextTick(function(){
                res.end(postData);
                console.log("ended")       ;
            });
        });
    }

    public recordRequest(req:http.ServerRequest) {
        var postData="",
            instance = this;

        req.on('data', function(data){
            postData += data.toString();
            console.log("data received for saving");
        });

        req.on('end', function(){
            console.log("Saving request");
            instance.dataCollection.insert({
                method: req.method,
                url: req.url,
                ip: req.connection.remoteAddress,
                headers: req.headers,
                data: postData
            }, {safe: false});
            console.log("Request saved");
        });
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