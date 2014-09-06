URL: ec2-54-227-133-117.compute-1.amazonaws.com

endpoint: 
    /call
params:
    name
    latitude
    longitude
    type
response:
    { 
        success: "true", 
        message: "Added to request queue" 
    }
    
================================================================

endpoint: 
    /requestorcheckin
params:
    name
response:
    { 
        success: "true", 
        message: "match found",
        helper: {
            name: "kingshu",
            latitude: 32.35233,
            longitude: 53.23423
        }
    }

=================================================================
    
endpoint:
    /helpercheckin
params:
    name
    latitude
    longitude
response:
    {
        success: "true",
        message: "checked in",
        requests: {
            cwirt: {
                latitude:43.343,
                longitude:52.664,
                type:"cpr"
            },
            scott: {
                latitude:46.343,
                longitude:51.664,
                type:"heimlich"
            }
        }
    }

=================================================================
    
endpoint: 
    /register
params:
    name
    skills[]
response:
    {
        success: "true",
        message: "recorded"
    }
    
=================================================================    
    
endpoint:
    /accept
params:
    name
    acceptedName
response: 
    {
        success: "true",
        message: "accepted",
        latitude: 34.55532,
        longitude: 56.31324
    }

=================================================================
