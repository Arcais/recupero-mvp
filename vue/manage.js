
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

        this.$http.get('/rest/numarReclamant/'+this.personalData.cui)
        .then(function(response){

        this.companiesTotalNumber = response.data[0];
        this.companiesFinalPage = parseInt(this.companiesTotalNumber/8)+1;

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

  },
  methods: {
    getManageFunctions: function(){

      this.$http.get('/rest/reclamant/'+this.personalData.cui+'/'+this.currentPage)
      .then(function(response){

        this.companiesLoaded = response.data;

        if(response.data.length){

          this.$http.get('/rest/numarReclamant/'+this.personalData.cui)
          .then(function(response){

          this.companiesTotalNumber = response.data[0];
          this.companiesFinalPage = parseInt(this.companiesTotalNumber/8)+1;

          }, function(error){

              console.log(error.statusText);

          });

        }

      }, function(error){

          console.log(error.statusText);

      });

    },
    deleteReclamatie: function(cuiReclamatie){
      this.$http.post('/rest/deleteReclamatie/'+cuiReclamatie)
      .then(function(response){

        getManageFunctions();

      }, function(error){

        console.log(error.statusText);

      });
    },
    paidReclamatie: function(cuiReclamatie){
      this.$http.post('/rest/reclamatiePaid/'+cuiReclamatie)
      .then(function(response){

        getManageFunctions();

      }, function(error){

        console.log(error.statusText);

      });
    }
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