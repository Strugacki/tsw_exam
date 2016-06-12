/*jshint node: true */

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
                o.handler();
            }
        }
    }
    
	
	socket.on('refreshScore',function(data){
		console.log('refresh');
	   $.ajax({
			url: '/result/show',
			method: 'GET',
			dataType: 'JSON'
		}).done(function(data){
			var horses = data.horses;
			var results = data.results;
			var competitions = data.competitions;
			/*******************************************/
			//Creating summary of points for every horse
			for(var i = 0; i < horses.length; i++){
				horses[i].overalls = [];
				horses[i].summary;
				for(var j=0;j<results.length;j++){
					if(horses[i]._id == results[j].horse._id){
						horses[i].overalls.push(results[j].overall);
						console.log('HORSES OVERALLS: ' + horses[i].overalls);
					}
				}
				horses[i].summary = horses[i].overalls.reduce(function(prev,curr){
					return prev + curr;
				},0);
				console.log('Horse summary: ' + horses[0].summary + ' Horse name: ' + horses[0].horseName);
			}
			/*******************************************/
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
			/*******************************************/
			//Creating results list for every competition
		  /*  for(i = 0 ; i < competitions.length; i++){
				competitions[i].results = []
				for(j = 0 ; j < results.length; j++){
					if(competitions[i]._id == results[j].competition._id){
						competitions[i].results.push(results[j]);
					}
				}
			}*/
			/*******************************************/
			for(i = 0 ; i < competitions.length; i++){
				console.log(competitions[i].name);
				competitions[i].horsess = [];
				for(var l = 0; l < horses.length; l++){
					var exists = false;
					var competitionHorse = {};
					competitionHorse.overallPoints = [];
					competitionHorse.summary = 0;
					competitionHorse.name;
					for(j=0;j<results.length;j++){
						if(horses[l]._id == results[j].horse._id && results[j].competition._id == competitions[i]._id){
							exists = true;
							competitionHorse.name = horses[l].horseName;
							competitionHorse.firstName = horses[l].ownerFirstName;
							competitionHorse.lastName = horses[l].ownerLastName;
							competitionHorse.overallPoints.push(results[j].overall);
						}
					}
					if(exists){
						competitionHorse.summary = competitionHorse.overallPoints.reduce(function(prev,curr){
							return prev + curr;
						},0);
						competitions[i].horsess.push(competitionHorse);
					}
				}
			}
			$('div#content-panel').remove();
			var html = new EJS({
				url: 'result/list.ejs'
			}).render({
				results: data.results,
				horses: horses,
				competitions: competitions
			});
			$('div.container').append(html);
			$('table.dataTable').each(function(){
				$(this).DataTable( {
					"language":{
						search:         "Szukaj:",
						paginate: {
							first:      "Pierwsza",
							previous:   "Poprzednia",
							next:       "Następna",
							last:       "Ostatnia"
						}
					},
					"bPaginate": true,
					"bLengthChange": false,
					"bFilter": true,
					"bInfo": false,
					"bAutoWidth": false,

				} );
			});
			searchLogic();
		})
    });
	
	
    $('#search').hide();
    
    /*******************************************/
    //Logic for search button
    var searchLogic = function(){
        $('#search').fadeIn();
        $('input[type=search]').keyup(function(){
            var valueToSearch = $(this).val();
            valueToSearch = '#' + valueToSearch.replace(/\s/g, '').toLowerCase();
            console.log(valueToSearch);
            $('a#searchButton').attr('href',valueToSearch);
        });
        
    }
    
    /*******************************************/
    //SHOW LIST OF COMPETITIONS AND RESULTS ALSO RENDERS RANKING FOR THE BEST HORSES
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
                var competitions = data.competitions;
                /*******************************************/
                //Creating summary of points for every horse
                for(var i = 0; i < horses.length; i++){
                    horses[i].overalls = [];
                    horses[i].summary;
                    for(var j=0;j<results.length;j++){
                        if(horses[i]._id == results[j].horse._id){
                            horses[i].overalls.push(results[j].overall);
                        }
                    }
                    horses[i].summary = horses[i].overalls.reduce(function(prev,curr){
                        return prev + curr;
                    },0);
                }
                /*******************************************/
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
                /*******************************************/
				//Creating results list for every competition
              /*  for(i = 0 ; i < competitions.length; i++){
                    competitions[i].results = []
                    for(j = 0 ; j < results.length; j++){
                        if(competitions[i]._id == results[j].competition._id){
                            competitions[i].results.push(results[j]);
                        }
                    }
                }*/
				/*******************************************/
                for(i = 0 ; i < competitions.length; i++){
					console.log(competitions[i].name);
                    competitions[i].horsess = [];
					for(var l = 0; l < horses.length; l++){
						var exists = false;
						var competitionHorse = {};
						competitionHorse.overallPoints = [];
						competitionHorse.summary = 0;
						competitionHorse.name;
						for(j=0;j<results.length;j++){
							if(horses[l]._id == results[j].horse._id && results[j].competition._id == competitions[i]._id){
								exists = true;
								competitionHorse.name = horses[l].horseName;
								competitionHorse.firstName = horses[l].ownerFirstName;
								competitionHorse.lastName = horses[l].ownerLastName;
								competitionHorse.overallPoints.push(results[j].overall);
							}
						}
						if(exists){
							competitionHorse.summary = competitionHorse.overallPoints.reduce(function(prev,curr){
								return prev + curr;
							},0);
							competitions[i].horsess.push(competitionHorse);
						}
					}
                }
                $('div#content-panel').remove();
                var html = new EJS({
                    url: 'result/list.ejs'
                }).render({
                    results: data.results,
                    horses: horses,
                    competitions: competitions
                });
                $('div.container').append(html);
				$('table.dataTable').each(function(){
					$(this).DataTable( {
						"language":{
							search:         "Szukaj:",
							paginate: {
								first:      "Pierwsza",
								previous:   "Poprzednia",
								next:       "Następna",
								last:       "Ostatnia"
							}
						},
						"bPaginate": true,
						"bLengthChange": false,
						"bFilter": true,
						"bInfo": false,
						"bAutoWidth": false,
						
					} );
				});
                searchLogic();
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