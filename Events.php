<?php
AddEventHandler("main", "OnSendUserInfo", array('Events', "onSendUserInfoHandler"));

class Events {

    /**
     * подставляем в почтовый шаблон пароль
     * @param $arParams вапвап
     */
    function onSendUserInfoHandler(&$arParams) {
        $arParams['FIELDS']['PASSWORD'] = $arParams['USER_FIELDS']['PASSWORD'];
    }
}