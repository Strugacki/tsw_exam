/*jshint node: true */
/* global $ */
/******************************REFEREE MANAGER***************************/
var refereeManager = function() {
    
    //Setting up socket connection
    var URL_SERVER = "https://10.10.4.184:3000";
    var socket = io.connect(URL_SERVER);

    socket.on("message",function(data){
        console.log(data); 
    });

    
    //hide the search box
    $('#search').hide();
    
    $('div.panel-heading').remove();
    $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-danger text-center">Obecnie żaden koń nie podlega ocenie, proszę czekać!!</p><div class="horsesList"></div>');
    ////////////////////////////////////
    
   var validator = function(result_id){
        $('input[type=range]').each(function(){
            console.log('validator creation');
           $(this).change(function(){
               var marked = true;
               console.log('input changed');
               $('input[type=range]').each(function(){
                   if($(this).val() == 0){
                       marked = false;
                   }
               });
                if(marked){
                    var url = $('form').attr('action');
                    var data = {};
                    var head = parseInt($('div#head').text());
                    var neck = parseInt($('div#neck').text());
                    var kloda = parseInt($('div#kloda').text());
                    var legs = parseInt($('div#legs').text());
                    var move = parseInt($('div#move').text());
                    data.horseId = $('button[type=submit]').attr('id');
                    console.log('data.horseId : ' + data.horseId);
                    var overall = (neck + head + kloda + legs + move) / 5;
                    data.overall = overall;
                    data.result_id = result_id;
                    console.log('RESULT ID: ' + data.result_id);
                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'JSON',
                        data: data
                    }).done(function(data){
                        console.log(data);
                        $('div.panel-heading').remove();
                        $('form').remove();
                        $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-success text-center">'+ data +'</p><div class="horsesList"></div>');
                        horseActivated();
                        socket.emit('refreshLiveScore',data);
                    });    
                }
           }); 
        });
    };
    
    var checkRangeInputs = function(result_id){
        var allMarked = true;
        $('input[type=range]').each(function(){
            if($(this).val() == 0){
                console.log('THIS VAL: ' + $(this).val());
                allMarked = false;
            }
        });
        console.log(allMarked);
        if(allMarked){

            var url = $('form').attr('action');
            var data = {};
            var head = parseInt($('div#head').text());
            var neck = parseInt($('div#neck').text());
            var kloda = parseInt($('div#kloda').text());
            var legs = parseInt($('div#legs').text());
            var move = parseInt($('div#move').text());
            data.horseId = $('button[type=submit]').attr('id');
            var overall = ((neck + head + kloda + legs + move) / 5);
            data.overall = overall;
            data.result_id = result_id;
            console.log('OVERALL: ' + data.overall);
            console.log('RESULT ID: ' + data.result_id);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'JSON',
                data: data
            }).done(function(data){
                console.log(data);
                $('div.panel-heading').remove();
                $('form').remove();
                $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-success text-center">'+ data +'</p><div class="horsesList"></div>');
                horseActivated();
                socket.emit('refreshLiveScore',data);
            });

        }else{
            console.log('creating validator');
            validator();
        }
    };
    
    var horseActivated = function (){
        socket.on('horseActivated',function(data){
        console.log('HORSE ID: ' + data);
        $.ajax({
            url: '/competition/checkHorse/'+data+'',
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data){
            console.log(data);
            var resultId = data.result_id;
            console.log('RESULT ID: ' + resultId);
            var html = new EJS({
                url: 'competition/templates/rateHorseForm.ejs'
            }).render({
                horse: data.horse,
                number: data.horseNumber
            });
            $('div#content-panel').remove();
            $('div.container').append(html);
            $('button[type=submit]').hide();
            $('input[type=range]').each(function(){
                $(this).change(function(){
                    console.log('changed');
                   var attr = $(this).attr('id');
                    var value = $(this).val();
                   $('div[id*='+attr+']').text(value);
                });
            });
            
            sliderChangeHandler(data.result_id);
            end(data.result_id);
            $('form').submit(function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    /*var url = $(this).attr('action');
                    var data = {};
                    var head = parseInt($('div#head').text());
                    var neck = parseInt($('div#neck').text());
                    var kloda = parseInt($('div#kloda').text());
                    var legs = parseInt($('div#legs').text());
                    var move = parseInt($('div#move').text());
                    data.horseId = $('button[type=submit]').attr('id');
                    console.log('data.horseId : ' + data.horseId);
                    var overall = (neck + head + kloda + legs + move) / 5;
                    data.overall = overall;
                    data.result_id = resultId;
                    console.log('RESULT ID: ' + data.result_id);
                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'JSON',
                        data: data
                    }).done(function(data){
                        console.log(data);
                        $('div.panel-heading').remove();
                        $('form').remove();
                        $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-success text-center">'+ data +'</p><div class="horsesList"></div>');
                        horseActivated();
                        socket.emit('refreshLiveScore',data);
                    });*/
                });
        });
        });
    };
    
    var end = function(result_id){
        console.log('RESULTTT: ' + result_id);
        socket.on('horseDeactivated',function(data){
            console.log("HORSE DEACTIVATED ID: " + data._id);
            console.log('RESULTTT: ' + result_id);
            if($('button[id*='+data._id+']').length){
                console.log('jest');
                setTimeout(function(){ $('h1').append('<br><div class="alert alert-warning">Administrator prosi o uzupełnienie formularza ocen!"</div>'); rateHorseFormValidator(result_id); checkRangeInputs(result_id); }, 0);
            }
        });
    };
    
    socket.on('renderForm',function(data){
        $.ajax({
            url: '/competition/authReferees',
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data){
            console.log(data);
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'competition/templates/rateHorseList.ejs'
            }).render({
                horses: data
            });
            $('div.container').append(html);
            horseActivated();
        });
    });
    
    socket.on('removeForm',function(data){
            $('div.panel-heading').remove();
            $('div.panel-body').remove();
            $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-danger text-center">Obecnie żaden koń nie podlega ocenie, proszę czekać!!</p><div class="horsesList"></div>');
    });
    
    
    
    var sliderChangeHandler = function(idResults){
        $('input[type=range]').change(function(){
            var head = parseInt($('div#head').text());
            var neck = parseInt($('div#neck').text());
            var kloda = parseInt($('div#kloda').text());
            var legs = parseInt($('div#legs').text());
            var move = parseInt($('div#move').text());
            var data = {};
            data.legs = legs;
            data.move = move;
            data.head = head;
            data.kloda = kloda;
            data.neck = neck;
            $.ajax({
                url: '/result/update/' + idResults + '',
                method: 'POST',
                dataType: 'JSON',
                data: data
            }).done(function(data){
             console.log(data);
            });
        });
    };
    
    var rateHorseFormValidator = function(result_id){
        $('input[type=range]').each(function(){
            console.log($(this).val());
            if($(this).val() == 0){
                console.log('jest 0');
                $(this).before('<div id="alert" class="alert alert-danger">Proszę wypełnić poniższe pole!"</div>');
            }
            $(this).change(function(e){
                e.stopImmediatePropagation();
                if($(this).val() != 0){
                    $('button[type=submit]').removeAttr('disabled');
                    $(this).prev('div#alert:first').remove();
                    checkRangeInputs(result_id);
                }
            });
        });
    };
    
    //var horseDeactivated = function(){
      /*  socket.on('horseDeactivated',function(data){
        console.log("HORSE DEACTIVATED ID: " + data._id);
        if($('button[id*='+data._id+']').length){
            console.log('jest');
            setTimeout(function(){ $('h1').append('<br><div class="alert alert-warning">Administrator prosi o uzupełnienie formularza ocen!"</div>'); rateHorseFormValidator();             checkRangeInputs(result_id); }, 0);
        }
        });*/
    //}
    //HORSE RATE VIEW
    $('a#competitionRate').on('click',function(e){
        e.preventDefault();
        var url = $(this).attr('href');
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data){
            console.log(data);
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'competition/rate.ejs'
            }).render({
                data: data
            });
            $('div.container').append(html);
            socket.on('horsesToRate',function(data){
                console.log('horses');
                $('p.alert').remove();
                $('div.horse').remove();
               for(var i=0;i<data.length;i++){
                   $('div.horsesList').append('<div class="row text-center horse"><a class="btn btn-primary" href="/horse/get/'+data[i]._id+'">Koń o numerze: '+ i +'</a><br></div>');
               } 
            });
        });
        
    });
    
    
};

/***************************************************************************/
$(function() {
    console.log('document ready');
    refereeManager();
});