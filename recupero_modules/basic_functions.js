//***Regular Expressions***


module.exports.addressRegex = function(regexObj){
  if(regexObj.length < 4){//put <4, but I wanna test
    return("Numele adresei prea scurt!");
  }
  else if(regexObj.length > 50){
    return("Numele adresei prea lung!");
  }
  else if(regexObj.search(/[^a-zA-Z0-9 \_\,\.]/) != -1){
    return("In numele adresei puteti folosi litere, cifre si urmatoarele simboluri: '.' , '_' , ','. ");
  }
  return("ok");
}



module.exports.cuiRegex = function(regexObj){
  if(regexObj.length < 6){//put <4, but I wanna test
    return("CUI-ul contine minim 9 cifre");
  }
  else if(regexObj.length > 10){
    return("CUI-ul contine maxim 10 cifre");
  }
  else if(regexObj.search(/[^0-9\_\.]/) != -1){
    return("In CUI puteti folosi doar cifre.");
  }
  return("ok");
}

module.exports.caenRegex = function(regexObj){
  if(regexObj.length < 4){//put <4, but I wanna test
    return("CAEN-ul contine minim 4 cifre");
  }
  else if(regexObj.length > 4){
    return("CAEN-ul contine maxim 4 cifre");
  }
  else if(regexObj.search(/[^0-9\_\.]/) != -1){
    return("In CAEN puteti folosi doar cifre.");
  }
  return("ok");
}


module.exports.companynameRegex = function(regexObj){
  if(regexObj.length < 4){//put <4, but I wanna test
    return("Numele companiei prea scurt!");
  }
  else if(regexObj.length > 50){
    return("Numele companiei prea lung!");
  }
  else if(regexObj.search(/[^a-zA-Z0-9 \_\.]/) != -1){
    return("In numele companiei puteti folosi litere, cifre si urmatoarele simboluri:\"., _\". ");
  }
  return("ok");
}

module.exports.usernameRegex = function(regexObj){
  if(regexObj.length < 4){//put <4, but I wanna test
    return("Nume de utilizator prea scurt!");
  }
  else if(regexObj.length > 22){
    return("Nume de utilizator prea lung!");
  }
  else if(regexObj.search(/[^a-zA-Z0-9\_\.]/) != -1){
    return("In numele de utilizator puteti folosi litere, cifre si urmatoarele simboluri:\"., _\". ");
  }
  return("ok");
}

module.exports.emailRegex = function(regexObj){
  // if(username.length < 4){//put <4, but I wanna test
  //   return("Username is too short!");
  // }
  // else if(username.length > 12){
  //   return("Username is too long!");
  // }
  // else if(username.search(/[^a-zA-Z0-9\_\.]/) != -1){
  //   return("In your username you can only use letters, numbers and the next set of symbols:\"., _\". ");
  // }
  return("ok");
}


