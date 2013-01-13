///<reference path='./Definitions/mongodb.d.ts'/>
///<reference path='./Definitions/node.d.ts' />
///<reference path='lib.d.ts' />
import mongo = module('mongodb');
import http = module('http');

export class RequestRecorder {
    mongo_server_config:mongo.Server;
    dataCollection:mongo.Collection;

    dbs:string = 'RequestLog';
    collection:string = 'requestData';

    constructor(hostName:string = "127.0.0.1", port:number = 27017) {
        var self:RequestRecorder = this;

        self.dataCollection = null;
        self.mongo_server_config = new mongo.Server(hostName, port, {});

        new mongo.Db(self.dbs, self.mongo_server_config, {w: 1})
            .open(function (error, client) {
                if (error) throw error;
                self.dataCollection = new mongo.Collection(client, self.collection);
            });
    }

    public handle(req:http.ServerRequest) {
        var postData = "",
            self:RequestRecorder = this;

        req.on('data', function (data) {
            postData += data.toString();
        });

        req.on('end', function () {
            self.dataCollection.insert({
                method: req.method,
                url: req.url,
                ip: req.connection.remoteAddress,
                headers: req.headers,
                data: postData
            }, {safe: false});
        });
    }
}