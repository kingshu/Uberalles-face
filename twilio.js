var accountSid = 'AC926ffe139c6cdcbf86d6aebecaca6fa1'; 
var authToken = 'd2d15fb4ad696b3534143b9da245dfd2'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
client.sendMessage({
    to:'+5056522451', // Any number Twilio can deliver to
    from: '+17746332212', // A number you bought from Twilio and can use for outbound communication
    body: 'wosddg' // body of the SMS message
}, function(err, responseData) { 
    console.log(responseData);
});