module.exports.passwordRegex = function(password){
  if(password.length < 6){//put <6, but I wanna test
    return("Parola este prea scurta!");
  }
  else if(password.length > 50){
    return("Parola este prea lunga!");
  }
  else if(password.search(/[^a-zA-Z0-9\!\@\#\$\*\_\+\.]/) != -1){
    return("In parola puteti folosi litere, numere si urmatoarele simboluri:\"!, @, #, $, *, ., +, _\". ");
  }
  return("ok");
}


module.exports.phoneRegex = function(regexObj){
  if(regexObj.length < 10){//put <6, but I wanna test
    return("Numarul de telefon trebuie sa aiba 10 cifre!");
  }
  else if(regexObj.length > 10){
    return("Numarul de telefon trebuie sa aiba 10 cifre!");
  }
  else if(regexObj.search(/[^0-9]/) != -1){
    return("In numarul de telefon puteti folosi numai cifre.");
  }
  return("ok");
}

module.exports.personalNameRegex = function(regexObj){
  if(regexObj.length < 4){//put <4, but I wanna test
    return("Nume personal prea scurt!");
  }
  else if(regexObj.length > 50){
    return("Nume personal prea lung!");
  }
  else if(regexObj.search(/[^a-zA-Z ]/) != -1){
    return("In numele personal puteti folosi numai litere si spatii.");
  }
  return("ok");
}

module.exports.dateRegex = function(regexObj){
  var parts = regexObj.split("\\.");
  var date = new Date(parts[2], parts[1] - 1, parts[0]);
  var now = new Date();
  if(date){

    if(date > now){//put <6, but I wanna test
      return("Nu puteti folosi o data din viitor!");
    }
    else{
    return("ok");      
    }

  }
  else{
    return("Data invalida. Va rugam folositi formatul ZZ.LL.AAAA (sau DD.MM.YYYY).");
  }
}

module.exports.amountRegex = function(regexObj){
  if(regexObj.length < 1){//put <6, but I wanna test
    return("Suma este prea mica!");
  }
  else if(regexObj.length > 15){
    return("Suma este prea mare!");
  }
  else if(regexObj.search(/[^0-9]/) != -1){
    return("In suma puteti folosi numai cifre.");
  }
  return("ok");
}

module.exports.idFacturaRegex = function(regexObj){
  if(regexObj.length < 1){//put <6, but I wanna test
    return("Id-ul facturii este prea scurt!");
  }
  else if(regexObj.length > 10){
    return("Id-ul facturii este prea lung!");
  }
  else if(regexObj.search(/[^0-9]/) != -1){
    return("In id-ul facturii puteti folosi numai cifre.");
  }
  return("ok");
}
//***Regular Expressions***

module.exports.removeLetters = function(myString){

return myString.replace(/\D/g,'');


}


module.exports.safeReclamatie = function(result){

    if(result){

      var safeResult = result.map(function(a){
        return {  idFactura: a.idFactura, caenReclamant: a.caenReclamant, reclamat: a.reclamat,
                  cuiReclamat: a.cuiReclamat, amountRange: a.amountRange, dateRegistered: a.dateRegistered, fromExcel: a.fromExcel,
                  amountPaid: a.amountPaid }
      });
      return safeResult;
    }
    else
      return [];

}

module.exports.safeCompanie = function(result){

  if(result){
      var safeResult = result.map(function(a){
        return {  cui: a.cui, nume: a.nume, address: a.address,
                  caen: a.caen, hasAccount: a.hasAccount}
      });
      return safeResult;
  }
  else{
    return [];
  }

}

//***Basic Functions***
var escapeRegExp;
(function (){
  // Referring to the table here:
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
  // these characters should be escaped
  // \ ^ $ * + ? . ( ) | { } [ ]
  // These characters only have special meaning inside of brackets
  // they do not need to be escaped, but they MAY be escaped
  // without any adverse effects (to the best of my knowledge and casual testing)
  // : ! , = 
  // my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)

  var specials = [
    // order matters for these
      "-"
    , "["
    , "]"
    // order doesn't matter for any of these
    , "/"
    , "{"
    , "}"
    , "("
    , ")"
    , "*"
    , "+"
    , "?"
    , "."
    , "\\"
    , "^"
    , "$"
    , "|"
    , "="
  ]
  // I choose to escape every character with '\'
  // even though only some strictly require it when inside of []
  , regex = RegExp('[' + specials.join('\\') + ']', 'g')
  ;

  module.exports.escapeRegExp = function (str){

  return str.replace(regex, "\\$&");
  };

module.exports.escapeRegExpJSON = function(JSON){

  for(var i in JSON){

    JSON[i] = JSON[i].replace(regex, "\\$&");

  }

  return JSON;

}



}());




module.exports.getAmountRange = function(amount){

  if(1<amount && amount<=50){
    return "1-50"
  }
  if(51<amount && amount<=100){
    return "51-100"
  }
  if(101<amount && amount<=200){
    return "101-200"
  }
  if(201<amount && amount<=300){
    return "201-300"
  }
  if(301<amount && amount<=500){
    return "301-500"
  }
  if(501<amount && amount<=1000){
    return "501-1000"
  }
  if(1001<amount && amount<=2000){
    return "1001-2000"
  }
  if(2001<amount && amount <=3000){
    return "2001-3000"
  }
  if(3001<amount && amount <=4000){
    return "3001-4000"
  }
  if(4001<amount && amount <=5000){
    return "4001-5000"
  }
  if(5001<amount && amount <=6000){
    return "5001-6000"
  }
  if(6001<amount && amount <=7000){
    return "6001-7000"
  }
  if(7001<amount && amount <=8000){
    return "7001-8000"
  }
  if(8001<amount && amount <=9000){
    return "8001-9000"
  }
  if(9001<amount && amount <=10000){
    return "9001-10000"
  }
  if(10001<amount && amount <=15000){
    return "10001-15000"
  }
  if(15001<amount && amount <=20000){
    return "15001-20000"
  }
  if(20001<amount && amount <=30000){
    return "20001-30000"
  }
  if(30001<amount && amount <=40000){
    return "30001-40000"
  }
  if(40001<amount && amount <=50000){
    return "40001-50000"
  }
  if(50001<amount && amount <=60000){
    return "50001-60000"
  }
  if(60001<amount && amount <=70000){
    return "60001-70000"
  }
  if(70001<amount && amount <=80000){
    return "70001-80000"
  }
  if(80001<amount && amount <=90000){
    return "80001-90000"
  }
  if(90001<amount && amount <=10000){
    return "90001-10000"
  }
  if(100001<amount && amount <=150000){
    return "100001-150000"
  }
  if(150001<amount && amount <=200000){
    return "150001-200000"
  }
  if(200001<amount && amount <=300000){
    return "200001-300000"
  }
  if(300001<amount && amount <=400000){
    return "300001-400000"
  }
  if(400001<amount && amount <=500000){
    return "400001-500000"
  }
  if(500001<amount && amount <=1000000){
    return "500001-1000000"
  }
  if(1000001<amount){
    return "1000001+";
  }

  return "";

}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

Date.prototype.removeDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() - days);
  return dat;
}



