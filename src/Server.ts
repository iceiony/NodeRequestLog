///<reference path='lib.d.ts' />
///<reference path='node.d.ts' />
///<reference path='mongodb.d.ts'/>

import http = module('http');
import mongo = module('mongodb');
import format = module('./FormatOutput');

console.log('server starting');

var formatter = new format.SimpleFormatOutput(),
        mongo_server_config = new mongo.Server("127.0.0.1", 27017, {}),
        handleResponse = function (req, res) {
            res.writeHead(200, {
                "Content-Type": "text/plain"
            });

            res.write(req.method + '\n');
            res.write(req.url + '\n');
            res.write(formatter.formatJASON(JSON.stringify(req.headers)));

            req.on('data', function (data) {
                res.write(data.toString());
            });
            res.end();
        },
        recordRequest = (function () {
            var dataCollection: mongo.Collection = null;
            new mongo.Db('RequestLog', mongo_server_config, {w: 1}).open(function (error, client) {
                if (error) throw error;
                dataCollection = new mongo.Collection(client, 'requestData');
            });
            return function (req) {
                console.log("Saving request");
                dataCollection.insert({
                    method: req.method,
                    url: req.url,
                    headers: req.headers
                }, {safe: false});
                console.log("Request saved");
            };
        })(),
        server = http.createServer(function (req, res) {
            handleResponse(req, res);
            recordRequest(req);
        });


server.listen(8000);
console.log('Server running on port 8000');
