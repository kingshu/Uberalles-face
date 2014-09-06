var request = require('request');
var url = require('url');
var http = require('http');
var databaseUrl = "uberalles"; // "username:password@example.com/mydb"
var collections = ["helpers"]
var db = require("mongojs").connect(databaseUrl, collections);

var helpers = {};
var requests = {};
var matched = {};

var server = http.createServer(function(req, res) {

    res.writeHead(200, {
        'content-type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    });
    var parsedUrl = url.parse(req.url, true);
    var respObj = {};

    // ----------------------------------------------------------------- //

    if (parsedUrl.pathname == "/register" ) {
        db.helpers.save({
            name: parsedUrl.query.name,
            skills: parsedUrl.query.skills
        }, function() {
            respObj.success = "true";
            respObj.message = "registered";
            res.end(JSON.stringify(respObj));
        });
    }

    // ------------------------------------------------------------------ //

    if (parsedUrl.pathname == "/call") {
        var helpObj = {
            latitude: parsedUrl.query.latitude,
            longitude: parsedUrl.query.longitude,
            type: parsedUrl.query.type
        };
        requests[parsedUrl.query.name] = helpObj;

        respObj = { success: "true", message: "Added to request queue" } ;
        res.end(JSON.stringify(respObj));
    }

    // ------------------------------------------------------------------ //

    if (parsedUrl.pathname == "/helpercheckin") {
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
            respObj.success = "true";
            respObj.message = "checked in";

            res.end(JSON.stringify(respObj));
        });        
    }

    // ---------------------------------------------------------------- //

    if (parsedUrl.pathname == "/accept") {
        matched[parsedUrl.query.acceptedName] = parsedUrl.query.name;
        respObj.success = "true";
        respObj.message = "accepted";
        respObj.latitude = requests[parsedUrl.query.acceptedName].latitude;
        respObj.longitude = requests[parsedUrl.query.acceptedName].longitude;
        
        delete requests[parsedUrl.query.acceptedName];

        res.end(respObj);
 
    }

    // --------------------------------------------------------------- //
    
    if (parsedUrl.pathname == "/requestorcheckin") {
        if (matched.hasOwnProperty(parsedUrl.query.name)) {
            respObj.success = "true";
            respObj.message = "match found";
            respObj.helper.name = matched[parsedUrl.query.name]
            respObj.helper.latitude = helpers[respObj.helperName].latitude;
            respObj.helper.longitude = helpers[respObj.helperName].longitude;
        }
        else {
            respObj.success = "false";
            respObj.message = "no match yet";
            respObj.helper = {};
        }
        res.end(respObj);
    }
    
    res.end("Unrecognized request, probably favico");

}).listen(8080);
