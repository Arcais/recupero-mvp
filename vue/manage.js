
window.onload = function () {
  const app = new Vue({

  el: '#vueApp',
  data: {
    personalData: {},
    companiesLoaded: [],
    companiesTotalNumber: 0,
    companiesFinalPage: 1,
    currentSearch: '',
    currentPage: 1
  },
  created: function(){

    $("#vueApp").find('.uk-icon svg:first-child').remove(); //temporary vue+uikit double rendering of svgs in uk-icons workaround

    this.$http.get('/rest/getSelfInfo')
    .then(function(response){

      this.personalData = response.data;

      var searchLocation = window.location.pathname.slice(8);
      searchLocationArr = searchLocation.split('/');
      this.currentPage = parseInt(searchLocationArr[0]);

      this.$http.get('/rest/reclamant/'+this.personalData.cui+'/'+this.currentPage)
      .then(function(response){

      this.companiesLoaded = response.data;

      if(response.data.length){

        this.$http.get('/rest/numarReclamant/'+searchLocationArr[0])
        .then(function(response){

        this.companiesTotalNumber = response.data[0];
        this.companiesFinalPage = parseInt(this.companiesTotalNumber/10)+1;

        }, function(error){

            console.log(error.statusText);

        });

      }

      }, function(error){

          console.log(error.statusText);

      });

    }, function(error){

        console.log(error.statusText);

    });

  }
  

  });
}


// testt: function(){
//   Vue.http.get('/rest/reclamatii/'+searchLocation).then(function(response){
//       console.log(response.data);
//   }, function(error){
//       console.log(error.statusText);
//   });
// }