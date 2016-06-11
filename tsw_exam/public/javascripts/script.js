/******************************REFEREE MANAGEMENT***************************/
//GET ALL REFEREES

var adminManager = function() {
    
    var URL_SERVER = "https://localhost:3000";
    var socket = io.connect(URL_SERVER);

    socket.on("message",function(data){
        console.log(data); 
    });

    socket.on('test',function(data){
                    console.log('hej' + data);
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
    
    /************************************************************/
    //GET ALL REFEREES
    $('a#refereeList').click(function(e) {
        e.preventDefault();
        var requestUrl = $(this).attr('href');
        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data) {
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'referee/list.ejs'
            }).render({
                data: data
            });
            $('div.container').append(html);
            refereeEdit();
            refereeActivator();
        });
    });

    /************************************************************/
    //REFEREE EDIT EVENT(GET AND POST)
    var refereeEdit = function(){
            $('a#refereeEdit').on('click', function(e) {
            e.preventDefault();
            var getUrl = $(this).attr('href');
            $.ajax({
                url: getUrl,
                method: 'GET',
                dataType: 'JSON',
            }).done(function(data) {
                $('div#content-panel').remove();
                var html = new EJS({
                    url: 'referee/edit.ejs'
                }).render({
                    referee: data
                });
                $('div.container').append(html);

                /* SUBMITING UPDATING FORM */
                //works with post method
                $('form').submit(function(e) {
                    e.preventDefault();
                    var data = {};
                    //prepare data to send with values from inputs
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
                    }).done(function(data) {
                        //render list view and append it
                        $('div#content-panel').remove();
                        var html = new EJS({
                            url: 'referee/list.ejs'
                        }).render({
                            data: data
                        });
                        $('div.container').append(html);
                        refereeEdit();
                        refereeActivator();
                    });
                });
            });
        });
    }

    /************************************************************/
    //REFEREE ADD EVENT(GET AND POST)
    $('a#refereeAdd').each(function() {
        $(this).on('click', function(e) {
            e.preventDefault();
            var requestUrl = $(this).attr('href');;
            $.ajax({
                url: requestUrl,
                method: 'GET',
                dataType: 'JSON',
            }).done(function(data) {
                $('div#content-panel').remove();
                var html = new EJS({
                    url: 'referee/add.ejs'
                }).render({
                    data: null
                });
                $('div.container').append(html);
                $('form').submit(function(e) {
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
                    }).done(function(data) {
                        $('div#content-panel').remove();
                        var html = new EJS({
                            url: 'referee/list.ejs'
                        }).render({
                            data: data
                        });
                        $('div.container').append(html);
                        refereeEdit();
                        refereeActivator();
                    });
                });
            });
        });
    });

    /************************************************************/
    //REFEREE ACTIVATOR FUNCTION
    var refereeActivator = function(){
        $('a#refereeActivator').each(function() {
        $(this).on('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var requestUrl = $(this).attr('href');
            if($(this).text() === "Aktywuj"){
                $(this).text('Dezaktywuj');
                $(this).removeClass('btn-success');
                $(this).addClass('btn-warning');
            }else{
                $(this).text('Aktywuj');
                $(this).removeClass('btn-warning');
                $(this).addClass('btn-success');
            }
            $.ajax({
                url: requestUrl,
                method: 'GET',
                dataType: 'JSON',
            }).done(function(data) {
                /*$('div#content-panel').remove();
                var html = new EJS({
                    url: 'referee/list.ejs'
                }).render({
                    data: data
                });
                $('div.container').append(html);*/
                console.log('REFEREE ACTIVATION STATUS CHANGED');
            });

        });
        });
    }

    /******************************HORSE MANAGEMENT*****************************/
    /************************************************************/
    //GET ALL REFEREES
    $('a#horseList').click(function(e) {
        e.preventDefault();
        var requestUrl = $(this).attr('href');
        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data) {
            console.log(data);
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'horse/list.ejs'
            }).render({
                data: data
            });
            $('div.container').append(html);
            $('div#content-panel').bind('destroyed', function() {

            });
            horseActivator();
            horseEdit();
        });
    });

    /************************************************************/
    //HORSE EDIT EVENT(GET AND POST)
    var horseEdit = function(){
        $('a#horseEdit').on('click', function(e) {
        e.preventDefault();
        var getUrl = $(this).attr('href');
        $.ajax({
            url: getUrl,
            method: 'GET',
            dataType: 'JSON',
        }).done(function(data) {
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'horse/edit.ejs'
            }).render({
                horse: data
            });
            $('div.container').append(html);

            /* SUBMITING UPDATING FORM */
            //works with post method
            $('form').submit(function(e) {
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
                }).done(function(data) {
                    $('div#content-panel').remove();
                    var html = new EJS({
                        url: 'horse/list.ejs'
                    }).render({
                        data: data
                    });
                    $('div.container').append(html);
                    horseActivator();
                    horseEdit();
                });
            });
        });
        });
    }

    /************************************************************/
    //HORSE ADD EVENT(GET AND POST)
    $('a#horseAdd').each(function() {
        $(this).on('click', function(e) {
            e.preventDefault();
            var requestUrl = $(this).attr('href');;
            $.ajax({
                url: requestUrl,
                method: 'GET',
                dataType: 'JSON',
            }).done(function(data) {
                $('div#content-panel').remove();
                var html = new EJS({
                    url: 'horse/add.ejs'
                }).render({
                    data: null
                });
                $('div.container').append(html);
                $('form').submit(function(e) {
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
                    }).done(function(data) {
                        $('div#content-panel').remove();
                        var html = new EJS({
                            url: 'horse/list.ejs'
                        }).render({
                            data: data
                        });
                        $('div.container').append(html);
                        horseActivator();
                        horseEdit();
                    });
                });
            });
        });
    });

    /************************************************************/
    //HORSE ACTIVATOR FUNCTION
    var horseActivator = function() {
        $('a#horseActivator').each(function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var requestUrl = $(this).attr('href');
                if($(this).text() === "Dopuść"){
                    $(this).text('Zawieś');
                    $(this).removeClass('btn-success');
                    $(this).addClass('btn-warning');
                }else{
                    $(this).text('Dopuść');
                    $(this).removeClass('btn-warning');
                    $(this).addClass('btn-success');
                }
                $.ajax({
                    url: requestUrl,
                    method: 'GET',
                    dataType: 'JSON',
                }).done(function(data) {
                    console.log('HORSE ACTIVATION STATUS CHANGED');
                });

            });
        });
    }

    /************************COMPETITION MANAGEMENT*****************************/

    $('a#competitionAdd').on('click', function(e) {
        var competitionData = {};
        e.preventDefault();
        //get all referees from database
        $.ajax({
            url: '/referee/list',
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data) {
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'competition/add.ejs'
            }).render({
                data: {}
            }); //rendering view
            $('div.container').append(html);
            //form submit locker
            $('form').submit(function(e) {
                e.preventDefault();
            });
            $('div.hidden-content').hide();
            var refereesList = '';
            //creating referees options for select
            for (var i = 0; i < data.length; i++) {
                if (data[i].isActive) {
                    refereesList += '<option value="' + data[i]._id + '">' + data[i].firstName + " " + data[i].lastName + "</option>";
                }
            }
            $('select#refereesList').append(refereesList); //append referees list to select
            //get all horses from database
            $.ajax({
                url: '/horse/list',
                method: 'GET',
                dataType: 'JSON'
            }).done(function(data) {
                var horsesList = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isActive) {
                        if(data[i].sex == 'stallion'){
                            horsesList += '<option value="' + data[i]._id + '" data-sex="stallion">' + data[i].horseName + "</option>";    
                        }else{
                            horsesList += '<option value="' + data[i]._id + '" data-sex="mare">' + data[i].horseName + "</option>";   
                        }
                    }
                }
                $('select#horsesList').append(horsesList);
                /**************************************************/
                //********DIVIDE INTO GROUPS BUTTON LOGIC*********//
                $('button#slideDown').on('click', function() {
                    $('div.hidden-content').slideToggle();
                    if ($('select#refereesList').attr('disabled') == 'disabled' && $('select#horsesList').attr('disabled') == 'disabled') {
                        $('select#refereesList').removeAttr('disabled');
                        $('select#horsesList').removeAttr('disabled');
                    } else {
                        $('select#refereesList').attr('disabled', 'disabled');
                        $('select#horsesList').attr('disabled', 'disabled');
                    }
                    //
                    competitionData['horses'] = [];
                    competitionData['referees'] = [];
                    var refereesForGrouping = [];
                    var horsesForGrouping = [];
                    var maresForGroup = [];
                    var stallionsForGroup = [];
                    //
                    //Collect info about horses that were selected and psuh them to competitionData.horses array
                    $('select#horsesList > option:selected').each(function() {
                        var horse = {
                            horseName: $(this).text(),
                            id: $(this).val()
                        };
                        if($(this).attr('data-sex') == 'stallion'){
                            console.log('STALLION ADDED');
                            stallionsForGroup.push($(this).val());
                        }else{
                            console.log('MARES ADDED');
                            maresForGroup.push($(this).val());
                        }
                        competitionData['horses'].push($(this).val());
                        horsesForGrouping.push(horse.id);
                    });
                    //
                    //Collect info about referees that were selected and push them to competitionData.referees array
                    $('select#refereesList > option:selected').each(function() {
                        var referee = {
                            id: $(this).val(),
                            name: $(this).text()
                        };
                        competitionData['referees'].push($(this).val());
                        refereesForGrouping.push(referee);
                    });
                    //
                    //print both arrays
                    console.log(competitionData['horses']);
                    console.log(competitionData['referees']);
                    //
                    //Create options for selecting horses in group number
                    for (var i = 1; i <= competitionData['horses'].length; i++) {
                        $('select#horsesInGroupNumber').append('<option value="' + i + '">' + i + '</option>');
                    }
                    // 
                    var groupsNumber = 0;
                    //COMBO BREAKER
                    //When horses in group number is choosen from list, this function creates options for 
                    //referees in group number
                    $('select#horsesInGroupNumber').change(function() {
                        groupsNumber = 0;
                        horsesInGroupNumber = $(this).val();
                        $('select#refereesInGroupNumber > option').remove();
                        console.log('NUMER OF HORSES:' + horsesInGroupNumber);
                        var j = competitionData['horses'].length;
                        while (j >= horsesInGroupNumber) {
                            j -= horsesInGroupNumber;
                            groupsNumber++;
                        }
                        console.log(groupsNumber);
                        var divider = competitionData['referees'].length / groupsNumber;
                        for (var i = 1; i <= divider; i++) {
                            $('select#refereesInGroupNumber').append('<option value="' + i + '">' + i + '</option>');
                        }
                    });
                    //
                    $('select#refereesInGroupNumber').change(function() {
                        refereesInGroupNumber = $(this).val();
                        console.log('NUMER OF REFEREES:' + refereesInGroupNumber);
                        if ($(this).val() !== null && (competitionData['horses'].length <= competitionData['referees'].length)) {}//TO - DO
                    });
                    //
                    //
                    $('button[type=submit]').on('click', function(e) {
                        e.preventDefault();
                        var data = {};
                        data.name = $('input#name').val();
                        console.log(data.name);
                        data.referees = competitionData['referees'];
                        data.horses = competitionData['horses'];
                        data.groupsNumber = groupsNumber;
                        data.horsesInGroupNumber = horsesInGroupNumber;
                        data.refereesInGroupNumber = refereesInGroupNumber;
                        data.stallions = stallionsForGroup;
                        data.mares = maresForGroup;
                        $.ajax({
                            url: '/competition/add',
                            method: 'POST',
                            dataType: 'JSON',
                            data: data
                        }).done(function(data) {
                            $('div#content-panel').remove();
                            var html = new EJS({
                                url: 'competition/list.ejs'
                            }).render({
                                data: data
                            });
                            $('div.container').append(html);
                        });
                    });

                });
                /**************************************************/
            });
        });

    });
    /**************************************************/
    //COMBO BREAKER
    //SHOW ALL COMPETITIONS AND GROUPS LOGIC
    //Fetch all competitions from db
    $('a#competitionList').on('click', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data) {
            console.log(data);
            console.log(data[0].groups[0]._id);
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'competition/list.ejs'
            }).render({
                data: data
            });
            $('div.container').append(html);
            competitionActivator();
            $('div#groups').hide();
            //Display groups button for every competition
            $('button#competitionShowGroups').each(function(){
                $(this).on('click',function(e){
                    //slide down groups panel
                    $(this).closest('tr').next('tr').children('td').children('div').slideToggle();
                    //Fetch information about group from db
                });
            });
            $('a#groupLink').each(function(){
                $(this).on('click',function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var url = $(this).attr('href');
                    $(this).fadeOut();
                    console.log(url);
                    $('div#clicked').removeAttr('id');
                    //check if button was already clicked / if no, then fetch data and mark it as clicked with id attribute
                        $(this).closest('div').attr('id','clicked');
                        $.ajax({
                            url: url,
                            method: 'GET',
                            dataType: 'JSON'
                        }).done(function(data){
                            //render group panel and append it
                            var html = new EJS({
                                url: 'competition/templates/group.ejs'
                            }).render({
                                data: data
                            });
                            $('div#clicked').append(html);
                    });    
                });
            });
        });
    });

    /************************************************************/
    //COMPETITION ACTIVATOR FUNCTION
    var competitionActivator = function(){
        if($('a#competitionActivator').hasClass('btn-warning')){
           $('a#competitionActivator.btn-success').attr('disabled','disabled'); 
        }
        $('a#competitionActivator').each(function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var requestUrl = $(this).attr('href');
                if($(this).text() === "Rozpocznij"){
                    $(this).text('Zakończ');
                    $(this).removeClass('btn-success');
                    $(this).addClass('btn-warning');
                    $('a#competitionActivator.btn-success').attr('disabled','disabled');
                }else{
                    $(this).text('Rozpocznij');
                    $(this).removeClass('btn-warning');
                    $(this).addClass('btn-success');
                    $('a#competitionActivator.btn-success').removeAttr('disabled');
                }
                $.ajax({
                    url: requestUrl,
                    method: 'GET',
                    dataType: 'JSON',
                }).done(function(data){
                    console.log(data);
                    socket.emit('startCompetition',true);
                });
            });
        });
    }  
    
    /************************************************************/
    //SHOWS ACTIVE COMPETITION 
    $('a#competitionActivated').on('click', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'JSON'
        }).done(function(data) {
            console.log(data);
            console.log(data[0].groups[0]._id);
            $('div#content-panel').remove();
            var html = new EJS({
                url: 'competition/activated.ejs'
            }).render({
                data: data
            });
            $('div.container').append(html);
            competitionActivator();
            $('div#groups').hide();
            //Display groups button for every competition
            $('button#competitionShowGroups').each(function(){
                $(this).on('click',function(e){
                    //slide down groups panel
                    $(this).closest('tr').next('tr').children('td').children('div').slideToggle();
                    //Fetch information about group from db
                });
            });
            $('a#groupLink').each(function(){
                $(this).on('click',function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $(this).fadeOut();
                    var url = $(this).attr('href');
                    console.log(url);
                    $('div#clicked').removeAttr('id');
                    //check if button was already clicked / if no, then fetch data and mark it as clicked with id attribute
                        $(this).closest('div').attr('id','clicked');
                        $.ajax({
                            url: url,
                            method: 'GET',
                            dataType: 'JSON'
                        }).done(function(data){
                            //render group panel and append it
                            var html = new EJS({
                                url: 'competition/templates/horses.ejs'
                            }).render({
                                data: data
                            });
                            $('div#clicked').append(html);
                            $('button.rateButton').each(function(){
                               $(this).on('click',function(e){
                                   e.preventDefault();
                                   e.stopImmediatePropagation();
                               var id = $(this).attr('id');
                                if($(this).text() === "Zacznij ocenianie"){
                                    $(this).text('Zakończ ocenianie');
                                    $(this).removeClass('btn-success');
                                    $(this).addClass('btn-danger');
                                }else{
                                    $(this).text('Zacznij ocenianie');
                                    $(this).removeClass('btn-danger');
                                    $(this).addClass('btn-success');
                                }
                                console.log('HORSE ID: ' + id); 
                                $.ajax({
                                    url: '/horse/rateActivator/'+$(this).attr('id'),
                                    method: 'GET',
                                    dataType: 'JSON'
                                }).done(function(data){
                                    console.log('HORSE RATE ACTIVATING SUCCESS');
                                    socket.emit('horseActivated',id);
                                });   
                               });
                            });
                    });    
                });
            });
        });
    });
    
}

/***************************************************************************/
$(document).ready(function() {
    console.log('document ready');
    adminManager();
    $('div#content-panel').bind('destroyed', function() {
        console.log('dom changed');
        adminManager;
    });
});