$("#sign_up_first_step").on('click', function(){
      $("#registerForm").addClass("nextStep");
});
$("#sign_up_go_back").on('click', function(){
      $("#registerForm").removeClass("nextStep");
});

$("#sign_up").on('click', function(){
        var preparedJSON = {
          personalName :  $("#name").val() ,
          name :          $("#denumcomp").val() ,
          password :      $("#pass1").val() ,
          email :         $("#email").val() ,
          cui :           $("#cui").val() ,
          address :       $("#address").val() ,
          passwordVerif : $("#pass2").val(),
          number :        $("#number").val(),
          caen :          $("#caen").val(),
          confToken:      $("#token").val()
        }
        console.log(preparedJSON.name);
        //***register account***
        $.post( "/creating", preparedJSON, function( res ) {

              $(".status").html(res);
                  if(res=="Account created!"){
                      setTimeout(function(){
                      window.location.href = ("/login");
                            //$window.url('/');
                       }, 500);
                  }   
        });
});


$("#login").on('click', function(){

var preparedJSON = {
        email : $("#email").val() ,
        password : $("#pass").val() ,
      }
      //***login account***
      $.post( "/loggingIn", preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Logged in."){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });  
});

$("#reset_password").on('click', function(){
      var preparedJSON = {
        password: $("#pass1").val(),
        passwordVerif : $("#pass2").val()
      }
      //***login account***
      $.post( window.location.href , preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Password changed"){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });
});


$("#reset").on('click', function(){
      var preparedJSON = {
        email : $("#email").val()
      }
      //***login account***
      $.post( "/graph/recoverPassword", preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Email sent."){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });
});


$("#report").on('click', function(){

var preparedJSON = {
        cui : $("#cui").val() ,
        amount : $("#amount").val() ,
        dateRegistered : $("#dateRegistered").val() ,
        idFactura : $("#idFactura").val() 
      }
      //***login account***
      $.post( "/report", preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Logged in."){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });  
});


$(function(){
     $('.form').find('input').on('keyup', function(e){
       if(e.keyCode === 13) {
          $( ".send" ).trigger( "click" );
        };
     });
});


//**cookie related stuff ahead**
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}



var cookieRegistry = [];

function listenCookieChange(cookieName, callback) {
    setInterval(function() {
        if (cookieRegistry[cookieName]) {
            if (readCookie(cookieName) != cookieRegistry[cookieName]) { 
                // update registry so we dont get triggered again
                cookieRegistry[cookieName] = readCookie(cookieName); 
                return callback();
            } 
        } else {
            cookieRegistry[cookieName] = readCookie(cookieName);
        }
    }, 100);
}


var cookielist = ['username', 'sesid'];

var logOut = function(){
    for(var i in cookielist){
    eraseCookie(cookielist[i]);
    }
    window.location.href="";
}


cookielist.forEach(function(element){

  listenCookieChange(element, function() {

    logOut();
  });

});