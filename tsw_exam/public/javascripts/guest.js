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
                var horses = data.horses;
                var results = data.results;
                //Creating summary of points for every horse
                for(var i = 0; i < horses.length; i++){
                    horses[i].overalls = [];
                    horses[i].summary = 0;
                    for(var j=0;j<results.length;j++){
                        if(horses[i]._id == results[j].horse._id){
                            horses[i].overalls.push(results[j].overall);
                            console.log('HORSES OVERALLS: ' + horses[i].overalls);
                        }
                    }
                    console.log(horses[i].overalls);
                    horses[i].summary = horses[i].overalls.reduce(function(prev,curr){
                        return prev + curr;
                    },0);
                    console.log('Horse summary: ' + horses[i].summary);
                }
                //Bubble sorting array with horses and their summary points
                do{
                    var zamiana = false;
                    for( i = 0; i < horses.length -1 ; i++){
                        var horse1 = horses[i];
                        var horse2 = horses[i+1];
                        if(parseInt(horse1.summary) < parseInt(horse2.summary)){
                            var horseTmp = horse1;
                            horses[i] = horse2;
                            horses[i+1] = horseTmp;
                            zamiana = true;
                        }
                    }
                }while(zamiana);
                
                $('div#content-panel').remove();
                var html = new EJS({
                    url: 'result/list.ejs'
                }).render({
                    results: data.results,
                    horses: horses
                });
                $('div.container').append(html);
            })
        });
    }
    
    showList();
    socket.on('refreshScore',function(data){
       showList(); 
    });
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