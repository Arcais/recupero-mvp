
var mongoose = require('mongoose');

//**Users**
var companySchema = new mongoose.Schema({
 cui:String,
 nume:String,
 //...     //Datele companiei (loate de pe openapi)
 hasAccount: Boolean, //Daca asta ie 1 inseamna ca are parola si e-mail ptca s-a inregistrat
 password:String,
 email:String,
 reclamatii: [
  {
   reclamant:String,  //compania
   caenReclamant:Int,  //tot al companiei care reclama
   amount:Int,   //cat ii ie dator bajatu lu companie
   // amountRange:String, //media datoriei ca sa fim #privacy
   dateRegistered:Date,//cand a fost inregistrata reclamatia
   // fromExcel:Bool,  //*daca compania l-a inregistrat "batch" prin excel
   // amountPaid:Bool  //*este 1 daca a fost platita datoria si nu mai afisam amount, amountRange si dateRegistered
  }
 ]

},{collection:"company"});

mongoose.model('Company', companySchema);
//**Users**