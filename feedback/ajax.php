<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

if(
    isset($_POST['name']) &&
    isset($_POST['email']) &&
    isset($_POST['phone']) &&
    isset($_POST['company']) &&
    isset($_POST['message']) &&
    $_POST['feedbackAjax'] == 'Y'
)
{
    // feedback
     //обработка пришедших аяксом данных с формы обратной связи (с самой себя)
    $APPLICATION->IncludeComponent("igancev:feedback", ".default", array(
            "IBLOCK_TYPE" => "service",
            "IBLOCK_ID" => "5",
            "FORM_DATA" => $_POST,
            "CACHE_TYPE" => "A",
            "CACHE_TIME" => "3600"
        ),
        false
    );
}
?>

