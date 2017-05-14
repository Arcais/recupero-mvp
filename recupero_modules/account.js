var bcrypt = require('bcryptjs');
var basic = require("./basic_functions");
var uuid = require('node-uuid');

module.exports = function(app, auth, mongoose){

  var User = mongoose.model('Companie');

  //***Account Creation***
  app.post('/creating', function (req, res){

    var userdata = req.body;
    if(userdata.cui&&userdata.password&&userdata.passwordVerif){
      if(userdata.password == userdata.passwordVerif){
        passwordVerifyString = basic.passwordRegex(userdata.password);
        cuiVerifyString = basic.usernameRegex(userdata.cui);
        emailVerifyString = basic.emailRegex(userdata.email);
        nameVerifyString = basic.emailRegex(userdata.name);
        addressVerifyString = basic.emailRegex(userdata.address);
        caenVerifyString = basic.emailRegex(userdata.caen);

        if(cuiVerifyString != "ok"){
          res.send(cuiVerifyString);
        }
        else if(passwordVerifyString != "ok"){
                res.send(passwordVerifyString);
        }
        else if(nameVerifyString != "ok"){
                res.send(nameVerifyString);
        }
        else if(addressVerifyString != "ok"){
                res.send(addressVerifyString);
        }
        else if(emailVerifyString != "ok"){
                res.send(emailVerifyString);
        }
        else if(caenVerifyString != "ok"){
                res.send(caenVerifyString);
        }
        else {
          userdata.password = userdata.password.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
          var salt = bcrypt.genSaltSync(10);
          var hashedPassword = bcrypt.hashSync(userdata.password, salt);
          var escapedCui = basic.escapeRegExp(userdata.cui);
          var escapedEmail = basic.escapeRegExp(userdata.email);
          var escapedName = basic.escapeRegExp(userdata.name);
          var escapedAddress = basic.escapeRegExp(userdata.address);
          var escapedCaen = basic.escapeRegExp(userdata.caen);

          User.find({cui: escapedCui.toLowerCase() },function(err,data){
            if(err){
              console.log(err);
            }
            if(data.length!=0){
              User.findOne({$and: [{cui: escapedCui.toLowerCase()},{ hasAccount:false }] },function(err,result){
                if(!err && result){
                  result.cui = escapedCui;
                  result.name = escapedName;
                  result.email = escapedEmail;
                  result.address = escapedAddress;
                  result.password = hashedPassword;
                  result.caen = escapedCaen;
                  result.isConfirmed = true;
                  result.hasAccount = true;

                  var today = new Date();
                  var exp = new Date(today);
                  exp.setDate(today.getDate() + 60);

                  var token = auth.generateToken({
                    ip: req.connection.remoteAddress,
                    username:  escapedEmail,
                    exp: parseInt(exp.getTime() / 1000),
                  });

                  res.cookie('sesid', token);


                  result.sesstoken = token;
                  result.save();
                  res.send("Account created!");

                }
              });
            }
            else {
              
              //Generate Token 
                      
              var today = new Date();
              var exp = new Date(today);
              exp.setDate(today.getDate() + 60);

              var token = auth.generateToken({
                ip: req.connection.remoteAddress,
                username:  escapedEmail,
                exp: parseInt(exp.getTime() / 1000),
              });


              res.cookie('sesid', token);

              //End generate token



              var userInsertObject = new User({ cui: escapedCui.toLowerCase() , name: escapedName, email: escapedEmail.toLowerCase(), address: escapedAddress, password: hashedPassword, sesstoken: token, caen: escapedCaen, isConfirmed: true, hasAccount: true});
              userInsertObject.save();
              res.send("Account created!");

        
            }
          });
        }
      }
      else {
        res.send("Passwords don't match.");
      }
    }
    else{
      res.send("Don't leave the fields empty!");
    }
  });
  //***Account Creation***



  //***Account Sessions***
  app.post('/loggingIn', function (req, res){

    var userdata=req.body;


    if(userdata.password&&userdata.email){

      var escapedEmail= basic.escapeRegExp(userdata.email);
    
      User.findOne({ email: escapedEmail.toLowerCase() },function(err,data){

      if(err){
        console.log(err);
      }

        if(data==undefined){
            res.send("Account doesn't exist!")
        }
        else {
          bcrypt.compare(userdata.password,data.password, function(err, pwdcheck){
            if(err){
                console.log(err);
            }
            if(pwdcheck){
              
              //Generate Token 
              var today = new Date();
              var exp = new Date(today);
              exp.setDate(today.getDate() + 60);
              var token = auth.generateToken({
                ip: req.connection.remoteAddress,
                username:  userdata.email,
                exp: parseInt(exp.getTime() / 1000),
              });
              res.cookie('sesid', token);
              data.sesstoken=token;
              data.save();
              //End generate token

              res.send("Logged in.");//To be replaced with actual logging in
            }
            else {
              res.send("Username and password do not match.");
            }
          });
        }
      });
    }
    else {
          res.send("Don't leave the fields empty!");
    }
  });
  //***Account Sessions***

app.post('/report', function (req, res){

    var userdata=req.body;


    if(userdata.cui&&userdata.amount){

      var escapedCui =  basic.escapeRegExp(userdata.cui);
      var escapedAmount =  basic.escapeRegExp(userdata.amount);
    
      User.findOne({ cui: escapedCui.toLowerCase() },function(err,data){

      if(err){
        console.log(err);
      }

        if(data==undefined){
            var da = new User({cui:escapedCui, hasAccount: false, amountRange: basic.getAmountRange(escapedAmount), reclamatii:  [{reclamant: req.cookies.username, amount: escapedAmount}]});
            da.save();
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
      User.findOne({ cui: escapedCui.toLowerCase() },function(err,data){

        if(err){
          console.log(err);
        }

 
      }).update({ $push : {reclamatii:  {reclamant: req.cookies.username, amount: escapedAmount, amountRange: basic.getAmountRange(escapedAmount)}}},
          function(err, result){    
            if(err)
              res.send(err);  
            else{
              res.send("success");       
            }
      });
    }
    else {
          res.send("Don't leave the fields empty!");
    }
  });




};

