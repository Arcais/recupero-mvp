(function ($) {

    var bar = $("#progressbar")[0];

    UIkit.upload('.excel-upload', {
        url: '',
        multiple: true,
        beforeSend: function() { console.log('beforeSend', arguments); },
        beforeAll: function() { console.log('beforeAll', arguments); },
        load: function() { console.log('load', arguments); },
        error: function() { console.log('error', arguments); },
        complete: function() { console.log('complete', arguments); },
        loadStart: function (e) {
            console.log('loadStart', arguments);
            bar.removeAttribute('hidden');
            bar.max =  e.total;
            bar.value =  e.loaded;
        },
        progress: function (e) {
            console.log('progress', arguments);
            bar.max =  e.total;
            bar.value =  e.loaded;
        },
        loadEnd: function (e) {
            console.log('loadEnd', arguments);
            bar.max =  e.total;
            bar.value =  e.loaded;
        },
        completeAll: function () {
            console.log('completeAll', arguments);
            setTimeout(function () {
                bar.setAttribute('hidden', 'hidden');
            }, 1000);
            $("#statusAuto").html("Upload-ul a fost trimis catre server.<br>Dece excel-ul a fost acceptat, platforma se va actualiza in maxim cateva minute.");
        }
    });
    
})(jQuery);

$("#searchCompany").on('click', function(){

    var searchCompanyTag = $("#searchInput").val();

    if(searchCompanyTag&&searchCompanyTag!=''&&searchCompanyTag!=""){
        window.location.href="/search/"+searchCompanyTag;
    }

});
