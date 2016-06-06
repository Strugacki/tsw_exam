/******************************REFEREE MANAGEMENT***************************/
//GET ALL REFEREES

var quest = function() {
    
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
    
    
    var showList = function(){
        $('a#resultList').on('click',function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            $.ajax({
                url: $(this).attr('href'),
                method: 'GET',
                dataType: 'JSON'
            }).done(function(data){
                console.log(data);
                $('div#content-panel').remove();
                var html = new EJS({
                    url: 'result/list.ejs'
                }).render({
                    data: data
                });
                $('div.container').append(html);
                socket.on('refreshScore',function(data){
                    $('div#content-panel').remove();
                    var html = new EJS({
                        url: 'result/list.ejs'
                    }).render({
                        data: data
                    });
                    $('div.container').append(html);    
                });
            })
        });
    }
    
    showList();
}

/***************************************************************************/
$(document).ready(function() {
    console.log('document ready');
    quest();
    $('div#content-panel').bind('destroyed', function() {
        console.log('dom changed for guest');
        quest;
    });
});