var request = require('request');
var url = require('url');
var http = require('http');


var server = http.createServer(function(req, res) {

    res.writeHead(200, {
        'content-type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    });
    var parsedUrl = url.parse(req.url, true);

    var helpers = {};

    if (parsedUrl.pathname == "/call") {
        var x = parsedUrl.query.latitude; 
        
        respObj = { success: "false", message: "Incorrect username or pin" } ;
        res.end(JSON.stringify(respObj));
    }

    if (parsedUrl.pathname == "checkin") {
        var helper_location = {
            latitude: parsedUrl.query.latitude,
            longitude: parsedUrl.query.longitude
        };
        helpers[parsedUrl.query.name] = helper_location;
        respObj = { success:"true", message:"checked in" };
        res.end(JSON.stringify(respObj));
    }
    
    res.end("Unrecognized request, probably favico");

}).listen(8080);
