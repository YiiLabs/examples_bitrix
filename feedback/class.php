<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
    die();

use Bitrix\Main\Loader;

class Feedback extends CBitrixComponent
{
    /**
     * Обрабатываем входящие параметры
     * @param $arParams
     * @return array
     */
    public function onPrepareComponentParams($arParams)
    {
        if (!Loader::includeModule('iblock'))
        {
            return false;
        }

        $result = array(
            "IBLOCK_TYPE" => !empty($arParams['IBLOCK_TYPE']) ? $arParams['IBLOCK_TYPE'] : 'news',
            "IBLOCK_ID" => intval($arParams['IBLOCK_ID']) > 0 ? intval($arParams['IBLOCK_ID']) : 1,
            'CACHE_TYPE' => $arParams['CACHE_TYPE'],
            'CACHE_TIME' => !empty($arParams['CACHE_TIME']) ? intval($arParams['CACHE_TIME']) : 3600,
            'FORM_DATA' => $arParams['FORM_DATA'],
        );

        return $result;
    }

    /**
     * Основной код компонента
     * @return mixed|void
     */
    public function executeComponent()
    {
        if(is_array($this->arParams['FORM_DATA']) && !empty($this->arParams['FORM_DATA']))
        {
            // TODO: можно дополнительно сделать серверную валидацию тут

            // добавляем новый элемент в инфоблок, и отправляем письмо
            if($error = $this->addMessageElement())
            {
                // отправляем email
                $this->sendEmail();
                echo true;

            }
            else {
                echo $error;
            }
        }
        else
        {
            $this->includeComponentTemplate();
        }

        return $this->arResult;
    }

    /**
     * Добавляем новый элемент в инфоблок "Обратная связь"
     * @return bool
     */
    protected function addMessageElement()
    {
        $el = new CIBlockElement;

        $arProp = array();
        $arProp[13] = $this->arParams['FORM_DATA']['email'];  // email
        $arProp[14] = $this->arParams['FORM_DATA']['phone'];  // Телефон
        $arProp[15] = $this->arParams['FORM_DATA']['company'];  // Компания

        // Формируем массив полей нового элемента
        $arQuestionFields = Array(
            "IBLOCK_SECTION_ID" => false,          // элемент лежит в корне раздела
            "IBLOCK_ID"      => $this->arParams['IBLOCK_ID'], // Обратная связь
            "PROPERTY_VALUES"=> $arProp,
            "NAME"           => $this->arParams['FORM_DATA']['name'],
            "ACTIVE"         => "Y",            // активен
            "PREVIEW_TEXT" => $this->arParams['FORM_DATA']['message'],
            "DATE_ACTIVE_FROM" => date("d.m.Y H:i:s"),
        );

        // Если элемент создан
        if($el->Add($arQuestionFields))
        {
            $flag = true;
        }
        else
        {
            $flag = "Error: ".$el->LAST_ERROR;
        }

        return $flag;
    }

    /**
     * Отправляем письмо с данными формы
     */
    protected function sendEmail()
    {
        // Формируем массив данных шаблона письма
        $arEventFields = $this->arParams['FORM_DATA'];

        //отправляем e-mail модератору о вновь созданном вопросе (шаблон: /bitrix/admin/message_edit.php?lang=ru&ID=8)
        CEvent::SendImmediate('feedback', 's1', $arEventFields, 'N', 8);

        // TODO: Тут возможно можно будет отправить e-mail человеку, оставившему вопрос на сайте
    }

}