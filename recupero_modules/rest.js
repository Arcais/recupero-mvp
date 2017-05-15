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

      // var mapData = result.map(function(a) {
      // return {
      //   reclamatii: a.reclamatii.map(function(b){ return {caenReclamant: b.caenReclamant, amount: b.amount, cui: a.cui, nume: a.nume}}),
      // }
      // }); //pretty much is making an array of all the "reclamatii" arrays, the problem is that we have an array of arrays
      // var desiredResult = mapData.map(function(c){return c.reclamatii}) // var desiredResult = [].concat.apply([], mapData); //this merges the array of arrays into  a single array, instead of having an array for every single company that reported another one
      // desiredResult = [].concat.apply([], desiredResult);
      res.send(result);

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


            res.send(result);

          }).skip(parseInt(req.params.numar)).limit(1);

    })


  })





  app.get('*/rest/reclamatii/:nume', function(req,res){

    
    Reclamatie.find({$or: [ {cuiReclamat: req.params.nume}, {nume: req.params.nume}]}, function(err, result){

      // var mapData = result.map(function(a) {
      // return {
      //   reclamatii: a.reclamatii.map(function(b){ return {caenReclamant: b.caenReclamant, amount: b.amount, cui: a.cui, nume: a.nume}}),
      // }
      // }); //pretty much is making an array of all the "reclamatii" arrays, the problem is that we have an array of arrays
      // var desiredResult = mapData.map(function(c){return c.reclamatii}) // var desiredResult = [].concat.apply([], mapData); //this merges the array of arrays into  a single array, instead of having an array for every single company that reported another one
      // desiredResult = [].concat.apply([], desiredResult);
      res.send(result);

    });

  });

  //Cauta reclamatiile pentru search (in functie de reclamat)
  app.get('*/rest/reclamatii/:nume/:numar', function(req,res){

    
    Reclamatie.find({$or: [ {cuiReclamat: req.params.nume}, {nume: req.params.nume}]}, function(err, result){


      res.send(result);

    }).skip(parseInt(req.params.numar)).limit(10);

  });

  app.get('*/rest/reclamatii/length/:nume', function(req,res){

    
    Reclamatie.find({$or: [ {cuiReclamat: req.params.nume}, {nume: req.params.nume}]}, function(err, result){


      res.send(result.length);

    });

  });


  //Cauta reclamatiile pentru manage (in functie de reclamant)
  app.get('*/rest/reclamant/:nume', function(req,res){

    
    Reclamatie.find({$or: [ {cuiReclamant: req.params.nume}, {nume: req.params.nume}]}, function(err, result){

      // var mapData = result.map(function(a) {
      // return {
      //   reclamatii: a.reclamatii.map(function(b){ return {caenReclamant: b.caenReclamant, amount: b.amount, cui: a.cui, nume: a.nume}}),
      // }
      // }); //pretty much is making an array of all the "reclamatii" arrays, the problem is that we have an array of arrays
      // var desiredResult = mapData.map(function(c){return c.reclamatii}) // var desiredResult = [].concat.apply([], mapData); //this merges the array of arrays into  a single array, instead of having an array for every single company that reported another one
      // desiredResult = [].concat.apply([], desiredResult);
      res.send(result);

    });

  });

  app.get('*/rest/test', function(req,res){


    
    Reclamatie.find({}, function(err, result){



      //var mapData = result.map(function(a) {return a.reclamatii;}); //pretty much is making an array of all the "reclamatii" arrays, the problem is that we have an array of arrays
      //var desiredResult = [].concat.apply([], mapData); //this merges the array of arrays into a single array, instead of having an array for every single company that reported another one
      res.send(result);

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

    var userdata = basic.escapeRegExpJSON(req.body);

    console.log(userdata);

    if(userdata.cui&&userdata.amount){
    
      Company.findOne({ cui: userdata.cui },function(err,data){

      if(err){
        console.log(err);
      }

        if(data==undefined){


            var temp = new Company({cui: userdata.cui, nume: userdata.nume, hasAccount: false});
            temp.save();


            // User.findOne({ cui: escapedCui.toLowerCase() },function(err,data){})
            // .update({ $push : {reclamatii:  {reclamant: req.cookies.username, amount: escapedAmount}}},
            //     function(err, result){    
            //       if(err || !result){
            //         console.log(err);
            //       }
                     
            //       else{
            //         res.send("success");       
            //       }
            // });
        }
 
      });
      Company.findOne({ email: req.cookies.username.toLowerCase() },function(err,result){

                var temp = new Reclamatie({_id: result.cui + basic.removeLetters(userdata.idFactura), cuiReclamat: userdata.cui, idFactura: basic.removeLetters(userdata.idFactura), amount: userdata.amount, amountRange: basic.getAmountRange(userdata.amount), 
                                           fromExcel: false, amountPaid: false, reclamant: result.nume, cuiReclamant: result.cui, caenReclamant: result.caen}); //add date
                temp.save();

      });
    }
    else {
          res.send("Don't leave the fields empty!");
    }
  });



// var da = new Company({cui:"123"});
// da.save();



}