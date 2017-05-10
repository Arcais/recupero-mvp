$("#sign_up_first_step").on('click', function(){
      $("#registerForm").addClass("nextStep");
});
$("#sign_up_go_back").on('click', function(){
      $("#registerForm").removeClass("nextStep");
});

$("#sign_up").on('click', function(){
        var preparedJSON = {
          name :          $("#name").val() ,
          password :      $("#pass1").val() ,
          email :         $("#email").val() ,
          cui :           $("#cui").val() ,
          address :       $("#address").val() ,
          passwordVerif : $("#pass2").val(),
          caen : $("#caen").val()
        }
        //***register account***
        $.post( "/creating", preparedJSON, function( res ) {

              $("#status").html(res);
                  if(res=="Account created!"){
                      setTimeout(function(){
                      window.location.href = ("/");
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
