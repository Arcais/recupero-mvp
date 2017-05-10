//***Dependencies***
//NPM Modules
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');
var https = require('https');
//***Dependencies***



//***Database Connection***
mongoose.connect('mongodb://localhost/recupero');
//mongoose.connect('mongodb://g0lem:SF4phakPnXGunDSnhnWLxzWy@ds111798.mlab.com:11798/taiga-db');
require("./models/user");
require("./models/company");

var User = mongoose.model('User');
var Company = mongoose.model('Company');
//***Database Connection***


//***App Configuration***
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
//***App Configuration***



//***Server Start***
var server = app.listen(process.env.PORT || 8000, function(){
  console.log("App is listening on http://localhost:%d", server.address().port);
});

// var keys_dir = 'keys/';
// var server_options = {
//   key  : fs.readFileSync(keys_dir + 'privatekey.pem').toString(),
//   ca   : fs.readFileSync(keys_dir + 'certauthority.pem').toString(),
//   cert : fs.readFileSync(keys_dir + 'certificate.pem').toString()
// }

// var server = https.createServer(server_options, app).listen(process.env.PORT || 8000, function(){
  
//   console.log("App is listening on http://localhost:%d", server.address().port);

// });

//***Server Start***

//***Taiga Modules***
var Auth = require('./recupero_modules/auth');

var auth = new Auth(Company);

var account = require("./recupero_modules/account");
account(app, auth, mongoose);


var routes = require("./recupero_modules/routes");
routes(app, auth, __dirname);

var rest = require("./recupero_modules/rest");
rest(app, auth, mongoose);
//***Taiga Modules***



//***App Status Configuration***
app.use(function(req, res, next){

  if(res.status(404)){
    res.send("404");
  }

});
//***App Status Configuration***




// var tempAddObjectToDatabase = new Company({cui:"12345", caen: "ceva", nume:"bbb", reclamatii: [{caenReclamant:1212, amount: 10}, {caenReclamant: 121221, amount: 1000}]});
// tempAddObjectToDatabase.save();