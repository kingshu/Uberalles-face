var databaseUrl = "uberalles"; // "username:password@example.com/mydb"
var collections = ["helpers"]
var db = require("mongojs").connect(databaseUrl, collections);

db.helpers.find({skills:"cpw"}, function(err, res) {
  console.log(res);
});