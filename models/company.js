var mongoose = require('mongoose');

//**Users**
var companySchema = new mongoose.Schema({
  _id: Number,
  cui: {type: Number, required: true},
  nume: String,
  address: String,
  hasAccount: Boolean, //Daca asta ie 1 inseamna ca are parola si e-mail ptca s-a inregistrat
  isConfirmed: Boolean,
  caen: String,
  phone: String,
  personalName: String,
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