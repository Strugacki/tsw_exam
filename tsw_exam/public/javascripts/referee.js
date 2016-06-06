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
        });
    });
    
    socket.on('removeForm',function(data){
            $('div.panel-heading').remove();
            $('div.panel-body').remove();
            $('div.panel-default').append('<div class="panel panel-heading text-center"><h1>Formularz oceny zawodów</h1></div><div class="panel panel-body"><p class="alert alert-danger text-center">Obecnie żaden koń nie podlega ocenie, proszę czekać!!</p><div class="horsesList"></div>');
    });
    
    
    socket.on('horseActivated',function(data){
        console.log('JEST!')
        console.log(data._id);
        $('button[id*='+data._id+']').removeAttr('disabled').removeClass('btn-danger').addClass('btn-success');
        var html = new EJS({
            url: 'competition/templates/rateHorseForm.ejs'
        }).render({
            horse: data
        });
        $('button[id*='+data._id+']').parent().append(html);
        $('div#horseForm').hide();
        $('button[id*='+data._id+']').on('click',function(){
            $('div#horseForm').slideToggle();
        });
        $('form').submit(function(e){
            e.preventDefault();
        });
        
    });
    
    socket.on('horseDeactivated',function(data){
        console.log('TY MENDO');
        //setInterval(function(){ alert("Hello"); }, 10000);
    });
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
            /*socket.on('horseToRate',function(data){
                console.log(data);
                console.log('SEND HORSE TO REFEREE SUCCESS!');
                $('div.panel-body').remove();
                var html = new EJS({
                url: 'competition/rateForm.ejs'
                }).render({
                    horse: data
                });
                $('form').append(html);
                $('.single-slider').jRange({
                    from: 0,
                    to: 20,
                    step: 2,
                    scale: [0,2,4,6,8,10,12,14,16,18,20],
                    format: '%s',
                    width: 500,
                    showLabels: true,
                    snap: true
                });
            });//socket*/
        });
        
    });
    
    
}

/***************************************************************************/
$(document).ready(function() {
    console.log('document ready');
    refereeManager();
    $('div#content-panel').bind('destroyed', function() {
        console.log('dom changed');
        refereeManager;
    });
});