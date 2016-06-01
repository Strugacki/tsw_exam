/******************************REFEREE MANAGEMENT***************************/

//GET ALL REFEREES
var refereeManager = function(){
    //GET ALL REFEREES
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
    });
    });
    
    /* GET AND POST EDIT REFEREE FORM */
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

            /* SUBMITING UPDATING FORM */
            //works with post method
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
    
    //GET AND POST ADD REFEREE FORM
    $('a#refereeAdd').each(function(){
        $(this).on('click',function(e){
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
                    var html = new EJS({url: 'referee/list.ejs'}).render({data: data});
                    $('div.container').append(html);
                });
            });
        });
        });
    });
    
    
    $('a#refereeActivator').each(function(){
        $(this).on('click',function(e){
        e.preventDefault();
        var requestUrl =$(this).attr('href');;
        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'JSON',
        }).done(function(data){
            /*if($(this).hasClass('btn-warning')){
                $(this).removeClass('btn-warning');
                $(this).addClass('btn-success');
                $(this).text('Dezaktywuj');
                $(this).closest('td#status').text('Aktywny');
            }else{
                $(this).removeClass('btn-success');
                $(this).addClass('btn-warning');
                $(this).text('Aktywuj');
                $(this).closest('td#status').text('Nieaktywny');
            }*/
            $('div#content-panel').remove();
            var html = new EJS({url: 'referee/list.ejs'}).render({data: data});
            $('div.container').append(html);
        });
            
        });
    });

/******************************HORSE MANAGEMENT*****************************/
    //GET ALL HORSES
    $('a#horseList').click(function(e){
    e.preventDefault();
    var requestUrl =$(this).attr('href');
    $.ajax({
        url: requestUrl,
        method: 'GET',
        dataType: 'JSON'
    }).done(function(data){
        $('div#content-panel').remove();
        //console.log(data);
        var html = new EJS({url: 'horse/list.ejs'}).render({data: data});
        $('div.container').append(html);
    });
    });
    
    /* GET AND POST EDIT HORSE FORM */
        $('a#horseEdit').on('click',function(e){
           e.preventDefault();
            var getUrl =$(this).attr('href');
            $.ajax({
                url: getUrl,
                method: 'GET',
                dataType: 'JSON',
            }).done(function(data){
                $('div#content-panel').remove();
                var html = new EJS({url: 'horse/edit.ejs'}).render({horse: data});
                $('div.container').append(html);

                /* SUBMITING UPDATING FORM */
                //works with post method
                $('form').submit(function(e){
                    e.preventDefault();
                    var data = {};
                    data.horseName = $('input#horseName').val();
                    data.sex = $('select#sex').val();
                    data.birthDate = $('input#birthDate').val();
                    data.ownerFirstName = $('input#ownerFirstName').val();
                    data.ownerLastName = $('input#ownerLastName').val();
                    $.ajax({
                        url: $(this).attr('action'),
                        method: 'POST',
                        dataType: 'JSON',
                        data: JSON.stringify(data),
                        contentType: "application/json",
                    }).done(function(data){
                         $('div#content-panel').remove();
                        var html = new EJS({url: 'horse/list.ejs'}).render({data: data});
                        $('div.container').append(html);
                    });
                });
            });
        });
    
    //GET AND POST ADD HORSE FORM
    $('a#horseAdd').each(function(){
        $(this).on('click',function(e){
        e.preventDefault();
        var requestUrl =$(this).attr('href');;
        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'JSON',
        }).done(function(data){
            $('div#content-panel').remove();
            var html = new EJS({url: 'horse/add.ejs'}).render({data: null});
            $('div.container').append(html);
            $('form').submit(function(e){
                e.preventDefault();
                var data = {};
                data.horseName = $('input#horseName').val();
                data.sex = $('select#sex').val();
                data.birthDate = $('input#birthDate').val();
                data.ownerFirstName = $('input#ownerFirstName').val();
                data.ownerLastName = $('input#ownerLastName').val();
                $.ajax({
                    url: $(this).attr('action'),
                    method: 'POST',
                    dataType: 'JSON',
                    data: JSON.stringify(data),
                    contentType: "application/json",
                }).done(function(data){
                     $('div#content-panel').remove();
                    var html = new EJS({url: 'horse/list.ejs'}).render({data: data});
                    $('div.container').append(html);
                });
            });
        });
        });
    });
    
     $('a#horseActivator').each(function(){
        $(this).on('click',function(e){
        e.preventDefault();
        var requestUrl =$(this).attr('href');;
        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'JSON',
        }).done(function(data){
            $('div#content-panel').remove();
            var html = new EJS({url: 'horse/list.ejs'}).render({data: data});
            $('div.container').append(html);
        });
            
        });
    });
}

/***************************************************************************/
$(document).ready(refereeManager);
$(document).bind("DOMSubtreeModified",function(){
    console.log('DOM tree changed');
    refereeManager();
});