var mongoose = require('mongoose');

//**Reclamatii**
var reclamatieSchema = new mongoose.Schema({

  idFactura:String,    //Id-ul facturii (luat din excel)

  reclamant:String,    //compania
  cuiReclamant:String  //tot al companiei care reclama
  caenReclamant:Number,   //tot al companiei care reclama

  reclamat:String      //Compania reclamata
  cuiReclamat:String   //tot al companiei care reclama

  amount:Number,          //cat ii ie dator bajatu lu companie
  amountRange:String,  //media datoriei ca sa fim #privacy
  dateRegistered:Date, //cand a fost inregistrata reclamatia

  fromExcel:Number,      //*daca compania l-a inregistrat "batch" prin excel
  amountPaid:Number      //*este 1 daca a fost platita datoria si nu mai afisam amount, amountRange si dateRegistered

},{collection:"companie"});

mongoose.model('Companie', companySchema);
//**Reclamatii**