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
require("./models/reclamatie");
require("./models/company");

var Reclamatie = mongoose.model('Reclamatie');
var Companie = mongoose.model('Companie');
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

var auth = new Auth(Companie);

var account = require("./recupero_modules/account");
account(app, auth, mongoose);


var routes = require("./recupero_modules/routes");
routes(app, auth, __dirname);

var rest = require("./recupero_modules/rest");
rest(app, auth, mongoose);
//***Taiga Modules***
var upload = require("./recupero_modules/upload");
upload(app, auth, mongoose, __dirname);


//***App Status Configuration***
app.use(function(req, res, next){

  if(res.status(404)){
    res.send("404");
  }

});
//***App Status Configuration***




// var tempAddObjectToDatabase = new Companie({cui:"12345", caen: "ceva", nume:"bbb", reclamatii: [{caenReclamant:1212, amount: 10}, {caenReclamant: 121221, amount: 1000}]});
// tempAddObjectToDatabase.save();

// var tempAddObjectToDatabase = new Companie({cui:"8374672", nume:"Companie de test", address:"Str. Generalilor nr. 11", hasAccount:0, caen:"3743"});
// tempAddObjectToDatabase.save();
// var tempAddObjectToDatabase = new Companie({cui:"7346367", nume:"Agrico SRL", address:"Str. Iordache Andreescu nr. 23", hasAccount:0, caen:"2122"});
// tempAddObjectToDatabase.save();

// function convertDashesToDate(dateStr) {
//     var parts = dateStr.split("-");
//     return new Date(parts[2], parts[1] - 1, parts[0]);
// }

// var dateBef = convertDashesToDate("23-06-2009");
// var dateBef2 = convertDashesToDate("8-02-2015");
// var dateBef3 = convertDashesToDate("17-04-2017");
// var tempAddObjectToDatabase2 = new Reclamatie({idFactura:"3746536",reclamant:"Companie de test",cuiReclamant:"8374672", caenReclamant:"3743", reclamat:"Agrico SRL", cuiReclamat:"7346367", amount:"28000", dateRegistered: dateBef, fromExcel: 1, amountPaid: 0});
// tempAddObjectToDatabase2.save();
// var tempAddObjectToDatabase2 = new Reclamatie({idFactura:"3834636",reclamant:"Companie de test",cuiReclamant:"8374672", caenReclamant:"3743", reclamat:"Agrico SRL", cuiReclamat:"7346367", amount:"17000", dateRegistered: dateBef2, fromExcel: 1, amountPaid: 0});
// tempAddObjectToDatabase2.save();
// var tempAddObjectToDatabase2 = new Reclamatie({idFactura:"4837236",reclamant:"Companie de test",cuiReclamant:"8374672", caenReclamant:"3743", reclamat:"Agrico SRL", cuiReclamat:"7346367", amount:"183000", dateRegistered: dateBef3, fromExcel: 0, amountPaid: 0});
// tempAddObjectToDatabase2.save();

