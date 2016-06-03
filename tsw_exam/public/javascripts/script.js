/******************************REFEREE MANAGEMENT***************************/
//GET ALL REFEREES
var refereeManager = function(){
    
    $.event.special.destroyed = {
        remove: function(o) {
          if (o.handler) {
            o.handler()
            }
        }
    }
    
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
            $('div#content-panel').bind('destroyed', function() {
              console.log('chuj');
            });
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
            console.log(data);
            $('div#content-panel').remove();
            //console.log(data);
            var html = new EJS({url: 'horse/list.ejs'}).render({data: data});
            $('div.container').append(html);
            $('div#content-panel').bind('destroyed', function() {
              console.log('chuj');
            });
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
    
/************************COMPETITION MANAGEMENT*****************************/
    
  //  $('a#competitionAdd').each(function(){
        $('a#competitionAdd').on('click',function(e){
            var competitionData = {};
            e.preventDefault();
            //get all referees from database
            $.ajax({
                url: '/referee/list',
                method: 'GET',
                dataType: 'JSON'
            }).done(function(data){
                $('div#content-panel').remove();
                var html = new EJS({url: 'competition/add.ejs'}).render({data: {}}); //rendering view
                $('div.container').append(html);
                //form submit locker
                $('form').submit(function(e){
                    e.preventDefault();
                });
                $('div.hidden-content').hide();                
                var refereesList = '';
                //creating referees options for select
                for(var i=0; i< data.length; i++){
                    if(data[i].isActive){
                        refereesList += '<option value="' + data[i]._id +'">' + data[i].firstName + " " + data[i].lastName + "</option>";    
                    }
                }
                $('select#refereesList').append(refereesList);//append referees list to select
                //get all horses from database
                $.ajax({
                    url: '/horse/list',
                    method: 'GET',
                    dataType: 'JSON'
                }).done(function(data){
                    var horsesList = '';
                    for(var i=0; i< data.length; i++){
                        horsesList += '<option value="' + data[i]._id +'">' + data[i].horseName + "</option>";
                    }
                    $('select#horsesList').append(horsesList);
                    /**************************************************/
                    //********DIVIDE INTO GROUPS BUTTON LOGIC*********//
                     $('button#slideDown').on('click',function(){
                        $('div.hidden-content').slideToggle();
                        if($('select#refereesList').attr('disabled') == 'disabled' && $('select#horsesList').attr('disabled') == 'disabled'){             $('select#refereesList').removeAttr('disabled');
                            $('select#horsesList').removeAttr('disabled');
                        }else{
                            $('select#refereesList').attr('disabled','disabled');
                            $('select#horsesList').attr('disabled','disabled');
                        }
                        //
                        competitionData['horses'] = [];
                        competitionData['referees'] = [];
                        var refereesForGrouping = [];
                        var horsesForGrouping = [];
                        $('select#horsesList > option:selected').each(function(){
                            var horse = {horseName: $(this).text(), id: $(this).val()};
                            competitionData['horses'].push($(this).val());
                            horsesForGrouping.push(horse);
                        });
                        //
                        $('select#refereesList > option:selected').each(function(){
                            var referee = {id: $(this).val(), name: $(this).text()};
                            competitionData['referees'].push($(this).val());
                            refereesForGrouping.push(referee);
                        });
                        //
                        console.log(competitionData['horses']);
                        console.log(competitionData['referees']);
                        // 
                        for(var i=1;i<=competitionData['horses'].length;i++){
                            $('select#horsesInGroupNumber').append('<option value="' + i +'">'+i+'</option>');
                        }
                        // 
                        var groupsNumber = 0;
                        $('select#horsesInGroupNumber').change(function(){
                            horsesInGroupNumber = $(this).val();
                            $('select#refereesInGroupNumber > option').remove();
                            console.log('NUMER OF HORSES:' + horsesInGroupNumber);
                            var j = competitionData['horses'].length;
                            while(j>=horsesInGroupNumber){
                                j-=horsesInGroupNumber;
                                groupsNumber++;
                            }
                            console.log(groupsNumber);
                            var divider = competitionData['referees'].length / groupsNumber;
                            for(var i=1;i<=divider;i++){
                                $('select#refereesInGroupNumber').append('<option value="' + i +'">'+i+'</option>');
                            }
                        });
                        $('select#refereesInGroupNumber').change(function(){
                            refereesInGroupNumber = $(this).val();
                            console.log('NUMER OF REFEREES:' + refereesInGroupNumber);
                            if($(this).val() !== null && (competitionData['horses'].length<=competitionData['referees'].length)){
                            }
                        });
                        //
                        $('button#addGroups').on('click',function(){
                            console.log(groupsNumber);
                            $('div#group-panel').remove();
                            for(var i = groupsNumber; i>0;i--){
                                console.log('weszlo');
                                var html = new EJS({url: 'competition/templates/group.ejs'}).render({number : groupsNumber,referees: refereesForGrouping, horses: horsesForGrouping});
                                $('div#groups').append(html);
                            }
                        });
                         $('button[type=submit]').on('click',function(e){
                             e.preventDefault();
                             var data = {};
                             data.name = $('input#name').val();
                             data.referees = competitionData['referees'];
                             data.horses = competitionData['horses'];
                             data.groupsNumber = groupsNumber;
                             data.horsesInGroupNumber = horsesInGroupNumber;
                             data.refereesInGroupNumber = refereesInGroupNumber;
                             $.ajax({
                                 url: '/competition/add',
                                 method: 'POST',
                                 dataType: 'JSON',
                                 data: data
                             }).done(function(data){
                                 
                             });
                         });
                        
                    });
                    /**************************************************/
                });
            });  
            
       });
        
  //  });
}

/***************************************************************************/
$(document).ready(function(){
    console.log('document ready');
    refereeManager();
    $('div#content-panel').bind('destroyed', function() {
        console.log('dom changed');
        refereeManager();
    });
});

