var request = require('request');
var url = require('url');
var http = require('http');
var databaseUrl = "uberalles"; // "username:password@example.com/mydb"
var collections = ["helpers"]
var db = require("mongojs").connect(databaseUrl, collections);


var helpers = {};
var requests = {};

var server = http.createServer(function(req, res) {

    res.writeHead(200, {
        'content-type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    });
    var parsedUrl = url.parse(req.url, true);
    var respObj = {};

    // ------------------------------------------------------------------ //

    if (parsedUrl.pathname == "/call") {
        var x = parsedUrl.query.latitude; 
        
        respObj = { success: "false", message: "Incorrect username or pin" } ;
        res.end(JSON.stringify(respObj));
    }

    // ------------------------------------------------------------------ //

    if (parsedUrl.pathname == "/checkin") {
        var helper_location = {
            latitude: parsedUrl.query.latitude,
            longitude: parsedUrl.query.longitude
        };
        helpers[parsedUrl.query.name] = helper_location;

        respObj.requests = {};
        
        // Find checked-in user's skills
        db.helpers.find( {name: parsedUrl.query.name}, function(err, res) {
            for (var i in requests) {
                // If skills match any requests
                if ( res.skills.indexOf(requests[i].type) !== -1 ) {
                    // Then add that request to the resp.
                    respObj.requests[i] = requests[i];
                }
            }
        });        

        respObj.success = "true";
        respObj.message = "checked in";

        res.end(JSON.stringify(respObj));
    }
    
    res.end("Unrecognized request, probably favico");

}).listen(8080);
