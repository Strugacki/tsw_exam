var validator = function(){
    $('input#birthDate').keyup(function(){
        var date = $(this).val();
        console.log(date);
        var date_regex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
        if((date.length !== 0) && (date.match(date_regex))){
            console.log('YES');
            $('div#checkBirthDate > span').removeClass("glyphicon-warning-sign").addClass("glyphicon-ok");
            $('div#checkBirthDateDiv').removeClass('has-warning').addClass("has-success");
            $('button[type="submit"]').removeAttr('disabled');
        }else{
            console.log('NOPE');
            $('div#checkBirthDate > span').removeClass("glyphicon-ok").addClass("glyphicon-warning-sign");
            $('div#checkBirthDateDiv').removeClass("has-success").addClass('has-warning');
            $('button[type="submit"]').attr('disabled','disabled');
        }
    });
    
    $('input#password1').keyup(function(){
        var password = $('input#password').val();
        console.log(password);
        var password1 = $(this).val();
        console.log(password1);
        var regex = new RegExp('^' + password + '$', 'i');
        console.log(regex);
        if((password.length !== 0) && (password === password1)){
            console.log('YES');
            $('div#checkPasswordMatch > span').removeClass("glyphicon-warning-sign").addClass("glyphicon-ok");
            $('div#checkPasswordMatchDiv').removeClass('has-warning').addClass("has-success");
            $('button[type="submit"]').removeAttr('disabled');
        }else{
            console.log('NOPE');
            $('div#checkPasswordMatch > span').removeClass("glyphicon-ok").addClass("glyphicon-warning-sign");
            $('div#checkPasswordMatchDiv').removeClass("has-success").addClass('has-warning');
            $('button[type="submit"]').attr('disabled','disabled');
        }
        
    })
}



$(document).ready(validator);
$(document).bind('DOMSubtreeModified',function(){
    validator();
})