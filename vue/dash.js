
window.onload = function () {
  const app = new Vue({

  el: '#vueApp',
  data: {
    personalData: {}
  },
  created: function(){

    $("#vueApp").find('.uk-icon svg:first-child').remove(); //temporary vue+uikit double rendering of svgs in uk-icons workaround

    this.$http.get('/rest/getSelfInfo')
    .then(function(response){

      this.personalData = response.data;
      this.personalData.email = this.personalData.email.replace(/\\/g, "");
      this.personalData.address = this.personalData.address.replace(/\\/g, "");
      // this.separatedNames = this.personalData.personalName.split(" ");
      // this.firstName = this.separatedNames[0];

    }, function(error){

        console.log(error.statusText);

    });

  }
  

  });
}