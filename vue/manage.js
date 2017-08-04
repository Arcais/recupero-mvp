
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
  
    moment.locale('ro');

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
        console.log(this.companiesLoaded);
        this.companiesLoaded = response.data;
        console.log(this.companiesLoaded);

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
    deleteReclamatie: function(idFactura){
      this.$http.get('/rest/deleteReclamatie/'+idFactura)
       .then(function(response){

        this.getManageFunctions();

      }, function(error){

        console.log(error.statusText);

      });
    },
    // deleteReclamatiePrompt: function(idFactura){
    //   UIkit.modal.confirm('Sunteti sigur ca doriti sa stergeti aceasta reclamatie COMPLET de pe platforma?').then(function() {

    //     this.deleteReclamatie(idFactura);

    //   }, function () {
    //       console.log('Achievement Unlocked: \"M-am razgandit.\"');
    //   });
    // },
    paidReclamatie: function(idFactura){
      this.$http.get('/rest/reclamatiePaid/'+idFactura)
      .then(function(response){

        this.getManageFunctions();

      }, function(error){

        console.log(error.statusText);

      });
    }
  },
  filters: {
    dateOnly: function (date) {
      return moment(date).format('Do MMMM YYYY');
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