///<reference path='lib.d.ts' />
///<reference path='./Definitions/mongodb.d.ts'/>

import http = module('http');
import handler = module('./ResponseHandler');
import recorder = module('./RequestRecorder');

class ServerWrapper {
    responseHandler:handler.ResponseHandler;
    requestRecorder:recorder.RequestRecorder;

    constructor() {
        console.log("Initialising...")
        this.responseHandler = new handler.ResponseHandler();
        this.requestRecorder = new recorder.RequestRecorder();
    }

    public start() {
        console.log('Server starting');

        var self:ServerWrapper = this,
            server = http.createServer(function (req, res) {
                self.responseHandler.handle(req, res);
                self.requestRecorder.handle(req);
            });
        server.listen(8000);

        console.log('Server running on port 8000');
    }
}

var localServer:ServerWrapper = new ServerWrapper();
localServer.start();