var databaseUrl = "uberalles"; // "username:password@example.com/mydb"
var collections = ["helpers"]
var db = require("mongojs").connect(databaseUrl, collections);

db.helpers.update({phone: '8476366286'},{
    name: "mgottein",
    realname: "Matt G",
    age: 20,
    skills: [ 'CPR', 'Life Saving', 'Doctor' ],
    phone: "8476366286"
}, function(err, res) {
  console.log(res);


db.helpers.find(function(err, res) {
    console.log(res);
});

});
