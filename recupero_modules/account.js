var bcrypt = require('bcryptjs');
var basic = require("./basic_functions");
var uuid = require('node-uuid');

module.exports = function(app, auth, mongoose){

  var User = mongoose.model('Companie');

  //***Account Creation***
  app.post('/creating', auth.isNotAuth, function (req, res){

    var userdata = req.body;
    if(userdata.cui&&userdata.password&&userdata.passwordVerif&&userdata.email&&userdata.name&&userdata.personalName&&userdata.address&&userdata.caen){
      if(userdata.password == userdata.passwordVerif){
        passwordVerifyString = basic.passwordRegex(userdata.password);
        cuiVerifyString = basic.usernameRegex(userdata.cui);
        emailVerifyString = basic.emailRegex(userdata.email);

        nameVerifyString = basic.companynameRegex(userdata.name);
        personalNameVerifyString = basic.personalNameRegex(userdata.personalName);
        phoneVerifyString = basic.phoneRegex(userdata.number);
        addressVerifyString = basic.addressRegex(userdata.address);
        caenVerifyString = basic.caenRegex(userdata.caen);


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
        else if(personalNameVerifyString != "ok"){
                res.send(personalNameVerifyString);
        }
        else if(phoneVerifyString != "ok"){
                res.send(phoneVerifyString);
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
          var escapedPersonalName = basic.escapeRegExp(userdata.personalName);
          var escapedPhone = basic.escapeRegExp(userdata.number);

          User.find({$or: [{cui: escapedCui.toLowerCase()},{ email: escapedEmail }] },function(err,data){
            if(err){
              res.send('Email sau CUI deja folost');
            }
            else if(data.length!=0){
              User.findOne({$and: [{cui: escapedCui.toLowerCase()},{ hasAccount:false }] },function(err,result){
                if(!err && result){
                  result.cui = escapedCui;
                  result.name = escapedName;
                  result.email = escapedEmail;
                  result.address = escapedAddress;
                  result.password = hashedPassword;
                  result.caen = escapedCaen;
                  result.personalName = escapedPersonalName;
                  result.phone = escapedPhone;
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




              var userInsertObject = new User({_id: escapedCui.toLowerCase(), cui: escapedCui.toLowerCase() , nume: escapedName, email: escapedEmail.toLowerCase(), address: escapedAddress, password: hashedPassword, sesstoken: token, caen: escapedCaen, isConfirmed: true, hasAccount: true, personalName: escapedPersonalName, phone: escapedPhone});

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
  app.post('/loggingIn', auth.isNotAuth, function (req, res){

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


  app.post('/changePassword', function (req, res){

    var userdata = req.body;
    var cookie_data = req.cookies; 
    
    if(userdata.verify1 != userdata.verify2 && userdata.new1 != userdata.new2){
      res.send("passwords don't match");
      return;
    }
    else if(userdata.new1 && cookie_data.username){ //Fix this security issue

      var escapedUsername = basic.escapeRegExp(cookie_data.username);

      User.findOne({ email: cookie_data.username.toLowerCase(), sesstoken: req.cookies.sesid },function(err,data){
        if(err){
          console.log(err);
        }
        else {
          bcrypt.compare(userdata.verify1, data.password, function(err, pwdcheck){
            //console.log('pwdcheck' + pwdcheck);
            if(pwdcheck){

              userdata.new1 = userdata.new1.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
              var salt = bcrypt.genSaltSync(10);
              var hashedPassword = bcrypt.hashSync(userdata.new1, salt);
              data.password = hashedPassword;
              res.send("success");
              data.save();

            }
          });
        }
      });
    }
    else{
      res.send("Not Same Account");
    }
  });



};

