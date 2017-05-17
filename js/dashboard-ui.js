// (function ($) {    
//     var bar = $("#progressbar")[0];
//     UIkit.upload('.excel-upload', {
//         url: '/upload/excel/',
//         multiple: false,
//         allow: '*.(xlsx|xls)',
//         method: 'POST',
//         headers: [
//             'Content-Type: multipart/form-data'
//         ],
//         beforeSend: function() { console.log('beforeSend', arguments); },
//         beforeAll: function() { console.log('beforeAll', arguments); },
//         load: function() { console.log('load', arguments); },
//         error: function() { console.log('error', arguments); },
//         complete: function() { console.log('complete', arguments); },
//         loadStart: function (e) {
//             console.log('loadStart', arguments);
//             bar.removeAttribute('hidden');
//             bar.max =  e.total;
//             bar.value =  e.loaded;
//         },
//         progress: function (e) {
//             console.log('progress', arguments);
//             bar.max =  e.total;
//             bar.value =  e.loaded;
//         },
//         loadEnd: function (e) {
//             console.log('loadEnd', arguments);
//             bar.max =  e.total;
//             bar.value =  e.loaded;
//         },
//         completeAll: function () {
//             console.log('completeAll', arguments);
//             setTimeout(function () {
//                 bar.setAttribute('hidden', 'hidden');
//             }, 1000);
//             $("#statusAuto").html("Upload-ul a fost trimis catre server.<br>Dece excel-ul a fost acceptat, platforma se va actualiza in maxim cateva minute.");
//             // $("#uploadExcelForm").submit();
//             // var form = $("#uploadExcelForm")[0];
//             console.log($("#file")[0]);
//             console.log($("#file")[0].files);
//             console.log($("#file2")[0].files);
//             // console.log(new FormData($("#test2")));
//             // var myForm = document.getElementById('#test2');
//             // var formData = new FormData(myForm);
//             // console.log(formData);
//             // console.log(form);
//             // var data = new FormData(form);
//             // console.log(data);
//             // // $("#uploadExcelForm").submit();
//             // $.ajax({
//             //     type: "POST",
//             //     enctype: 'multipart/form-data',
//             //     url: "/upload/excel/",
//             //     data: $("#file2")[0].files,
//             //     processData: false,
//             //     contentType: false,
//             //     cache: false,
//             //     timeout: 600000,
//             //     success: function (data) {
//             //         console.log("SUCCESS : ", data);
//             //     },
//             //     error: function (e) {
//             //         console.log("ERROR : ", e);
//             //     }
//             // });
//         }
//     });
// })(jQuery);

(function ($) {

    $("#spinnerLoader").addClass("finishedLoading");

})(jQuery);

$("#test2btn").on('click',function(){

    var file = $("#file2")[0].files[0];

    var fd2 = new FormData();

    fd2.append('file', file);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/upload/excel/",
        data: fd2,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
            $("#file2").val('');
            $("#statusAuto").html('Fisierul a fost trimis catre server.<br>Daca excel-ul a fost acceptat, platforma se va actualiza in maxim cateva minute.');
        },
        error: function (e) {
            console.log("ERROR : ", e);
            $("#statusAuto").html('Fisierul nu a putut sa fie trimis catre server. Prezentati-ne eroarea de mai jos daca eroarea persista: <pre><code>'+e+'</pre></code>');
        
        }
    });

});

$("#searchCompany").on('click', function(){

    var searchCompanyTag = $("#searchInput").val();
    searchCompanyTag = searchCompanyTag.replace(/ /g,'-');

    if(searchCompanyTag&&searchCompanyTag!=''&&searchCompanyTag!=""){
        window.location.href="/search/"+searchCompanyTag;
    }

});

$("#send_reclamatie").on('click', function(){

    if($("#verifNo").is(':checked')||$("#verifDaPlus").is(':checked')){

        var preparedJSON = {

            cui: $("#cuiReclamat").val(),
            nume: $("#numeReclamat").val(),
            idFactura: $("#idFactura").val(),
            amount: $("#valoare").val(),
            date: $("#data").val(),
        }
          //***login account***
        $.post( "/report", preparedJSON, function( res ) {

            $("#statusManual").html(res);
            if(res=="Reclamatia a fost inregistrata!"){

                $("#cuiReclamat").val('');
                $("#numeReclamat").val('');
                $("#idFactura").val('');
                $("#valoare").val('');
                $("#data").val('');

            }

        });
    }
    else if($("#verifDa").is(':checked')){

        $("#statusManual").html('Nu puteti inregistra o reclamatie care a fost contestata in instanta.');

    }
    else{

        $("#statusManual").html('Va rugam spuneti-ne daca debitorul contesta factura.');

    }

});