var request = require('request');
var url = require('url');
var http = require('http');
var databaseUrl = "uberalles"; // "username:password@example.com/mydb"
var collections = ["helpers"]
var db = require("mongojs").connect(databaseUrl, collections);

var accountSid = 'AC926ffe139c6cdcbf86d6aebecaca6fa1'; 
var authToken = 'd2d15fb4ad696b3534143b9da245dfd2'; 

var client = require('twilio')(accountSid, authToken); 

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
        if (typeof parsedUrl.query.skills == "string") {
            parsedUrl.query.skills = new Array(parsedUrl.query.skills);
        }
        db.helpers.update(
        { name: parsedUrl.query.user_name },
        {
            name: parsedUrl.query.user_name,
            skills: parsedUrl.query.skills,
            realname: parsedUrl.query.full_name,
            age: parsedUrl.query.age,
            phone: parsedUrl.query.phone
        },
        { upsert: true },
        function() {
            respObj.success = "true";
            respObj.message = "registered";
            res.end(JSON.stringify(respObj));
        });
    }

    // ------------------------------------------------------------------ //

    else if (parsedUrl.pathname == "/call") {
        var helpObj = {
            location: {
                latitude: parsedUrl.query.latitude,
                longitude: parsedUrl.query.longitude,
                accuracy: parsedUrl.query.accuracy
            },
            type: parsedUrl.query.type
        };
        requests[parsedUrl.query.user_name] = helpObj;
console.log(requests);
        respObj = { success: "true", message: "Added to request queue" } ;
        res.end(JSON.stringify(respObj));
    }

    // ------------------------------------------------------------------ //

    else if (parsedUrl.pathname == "/helpercheckin") {
        var helper_location = {
            latitude: parsedUrl.query.latitude,
            longitude: parsedUrl.query.longitude,
            accuracy: parsedUrl.query.accuracy
        };
        helpers[parsedUrl.query.user_name] = helper_location;

        respObj.requests = {};

        // Find checked-in user's skills
        db.helpers.find( {name: parsedUrl.query.user_name}, function(err, helpr) {
            for (var i in requests) {
                // If skills match any requests
                if ( helpr[0].skills.indexOf(requests[i].type) !== -1 ) {
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

    else if (parsedUrl.pathname == "/accept") {
        matched[parsedUrl.query.acceptedName] = parsedUrl.query.user_name;
        respObj.success = "true";
        respObj.message = "accepted";
        respObj.location = requests[parsedUrl.query.acceptedName].location;
        
        db.helpers.find({name: parsedUrl.query.acceptedName}, function(err, requestr) {
            db.helpers.find({name: parsedUrl.query.user_name}, function(err, helpr) {
                client.messages.create({  
                    from: "+17746332212",
                    to: ""+requestr[0].phone,
                    body: helpr[0].realname+" is coming to help you!"    
                }, function(err, message) {
                     delete requests[parsedUrl.query.acceptedName]; 
                });
            });
        });
       
        res.end(JSON.stringify(respObj));
 
    }

    // --------------------------------------------------------------- //
    
    else if (parsedUrl.pathname == "/requestorcheckin") {
        if (matched.hasOwnProperty(parsedUrl.query.user_name)) {
            respObj.success = "true";
            respObj.message = "match found";
            respObj.helper.name = matched[parsedUrl.query.user_name]
            respObj.helper.location = {
                latitude : helpers[respObj.helperName].latitude,
                longitude : helpers[respObj.helperName].longitude,
                accuracy : helpers[respObj,helperName].accuracy
            };
        }
        else {
            respObj.success = "false";
            respObj.message = "no match yet";
            respObj.helper = {};
        }
        res.end(JSON.stringify(respObj));
    }
    
    // --------------------------------------------------------------- //
    
    else if (parsedUrl.pathname == "/getAllUsers") {
        var allHelpers = {};
                
        for (var i in helpers) {

            db.helpers.find({name:i}, function(err, helpr) {
                allHelpers[i] = {
                    location: helpers[i],
                    skills : helpr[0].skills,
                    info : {
                        full_name: helpr[0].realname,
                        age: helpr[0].age,
                        phone: helpr[0].phone
                    }
                };
                
            });
        }
        setTimeout( function() {
            res.end(JSON.stringify(allHelpers));
        }, 750);
    }

    // --------------------------------------------------------------- //
    
    else if (parsedUrl.pathname == "/getUserDetails") {
        db.helpers.find({name:parsedUrl.query.user_name}, function(err, helpr) {
            if (typeof helpr[0] === 'undefined')
                res.end("not found");
            else
                res.end(JSON.stringify(helpr[0]));
        });
    }

    // -------------------------------------------------------------- //

    else if (parsedUrl.pathname == "/logout" ) {
        delete helpers[parsedUrl.query.user_name];
        respObj = {
            success: "true",
            message: "logged out"
        };
        res.end(JSON.stringify(respObj));
    }

    // ------------------------------------------------------------- //
    
    else {
        res.end("Unrecognized request, probably favico");
    }

}).listen(8080);
