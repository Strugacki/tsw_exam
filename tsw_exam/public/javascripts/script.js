$(document).ready(function(){
   
        $('a#deactivate').on('click',function(e){
           e.preventDefault();
                var url = $('a#deactivate').attr('href');
            console.log(url);
            $.ajax({
                url: url,
                dataType: 'JSON',
                method: 'GET'
            }).done(function(data){
                console.log('działa');
               $('tbody').remove();
                var content = "";
                for(i = 0; i< data.length; i++){
                    content += '<tr><td>'+data[i].firstName + ' ' + data[i].lastName + '</td><td>' + data[i].username + '</td><td>' + data[i].email + '</td>';
                    if(data[i].isActive){
                        content += '<td>Aktywne</td>';
                    }else{ 
                        content += '<td>Nieaktywne</td>';
                    }
                    content += '<td><a href="/referee/edit:' + data[i]._id +'" class="btn btn-primary">Edytuj</a>';
                    if(data[i].isActive){
                        content += '<a href="/referee/deactivate/' + data[i]._id + '" id="deactivate" class="btn btn-warning">Dezaktywuj</a>';
                    }else{
                        content += ' <a href="/referee/activate/' + data[i]._id + '" id="activate" class="btn btn-success">Aktywuj</a></td></tr>';
                    }
                }
               $('thead').after('<tbody>' + content + '</tbody>');
            });
        });
    
        $('a#activate').on('click',function(e){
           e.preventDefault();
                var url = $('a#activate').attr('href');
            console.log(url);
            $.ajax({
                url: url,
                dataType: 'JSON',
                method: 'GET'
            }).done(function(data){
                console.log('działa');
               $('tbody').remove();
                var content = "";
                for(i = 0; i< data.length; i++){
                    content += '<tr><td>'+data[i].firstName + ' ' + data[i].lastName + '</td><td>' + data[i].username + '</td><td>' + data[i].email + '</td>';
                    if(data[i].isActive){
                        content += '<td>Aktywne</td>';
                    }else{ 
                        content += '<td>Nieaktywne</td>';
                    }
                    content += '<td><a href="/referee/edit:' + data[i]._id +'" class="btn btn-primary">Edytuj</a>';
                    if(data[i].isActive){
                        content += '<a href="/referee/deactivate/' + data[i]._id + '" id="deactivate" class="btn btn-warning">Dezaktywuj</a>';
                    }else{
                        content += ' <a href="/referee/activate/' + data[i]._id + '" id="activate" class="btn btn-success">Aktywuj</a></td></tr>';
                    }
                }
               $('thead').after('<tbody>' + content + '</tbody>');
            });
        });
});