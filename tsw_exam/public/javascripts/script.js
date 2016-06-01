$(document).ready(function(){
        
        /*REFEREE MANAGEMENT*/
    
        $('a#refereeList').click(function(e){
            e.preventDefault();
            var requestUrl =$(this).attr('href');
            $.ajax({
                url: requestUrl,
                method: 'GET',
                dataType: 'JSON'
            }).done(function(data){
                $('div#content-panel').remove();
                //console.log(data);
                var html = new EJS({url: 'referee/list.ejs'}).render({data: data});
                $('div.container').append(html);
                
                $('a#refereeEdit').on('click',function(e){
                   e.preventDefault();
                    var getUrl =$(this).attr('href');
                    $.ajax({
                        url: getUrl,
                        method: 'GET',
                        dataType: 'JSON',
                    }).done(function(data){
                        $('div#content-panel').remove();
                        var html = new EJS({url: 'referee/edit.ejs'}).render({referee: data});
                        $('div.container').append(html);
                        
                        $('form').submit(function(e){
                            e.preventDefault();
                            var data = {};
                            data.username = $('input#username').val();
                            data.firstName = $('input#firstName').val();
                            data.lastName = $('input#lastName').val();
                            data.email = $('input#email').val();
                            data.password = $('input#password').val();
                            data.password1 = $('input#password1').val();
                            $.ajax({
                                url: $(this).attr('action'),
                                method: 'POST',
                                dataType: 'JSON',
                                data: JSON.stringify(data),
                                contentType: "application/json",
                            }).done(function(data){
                                 $('div#content-panel').remove();
                                var html = new EJS({url: 'referee/list.ejs'}).render({data: data});
                                $('div.container').append(html);
                            });
                        });
                    });
                });
            });
        });
        
    
        $('a#refereeAdd').on('click',function(e){
           e.preventDefault();
            var requestUrl =$(this).attr('href');;
            $.ajax({
                url: requestUrl,
                method: 'GET',
                dataType: 'JSON',
            }).done(function(data){
                $('div#content-panel').remove();
                var html = new EJS({url: 'referee/add.ejs'}).render({data: null});
                $('div.container').append(html);
                $('form').submit(function(e){
                    e.preventDefault();
                    var data = {};
                    data.username = $('input#username').val();
                    data.firstName = $('input#firstName').val();
                    data.lastName = $('input#lastName').val();
                    data.email = $('input#email').val();
                    data.password = $('input#password').val();
                    data.password1 = $('input#password1').val();
                    $.ajax({
                        url: $(this).attr('action'),
                        method: 'POST',
                        dataType: 'JSON',
                        data: JSON.stringify(data),
                        contentType: "application/json",
                    }).done(function(data){
                         $('div#content-panel').remove();
                        //console.log(data);
                        var html = new EJS({url: 'referee/list.ejs'}).render({data: data});
                        $('div.container').append(html);
                    });
                });
            });
        });
});