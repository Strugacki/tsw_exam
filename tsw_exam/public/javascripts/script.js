$(document).ready(function(){
    
        $('a#activation').on('click',function(e){
           e.preventDefault();
                var url = $('a#activation').attr('href');
            console.log(url);
            $.ajax({
                url: url,
                dataType: 'JSON',
                method: 'GET'
            }).done(function(data){
                console.log('działa');
                var content = "";
                $(this).attr('id','activate');
                $(this).removeClass('btn-danger');
                $(this).addClass('btn-success');
                console.log(data);
            });
        });
});