var $flagValid;
var $fio, $email, $text, $phone, $company, $message;
var result;

function showSuccess()
{
    $('body').prepend("<div class=\"fadescreen\">&nbsp;</div>");
    $('.fadescreen').fadeIn();
    $('.feed_form_success').fadeIn();
    return false;
}

function closeSuccess()
{
    $('.fadescreen').fadeOut();
    $('.feed_form_success').fadeOut();
    setTimeout(function() {
        $('.fadescreen').remove();
    }, 500);
    return false;
}

function closeFeedbackForm()
{
    $('.fadescreen').fadeOut();
    $('.feed_form').fadeOut();
//    setTimeout(function() {
        $('.fadescreen').remove();
//    }, 500);
    return false;
}

function clearFeedbackFormFields()
{
    $('.feed_form .validate').each(function(){
        $(this).val('');
    });
}

function sendFeedbackAjax($fio, $email, $phone, $company, $message)
{
    $.ajax({
        type: "POST",
        url: '/local/components/igancev/feedback/ajax.php',
        async: false,
        data: "name="+$fio+"&email="+$email+"&phone="+$phone + "&company=" + $company + "&message=" + $message + "&feedbackAjax=Y",
        success: function (result)
        {
            if(result)
            {
//                showFeedbackForm();
                closeFeedbackForm();
                clearFeedbackFormFields();

                showSuccess();
            }
            else
            {
                alert(result);
            }
        }
    });
}


$(document).ready(function(){



    // клик по кнопке "Отправить сообщение"
    $('.feed_form_submit').on('click', function(){
        $flagValid = true;
        $('.feed_form .validate').each(function(){

            if(jQuery.trim($(this).val()) == '')
            {
                $(this).addClass('red-border');
                $flagValid = false;
            }
            else
            {
                $(this).removeClass('red-border');
            }
        });

        // если поля не пустые
        if($flagValid)
        {

            $fio = $('#feed_name').val();
            $email = $('#feed_email').val();
            $phone = $('#feed_phone').val();
            $company = $('#feed_company').val();
            $message = $('#feed_message').val();
//            //alert($fio);
            sendFeedbackAjax($fio, $email, $phone, $company, $message);
        }

        return false;
    });

    // событие клика по закрывающему крестику и по пространству затемненному вокруг попапа
    $('.feed_form_success .close_popup').on('click', function(){
        closeSuccess();
    });

});