$("#spinnerLoader").addClass("finishedLoading");
window.onload = function () {
  const app = new Vue({

  el: '#vueApp',
  data: {
    companiesLoaded: [],
    companiesTotalNumber: 0,
    companiesFinalPage: 1,
    currentSearch: '',
    currentPage: 1
  },
  created: function(){

    $("#vueApp").find('.uk-icon svg:first-child').remove(); //temporary vue+uikit double rendering of svgs in uk-icons workaround

    var searchLocation = window.location.pathname.slice(8);
    searchLocationArr = searchLocation.split('/');
    this.currentSearchLink = searchLocationArr[0];
    this.currentSearch = this.currentSearchLink.replace(/-/g,' ');
    this.currentPage = parseInt(searchLocationArr[1]);

    // //Fallback in case the fuccboi tries to access a larger page
    // if(this.currentPage>this.companiesFinalPage){
    //   window.location.href="/search/"+this.currentSearch+"/"+this.companiesFinalPage;
    // }

    $("#searchInput").val(this.currentSearch);

    this.$http.get('/rest/reclamatii/'+this.currentSearch+'/'+this.currentPage)
    .then(function(response){

    this.companiesLoaded = response.data;

    if(response.data.length){

      this.$http.get('/rest/numarReclamatii/'+searchLocationArr[0])
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