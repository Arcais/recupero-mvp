var bcrypt = require('bcryptjs');
var basic = require("./basic_functions");
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');

module.exports = function(app, auth, mongoose){

  var User = mongoose.model('Company');

  //***Account Creation***
  app.post('/creating', function (req, res){

    var userdata = req.body;
    if(userdata.username&&userdata.password&&userdata.passwordVerif){
      if(userdata.password == userdata.passwordVerif){
        passwordVerifyString = basic.passwordRegex(userdata.password);
        usernameVerifyString = basic.usernameRegex(userdata.username);
        emailVerifyString = basic.emailRegex(userdata.email);

        if(usernameVerifyString != "ok"){
          res.send(usernameVerifyString);
        }
        else if(passwordVerifyString != "ok"){
                res.send(passwordVerifyString);
        }
        else if(emailVerifyString != "ok"){
                res.send(emailVerifyString);
        }
        else {
          userdata.password = userdata.password.trim().replace(/\\(.)/mg); //Impossible to have "\" but better safe than sorry.
          var salt = bcrypt.genSaltSync(10);
          var hashedPassword = bcrypt.hashSync(userdata.password, salt);
          var escapedUsername = basic.escapeRegExp(userdata.username);
          var escapedEmail = basic.escapeRegExp(userdata.email);

          User.find({ username: escapedUsername.toLowerCase() },function(err,data){
            if(err){
              console.log(err);
            }
            if(data.length!=0){
              res.send("Username already exists!");
            }
            else {
              
              //Generate Token 
                      
              var today = new Date();
              var exp = new Date(today);
              exp.setDate(today.getDate() + 60);

              var token = auth.generateToken({
                ip: req.connection.remoteAddress,
                username:  userdata.username,
                exp: parseInt(exp.getTime() / 1000),
              });

              var user_account_activation_hash = uuid.v4();

              res.cookie('sesid', token);

              //End generate token

              // create reusable transporter object using the default SMTP transport
              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user: 'saserb@gmail.com',
                      pass: 'Steve1997'
                  }
              });

              // setup email data with unicode symbols
              var mailOptions = {
                  from: '"Recupero Team"', // sender address
                  to: userdata.email, // list of receivers
                  subject: 'Account Activation', // Subject line
                  text: 'Click here to activate account', // plain text body
                  html: '' // html body
              };

              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  else{
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    var userInsertObject = new User({ username: escapedUsername.toLowerCase() , screenname: escapedUsername, email: escapedEmail.toLowerCase(), account_activation_hash: user_account_activation_hash, password: hashedPassword, sesstoken: token });
                    userInsertObject.save();
                    res.send("Account created!");
                  }
              });

              
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
    
      User.findOne({ email: userdata.email.toLowerCase() },function(err,data){

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






};