module.exports.getDateRange = function(date){

  var amount = date;

  var now = new Date();

  if(now.removeDays(15) <amount && amount<=now){
    return "0-15"
  }
  if(now.removeDays(30) <amount && amount<= now.removeDays(15)){
    return "15-30"
  }
  if(now.removeDays(45)<amount && amount<=now.removeDays(30)){
    return "30-45"
  }
  if(now.removeDays(60)<amount && amount<=now.removeDays(45)){
    return "45-60"
  }
  if(now.removeDays(90)<amount && amount<=now.removeDays(60)){
    return "60-90"
  }
  if(now.removeDays(120)<amount && amount<=now.removeDays(90)){
    return "90-120"
  }
  if(now.removeDays(150)<amount && amount <= now.removeDays(120)){
    return "120-150"
  }
  if(now.removeDays(190)<amount && amount <=now.removeDays(150)){
    return "150-190"
  }
  if(now.removeDays(220)<amount && amount <= now.removeDays(190)){
    return "190-220"
  }
  if(now.removeDays(250)<amount && amount <= now.removeDays(220)){
    return "220-250"
  }
  if(now.removeDays(280)<amount && amount <= now.removeDays(250)){
    return "250-280"
  }
  if(now.removeDays(310)<amount && amount <= now.removeDays(280)){
    return "280-310"
  }
  if(now.removeDays(340)<amount && amount <= now.removeDays(310)){
    return "310-340"
  }
  if(now.removeDays(365)<amount && amount <= now.removeDays(340)){
    return "340-365"
  }
  if(now.removeDays(730)<amount && amount <= now.removeDays(365)){
    return "365-730"
  }
  if(now.removeDays(1.095)<amount && amount <= now.removeDays(730)){
    return "730-1.095"
  }
  if(amount <now.removeDays(1.095)){
    return "1.095+"
  }
 

  return "";

}










//***Basic Functions***

