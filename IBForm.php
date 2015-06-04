<?php
/**
 * Created by PhpStorm.
 * User: flasher007
 * Date: 08.01.2015
 * Time: 21:31
 */

class IBForm {

    /**
     * @var int
     */
    private $iblockId;

    /**
     * @var array
     */
    private $properties = array();

    /**
     * @var array
     */
    private $propertiesRequired = array();

    /**
     * @var array
     */
    private $propertyListFull = array();

    /**
     * @var array
     */
    private $formFields = array();

    /**
     * @var array
     */
    private $errors = array();
    
    private $files = array();
    /**
     * @var array
     */
    private $errorMessageTempletes = array(
        "NAME" => 'Введите имя',
        "PREVIEW_TEXT" => 'Введите текст',
        "PROPERTY_EMAIL" => 'Введите емейл'
    );

    /**
     * @param $iblockId
     * @param $properties
     */
    public function __construct($iblockId, $properties, $propertiesRequired, $propertiesFiles) {
        $this->iblockId = $iblockId;

        $this->properties = $this->buildProperties($properties);

        $this->propertiesRequired = $propertiesRequired;
        $this->files = $propertiesFiles;  

        CModule::IncludeModule("iblock");
    }

    /**
     * @return bool
     */
    public function isValid() {
        if (!empty($this->formFields)) {

            //Helper::dump($this->propertiesRequired);
            foreach($this->formFields as $code => $val) {
                //Helper::dump($code.' = '.$val);
                if (in_array($code, $this->propertiesRequired) && strlen($val)<1) {
                    $this->errors[$code] = $this->errorMessageTempletes[$code];
                }
            }
        }
        return (sizeof($this->errors)>0) ? false : true;
    }

    /**
     *
     */
    public function sendData(){
        $el = new CIBlockElement;

        $arProperty = array();

        foreach ($this->formFields as $code=>$val) {
            if (false !== strpos($code, 'PROPERTY_')){
            	// если файл
            	if(in_array($code, $this->files)){
            		$val = CFile::MakeFileArray($_SERVER["DOCUMENT_ROOT"].$val);
            	}
                $code = str_replace('PROPERTY_', '', $code);
                $arProperty[$code] = $val;
            }
        }

        $arLoadProductArray = Array(
            "IBLOCK_ID"      => $this->iblockId,
            "PROPERTY_VALUES"=> $arProperty,
            "NAME"           => $this->formFields['NAME'],
            "ACTIVE"         => "N",
            "PREVIEW_TEXT"   => $this->formFields['PREVIEW_TEXT']
        );

        if($ID = $el->Add($arLoadProductArray)) {
            require_once($_SERVER['DOCUMENT_ROOT']."/bitrix/modules/main/include/mainpage.php");
            $fields = array(
                "TITLE" => $this->messageTitle,
            );
            //CEvent::Send('ORDER-FORM', CMainPage::GetSiteByHost(), $fields);//*/
            return true;
        } else {
            $this->errors[] = $el->LAST_ERROR;
            return false;
        }
    }

    /**
     * @param $properties
     */
    private function buildProperties($properties) {
        if (!empty($this->properties)){
            /*foreach ($this->properties as $arProp) {
                if (true == strpos($arProp, 'PROPERTY_')){

                }
            }*/
        }
    }

    private function getPropertyListFull(){
        $rsIBLockPropertyList = CIBlockProperty::GetList(
            array("sort" => "asc", "name" => "asc"),
            array("ACTIVE" => "Y", "IBLOCK_ID" => $this->iblockId));
        while ($arProperty = $rsIBLockPropertyList->GetNext()){
            $this->propertyListFull[$arProperty['CODE']] = $arProperty;
        }

        return $this->propertyListFull;
    }

    public function getErrors(){
        return $this->errors;
    }

    /**
     * @return array
     */
    public function getProperties()
    {
        return $this->properties;
    }

    /**
     * @param array $properties
     */
    public function setProperties($properties)
    {
        $this->properties = $properties;
    }

    /**
     * @return int
     */
    public function getIblockId()
    {
        return $this->iblockId;
    }

    /**
     * @param int $iblockId
     */
    public function setIblockId($iblockId)
    {
        $this->iblockId = $iblockId;
    }

    /**
     * @return array
     */
    public function getFormFields()
    {
        return $this->formFields;
    }

    /**
     * @param array $formFields
     */
    public function setFormFields($formFields)
    {
        $this->formFields = $formFields;
    }
}