var multer = require('multer');
var fs = require('fs');
var uuid = require('node-uuid');
var excelToJson = require('convert-excel-to-json');
var basic = require("./basic_functions");

//**Upload Setup**
var storage = multer.diskStorage({
  //multers disk storage settings
  // destination: function (req, file, cb){
  //     cb(null, __dirname + '/images/chat')
  // },
  filename: function (req, file, cb){
    var datetimestamp = Date.now();
    var name = uuid.v4();
    cb(null, name + '-' + datetimestamp + ('.' + file.originalname.split('.')[file.originalname.split('.').length -1]).toLowerCase());
  }
});
var upload = multer({storage: storage});
//**Upload Setup**



module.exports = function(app, auth, mongoose, dirname){


  var Company = mongoose.model('Companie');
  var Reclamatie = mongoose.model('Reclamatie');

  app.post('/upload/excel/', upload.single('file'), auth.isAuth, function (req, res) {

    console.log(req.file);

    //***loading cookie data so we can get our username***
    var cookie_data = auth.getTokenData(req); //LOAD COOKIE DATA
    var data = {};
    //***we are making the file a png in base64, it can be anything, but we must tell the system that it's an image***
    var tmp_file = req.file; 

    if (!fs.existsSync(__dirname + "/tmp/")){
      fs.mkdirSync(__dirname + "/tmp/");
    }
      // fs.writeFile(__dirname + "/tmp/"+cookie_data.username,  tmp_file.path, function(err) {

      //   data.file = tmp_file;




          var writestream = fs.createWriteStream(dirname+'/tmp/' + cookie_data.username + '.xlsx');
          var stream = fs.createReadStream(req.file.path).pipe(writestream);


        //***stream the data from the disk***
          stream.on('close', function(){


             Company.findOne({email: req.cookies.username}, function(err, result){

                Reclamatie.find({cuiReclamant: result.cui}, function(err, reports){

                  // reports.forEach(function(b){

                  //   b.amountPaid = true;
                  //   b.save();

                  // });

                  for(var b in reports){
                    reports[b].amountPaid = true;
                    reports[b].save();
                  }


                  var json = excelToJson({
                       sourceFile: dirname+'/tmp/' + cookie_data.username + '.xlsx'
                   });


                 var jsonInDBFormat = json.Sheet1.forEach(function(a){

                    var properJSON = {_id: result.cui + basic.removeLetters(a.C), cuiReclamat: a.A, reclamat: a.B, idFactura: basic.removeLetters(a.C), ammount: a.D, ammountRange: basic.getAmountRange(a.D), dateRegistered: a.F, fromExcel: true, amountPaid: false, reclamant: result.nume, cuiReclamant: result.cui, caenReclamant: result.caen};

                    Company.findOne({cui: a.A}, function(err, result3){ 

                      if(err || !result){

                        var temp = new Company({cui: a.A, nume: a.b, hasAccount: false});
                        temp.save();

                      }

                    })


                    Reclamatie.findOne({_id: result.cui + removeLetters(a.C)}, function(err, result2){
                        if(result2 && !err){
                         
                          for(var k in properJSON){
                             result2[k]=properJSON[k];
                          }
                         
                          result2.save();
                        }
                        else{
                          var report = new Reclamatie(properJSON);
                          report.save();
                        }
                    })
                    

                 });
               });

             })


            //***after you wrote everything in the DB, delete the data on the disk***
            //fs.unlink(dirname+'/tmp/' + cookie_data.username + '.xlsx' function(){
              res.send("uploaded");
            //});                         
          });


  });



};

