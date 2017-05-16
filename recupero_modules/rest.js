var basic = require("./basic_functions");

module.exports = function(app, auth, mongoose){


  var Company    =  mongoose.model('Companie');
  var Reclamatie =  mongoose.model('Reclamatie');


  app.get('*/rest/company/:nume', function(req,res){
    
    Company.findOne({$or: [{cui: req.params.nume}, {email: req.params.nume}]}, function(err, result){

      if(result){
        var JSONresponse = {

          cui:        result.cui,
          email:      result.email,
          nume:       result.nume

        }

        res.send(JSONresponse);
      }
      else{
        res.send(null);
      }

    });

  });


//this returns all the reclamations that were registered by ALL companies

  app.get('*/rest/reclamatii', function(req,res){


    
    Reclamatie.find({}, function(err, result){

      if(!err && result){
        res.send(basic.safeReclamatie(result));
      }
      else{
        res.send("No results found");
      }
    });

  });


  app.get('*/rest/subscribe/:nume', function(req,res){

    Company.findOne({cui: req.params.nume}, function(err, resu){

      if(resu && ! err){

          Company.where({ email: req.cookies.username }).update({$addToSet: {subscribedTo: req.params.nume}},
                        function(err, result){
                          if(!err && result){
                            res.send("success");
                          }
                          else{
                            res.send("err");
                          }
          });

      }
      else{
          res.send("err");
      }

    })

  });

  app.get('*/rest/getSubscribers/:numar', function(req,res){

    Company.findOne({ email: req.cookies.username }, function(err, subs){


          Company.find({cui: {$in: subs.subscribedTo}}, function(err, result){


            res.send(basic.safeCompanie(result));

          }).skip(parseInt(req.params.numar-1)*10).limit(10);

    })


  })

  app.get('*/rest/getSubscriberNumber/', function(req,res){

    Company.findOne({ email: req.cookies.username }, function(err, subs){


          Company.find({cui: {$in: subs.subscribedTo}}, function(err, result){


            res.send(result.length);

          });

    })


  })

  app.get('*/rest/reclamatii/:nume', function(req,res){

    var stripedName = req.params.nume;
    stripedName = stripedName.replace(/-/g,' ');

    
    Reclamatie.find( { cuiReclamat: {'$regex': stripedName, $options:'i' } }, function(err, result){

      if(!err && result){
        res.send(basic.safeReclamatie(result));
      }
      else{
        res.send("No results found");
      }
    });

  });

  app.get('*/rest/reclamatii_strict/:nume', function(req,res){

    
    Reclamatie.find({$or: [ {cuiReclamat: req.params.nume}, {nume: req.params.nume}]}, function(err, result){

      if(!err && result){
        res.send(basic.safeReclamatie(result));
      }
      else{
        res.send("No results found");
      }
    });

  });


  //Cauta reclamatiile pentru search (in functie de reclamat)
  app.get('*/rest/reclamatii/:nume/:numar', function(req,res){

    var stripedName = req.params.nume;
    stripedName = stripedName.replace(/-/g,' ');
    
    Reclamatie.find({$or: [ {cuiReclamat: {'$regex': stripedName, $options:'i' } }, {reclamat: {'$regex': stripedName, $options:'i' } }]}, function(err, result){

      if(!err && result){
        res.send(basic.safeReclamatie(result));
      }
      else{
        res.send("No results found");
      }
      //res.send(result);

    }).skip(parseInt(req.params.numar-1)*8).limit(8);

  });

  app.get('*/rest/numarReclamatii/:nume', function(req,res){

    var stripedName = req.params.nume;
    stripedName = stripedName.replace(/-/g,' ');

    Reclamatie.find({$or: [ {cuiReclamat: {'$regex': stripedName, $options:'i' } }, {reclamat: {'$regex': stripedName, $options:'i' }  }]}, function(err, result){

      //Stii de ce e asa?
      //Pentru ca node cand vede un numar, el crede ca tu vrei sa trimiti un status code gen 404 si se buseste ca nu gaseste status code de 3
      //Thanks node :)
      var preparedArray = [];
      preparedArray.push(result.length);
      res.send(preparedArray);

    });

  });


  //Cauta reclamatiile pentru manage (in functie de reclamant)
  app.get('*/rest/reclamant/:nume', function(req,res){

    
    Reclamatie.find({$or: [ {cuiReclamant: req.params.nume}, {nume: req.params.nume}]}, function(err, result){

      if(!err && result){
        res.send(basic.safeReclamatie(result));
      }
      else{
        res.send("No results found");
      }

    });

  });

  // app.get('*/rest/numarReclamant/:nume', function(req,res){

    
  //   Reclamatie.find({$or: [ {cuiReclamant: req.params.nume}, {nume: req.params.nume}]}, function(err, result){

  //     res.send(result.length);

  //   });

  // });

  app.get('*/rest/test', function(req,res){


    
    Reclamatie.find({}, function(err, result){

      if(!err && result){
        res.send(basic.safeReclamatie(result));
      }
      else{
        res.send("No results found");
      }

    });

  });

//Object format for post
//{
//cui
//nume
//idFactura 
//amount
//dateRegistered
//}
app.post('/report', function (req, res){                    


  function convertDotsToDate(dateStr) {
                        var parts = dateStr.split("\\.");
                        return new Date(parts[2], parts[1] - 1, parts[0]);
                    }

    var userdata = basic.escapeRegExpJSON(req.body);

    console.log(userdata);

    if(userdata.cui!=''&&userdata.amount!=''&&userdata.nume!=''&&userdata.date!=''&&userdata.idFactura!=''){
        cuiVerifyString = basic.cuiRegex(userdata.cui);
        nameVerifyString = basic.companynameRegex(userdata.nume);
        if(cuiVerifyString != "ok"){
          res.send(cuiVerifyString);
        }
        else if(nameVerifyString != "ok"){
          res.send(nameVerifyString);
        }
        else{
    
          Company.findOne({ cui: userdata.cui },function(err,data){

          if(err){
            console.log(err);
          }

            if(data==undefined){

                    console.log(2);

                var temp = new Company({cui: userdata.cui,
                                        nume: userdata.nume,
                                        hasAccount: false});
                temp.save();

            }
     
          });
          Company.findOne({ email: req.cookies.username.toLowerCase() },function(err,result){

                    console.log(result);

                    var temp = new Reclamatie({ _id: result.cui + basic.removeLetters(userdata.idFactura), 
                                                cuiReclamat: userdata.cui,
                                                idFactura: basic.removeLetters(userdata.idFactura),
                                                amount: userdata.amount,
                                                amountRange: basic.getAmountRange(userdata.amount),
                                                dateRegistered: convertDotsToDate(userdata.date), 
                                                fromExcel: false,
                                                amountPaid: false,
                                                reclamant: result.nume,
                                                cuiReclamant: result.cui,
                                                caenReclamant: result.caen,
                                                reclamat: userdata.nume});
                    temp.save();
                    console.log(temp);
                    // if(saved){
                    //   res.send("Reclamatia a fost inregistrata!");
                    // }

          });
        }
    }
    else {
          res.send("Va rugam completati toate randurile!");
    }
  });



// var da = new Company({cui:"123"});
// da.save();



}