/******************************REFEREE MANAGEMENT***************************/
//GET ALL REFEREES

var refereeManager = function() {
    
    var URL_SERVER = "https://localhost:3000";
    var socket = io.connect(URL_SERVER);

    socket.on("message",function(data){
        console.log(data); 
    });

    $.event.special.destroyed = {
        remove: function(o) {
            if (o.handler) {
                o.handler()
            }
        }
    }
    
    $('div.panel-heading').remove();
    $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-danger text-center">Obecnie żaden koń nie podlega ocenie, proszę czekać!!</p><div class="horsesList"></div>');
    
    
    socket.on('renderForm',function(data){
        $.ajax({
            url: '/competition/rate',
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
            horseDeactivated();
        });
    });
    
    socket.on('removeForm',function(data){
            $('div.panel-heading').remove();
            $('div.panel-body').remove();
            $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-danger text-center">Obecnie żaden koń nie podlega ocenie, proszę czekać!!</p><div class="horsesList"></div>');
    });
    
    
    var horseActivated = function (){
        socket.on('horseActivated',function(data){
        console.log(data._id);
        if($('button[id*='+data._id+']')){
            $('button[id*='+data._id+']').removeAttr('disabled').removeClass('btn-danger').addClass('btn-success');
            $('button[id*='+data._id+']').on('click',function(e){
                e.preventDefault();
                e.stopImmediatePropagation();
                var html = new EJS({
                    url: 'competition/templates/rateHorseForm.ejs'
                }).render({
                    horse: data
                });
                $('div#content-panel').remove();
                $('div.container').append(html);
                $('input[type=range]').each(function(){
                    $(this).change(function(){
                       var attr = $(this).attr('id');
                        var value = $(this).val();
                       $('div[id*='+attr+']').text(value);
                    });
                });
                $('form').submit(function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var url = $(this).attr('action');
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
                    //socket.emit('ratedHorseData',data);
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
                });
            })
        }
        });
    }
    //var horseDeactivated = function(){
        socket.on('horseDeactivated',function(data){
        console.log("HORSE DEACTIVATED ID: " + data._id);
        if($('button[id*='+data._id+']').length){
            console.log('jest');
            setTimeout(function(){ alert("Pozostała Ci minuta na uzupełnienie ocen!"); }, 0);
            setTimeout(function(){ alert("Za 10 sekund nastąpi zamknięcie ocen, wyślij je teraz!"); }, 50000);
            setTimeout(function(){ 
                $.ajax({
                    url: '/competition/rate',
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
                    alert("Ocenianie konia zostało zakończone, proszę czekać na ponowne otwarcie panelu!");
                });

            }, 60000);
        }
        });
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
    
    
}

/***************************************************************************/
$(document).ready(function() {
    console.log('document ready');
    refereeManager();
    $('div#content-panel').bind('destroyed', function() {
        console.log('dom changed for referee');
        refereeManager;
    });
});