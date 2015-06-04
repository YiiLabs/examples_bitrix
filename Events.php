<?php
AddEventHandler("main", "OnSendUserInfo", array('Events', "onSendUserInfoHandler"));

class Events {

    /**
     * подставляем в почтовый шаблон пароль
     * @param $arParams
     */
    function onSendUserInfoHandler(&$arParams) {
        $arParams['FIELDS']['PASSWORD'] = $arParams['USER_FIELDS']['PASSWORD'];
    }
}