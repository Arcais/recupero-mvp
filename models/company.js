var mongoose = require('mongoose');

//**Users**
var companySchema = new mongoose.Schema({
  cui: String,
  nume: String,
  address: String,
  hasAccount: Boolean, //Daca asta ie 1 inseamna ca are parola si e-mail ptca s-a inregistrat
  isConfirmed: Boolean,
  caen: String,
  password:String,
  subscribedTo: [String],
  sesstoken: {
     type: String,
     default: ""
  },
  email:String

},{collection:"companie"});

mongoose.model('Companie', companySchema);
//**Users**