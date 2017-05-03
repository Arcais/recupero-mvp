
module.exports = function(app, auth, mongoose){


  var Company = mongoose.model('Company');


  app.get('*/rest/company/:name', function(req,res){
    
    Company.findOne({$or: [ {cui: req.params.nume}, {email: req.params.nume}]}, function(err, result){


      var JSONresponse = {

        cui:        result.cui,
        email:      result.email,
        nume:       result.nume,
        reclamatii: result.reclamatii

      }

      res.send(JSONresponse);


    });

  });


//this returns all the reclamations that were registered by ALL companies

  app.get('*/rest/reclamatii', function(req,res){


    
    Company.find({}, function(err, result){



      var mapData = result.map(function(a) {
      return {
        reclamatii: a.reclamatii.map(function(b){ return {caenReclamant: b.caenReclamant, amount: b.amount, cui: a.cui, nume: a.nume}}),
      }
      }); //pretty much is making an array of all the "reclamatii" arrays, the problem is that we have an array of arrays
      var desiredResult = mapData.map(function(c){return c.reclamatii}) // var desiredResult = [].concat.apply([], mapData); //this merges the array of arrays into  a single array, instead of having an array for every single company that reported another one
      desiredResult = [].concat.apply([], desiredResult);
      res.send(desiredResult);

    });

  });



  app.get('*/rest/reclamatii/:nume', function(req,res){

    
    Company.find({$or: [ {cui: req.params.nume}, {nume: req.params.nume}]}, function(err, result){



      var mapData = result.map(function(a) {
      return {
        reclamatii: a.reclamatii.map(function(b){ return {caenReclamant: b.caenReclamant, amount: b.amount, cui: a.cui, nume: a.nume}}),
      }
      }); //pretty much is making an array of all the "reclamatii" arrays, the problem is that we have an array of arrays
      var desiredResult = mapData.map(function(c){return c.reclamatii}) // var desiredResult = [].concat.apply([], mapData); //this merges the array of arrays into  a single array, instead of having an array for every single company that reported another one
      desiredResult = [].concat.apply([], desiredResult);
      res.send(desiredResult);

    });

  });


  app.get('*/rest/test', function(req,res){


    
    Company.find({}, function(err, result){



      var mapData = result.map(function(a) {return a.reclamatii;}); //pretty much is making an array of all the "reclamatii" arrays, the problem is that we have an array of arrays
      var desiredResult = [].concat.apply([], mapData); //this merges the array of arrays into a single array, instead of having an array for every single company that reported another one
      res.send(desiredResult);

    });

  });



  //SEE IF YOU CAN MAKE IT IN SUCH A WAY THAT YOU CAN SEE WHO DID THE REPORTING

// var da = new Company({cui:"123"});
// da.save();



}