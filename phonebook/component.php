<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
require_once $_SERVER["DOCUMENT_ROOT"]."/bitrix/php_interface/tools/include.php";
global $USER;
if (!$USER->IsAuthorized())
{
	$APPLICATION->AuthForm();
}
else
{
	if(isset($_GET['ToExcel']))
	{
		$_POST['ajaxrequest'] = 'Y';
		$_REQUEST["action"] = 'ToExcel';
	}
	$cacheID = SITE_ID.'phonebook'.$USER->GetID();
	//обработчик AJAX
	if (isset($_POST['ajaxrequest']) && $_POST['ajaxrequest'] == 'Y')
	{
		//нам не нужен никакой html до компоненты, поэтому РЕСТАРТИМ БУФЕР
		$APPLICATION->RestartBuffer();
		include($_SERVER['DOCUMENT_ROOT'].$this->GetPath()."/eventHandler.php");
		buildPhonebookCache($cacheID);
		die();
	}

	if($_GET['clear_cache']=='Y')
	{
		buildPhonebookCache($cacheID);
	}

//	$timer = new CTimer();
//	$timer->start("total");
	if($arResult = getFromFileCache($cacheID)) //если кеш есть
	{

	}
	else //кеша нет, строим
	{
		$arResult = buildPhonebookCache($cacheID);
	}
//	$timer->stop("Время формирования данных", "total");
	$this->IncludeComponentTemplate();
}


function getFromFileCache($cacheID)
{
	$cacheName = $_SERVER["DOCUMENT_ROOT"]."/bitrix/components/sms4b/phonebook/cache/".$cacheID.".txt";
	if(file_exists($cacheName))
		return unserialize(file_get_contents($cacheName));
	else
		return false;
}
/**
* формируем параметры для телефонной книги
*
*/
function buildPhonebookCache($cacheID)
{
	$contactsIblockId = 22;
	$groupsIblockId = 21;
	global $APPLICATION;
	global $USER;


	$arResult = array();
	$arResult['phonebookParams']['url'] = $APPLICATION->GetCurPage(false);
	$arResult['phonebookParams']['session'] = session_id();
	$MESSAGES = array(
		'CAPTION_EXCEL' => GetMessage('CAPTION_EXCEL'),
		'EXTENSION' => GetMessage('EXTENSION'),
		'ERROR' => GetMessage('ERROR'),
		'SUCCESS' => GetMessage('SUCCESS'),
		'GROUP' => GetMessage('GROUP'),
		'ATTENTION' => GetMessage('ATTENTION'),
		'ADD_GROUP' => GetMessage('ADD_GROUP'),
		'CONTACTS_DELETE_MULTY' => GetMessage('CONTACTS_DELETE_MULTY'),
		'GROUP_NO_GROUP_EMPTY' => GetMessage('GROUP_NO_GROUP_EMPTY'),
		'CONTACTS_MOVED' => GetMessage('CONTACTS_MOVED'),
		'CONTACTS_MOVED_BIG' => GetMessage('CONTACTS_MOVED_BIG'),
		'CONTACT_ADD_ERR' => GetMessage('CONTACT_ADD_ERR'),
		'CONTACTS_GROUP_ADDED' => GetMessage('CONTACTS_GROUP_ADDED'),
		'CONTACTS_GROUP_ADDED_BIG' => GetMessage('CONTACTS_GROUP_ADDED_BIG'),
		'CONTACTS_DELETED' => GetMessage('CONTACTS_DELETED'),
		'CONTACTS_DELETED_BIG' => GetMessage('CONTACTS_DELETED_BIG'),
		'DELETE_ERR' => GetMessage('DELETE_ERR'),
		'GROUP_EDIT' => GetMessage('GROUP_EDIT'),
		'CONTACT_EDIT' => GetMessage('CONTACT_EDIT'),
		'CONTACTS_DELETE' => GetMessage('CONTACTS_DELETE'),
		'GROUP_DELETE' => GetMessage('GROUP_DELETE'),
		'ARE_YOU_SURE' => GetMessage('ARE_YOU_SURE'),
		'FIELD_LENGTH' => GetMessage('FIELD_LENGTH'),
		'MUST_BE' => GetMessage('MUST_BE'),
		'AND' => GetMessage('AND'),
		'FIELD_WORD' => GetMessage('FIELD_WORD'),
		'FIELD_NUMBER' => GetMessage('FIELD_NUMBER'),
		'SECOND_NAME' => GetMessage('SECOND_NAME'),
		'NAME' => GetMessage('NAME'),
		'TELEPHONE' => GetMessage('TELEPHONE'),
		'ALL_FIELDS' => GetMessage('ALL_FIELDS'),
		'GROUP_NAME' => GetMessage('GROUP_NAME'),
		'NEW_GROUP' => GetMessage('NEW_GROUP'),
		'NEW_GROUP_ERR' => GetMessage('NEW_GROUP_ERR'),
		'GROUP_EDITED' => GetMessage('GROUP_EDITED'),
		'GROUP_EDIT_ERR' => GetMessage('GROUP_EDIT_ERR'),
		'GROUP_DELETED' => GetMessage('GROUP_DELETED'),
		'GROUP_NO_GROUP_DELETED' => GetMessage('GROUP_NO_GROUP_DELETED'),
		'GROUP_DELETE_ERR' => GetMessage('GROUP_DELETE_ERR'),
		'NEW_CONTACT' => GetMessage('NEW_CONTACT'),
		'CONTACT_EDITED' => GetMessage('CONTACT_EDITED'),
		'CONTACT_EDIT_ERR' => GetMessage('CONTACT_EDIT_ERR'),
		'CONTACT_DELETED' => GetMessage('CONTACT_DELETED'),
		'CONTACT_DELETE_ERR' => GetMessage('CONTACT_DELETE_ERR'),
		'SUCCESS_DOWNLOAD' => GetMessage('SUCCESS_DOWNLOAD'),
		'SUCCESS_DOWNLOAD_BIG' => GetMessage('SUCCESS_DOWNLOAD_BIG'),
		'UNSUCCESS_DOWNLOAD' => GetMessage('UNSUCCESS_DOWNLOAD'),
		'ARE_YOU_SURE_MULTIPLE' => GetMessage('ARE_YOU_SURE_MULTIPLE'),
		'HEAD_LASTNAME' => GetMessage('HEAD_LASTNAME'),
		'HEAD_NAME' => GetMessage('HEAD_NAME'),
		'HEAD_PHONE' => GetMessage('HEAD_PHONE'),
		'CHANGE_CONTACT' => GetMessage('CHANGE_CONTACT'),
		'DELETE_CONTACT' => GetMessage('DELETE_CONTACT'),
		'SEND_CONTACT' => GetMessage('SEND_CONTACT'),
		'SMS' => GetMessage('SMS'),
		'DELETE_LINK' => GetMessage('DELETE_LINK'),
		'EDIT_GROUP_NAME' => GetMessage('EDIT_GROUP_NAME'),
		'DELETE_GROUP' => GetMessage('DELETE_GROUP'),
		'SEND_GROUP' => GetMessage('SEND_GROUP'),
		'MARK_ALL' => GetMessage('MARK_ALL'),
		'GROUP_HEAD' => GetMessage('GROUP_HEAD'),
		'EMPTY_GROUP' => GetMessage('EMPTY_GROUP'),
		'GROUP_NAME_OLD' => GetMessage('GROUP_NAME_OLD'),
		'GROUP_NAME_NEW' => GetMessage('GROUP_NAME_NEW'),
		'TO_GROUP' => GetMessage('TO_GROUP'),
		'PHONE_NEW_CONTACT' => GetMessage('PHONE_NEW_CONTACT'),
		'PHONE_EDIT_CONTACT' => GetMessage('PHONE_EDIT_CONTACT'),
		'PHONE_DELETE_CONTACT' => GetMessage('PHONE_DELETE_CONTACT'),
		'FREQUENTLY_USED' => GetMessage('FREQUENTLY_USED'),
		'NOT_IN_GROUP' => GetMessage('NOT_IN_GROUP'),
		'GMAIL_WRONG_EXTENSION' => GetMessage('GMAIL_WRONG_EXTENSION'),
		'OUTLOOK_WRONG_EXTENSION' => GetMessage('OUTLOOK_WRONG_EXTENSION'),
		'MAC_WRONG_EXTENSION' => GetMessage('MAC_WRONG_EXTENSION'),
	);

	$arResult['MESSAGES'] = str_replace("'","\"",CUtil::PhpToJSObject($MESSAGES));

	$lang = LANGUAGE_ID;
	$arResult['LANG'] = str_replace("'","\"",CUtil::PhpToJSObject($lang));
	//получим текущего юзера
	$userCurrentCDB = $USER->GetById($USER->GetID());
	if ($userCurrent = $userCurrentCDB->Fetch())
	{
		$arResult["USER"] = $userCurrent;
	}

	if (!CModule::IncludeModule('iblock'))
	{
		ShowError(GetMessage('NO_IB'));
		return;
	}
	else
	{
		//получим список групп
		$arSelect = array("ID", "NAME", "PROPERTY_*");
		$arFilter = array("ACTIVE"=>"Y", "IBLOCK_ID" => $groupsIblockId, "CREATED_BY" => $userCurrent['ID']);
		$arGroups = CIBlockElement::GetList(array("NAME"=>"ASC"), $arFilter, false, false, $arSelect);
		//Не в группе
		$noneGroup = array('ID' => 0, 'NAME' => GetMessage('NOT_IN_GROUP'));
		$arResult["phonebook"][0] = $noneGroup;
		while($obGroup = $arGroups->Fetch())
		{
			$arResult["phonebook"][$obGroup['ID']] = $obGroup;
		}

		//получим список номеров
		// nechal - не забываем про дополнительные группы (контакт в нескольких группах)
		$arSelect = array("ID", "NAME", "DATE_CREATE", "PROPERTY_lastname", "PROPERTY_firstname", "PROPERTY_phone", "PROPERTY_groups", "PROPERTY_recently_used", "PROPERTY_groups2");
		$arFilter = array("IBLOCK_ID" => $contactsIblockId, "CREATED_BY" => $userCurrent['ID'],"ACTIVE"=>"Y");
		$arContacts = CIBlockElement::GetList(array(), $arFilter, false, false, $arSelect);
		$tmpContacts = array();
		$tmpIndex = array();

		while($obContact = $arContacts->Fetch())
		{
			$tmpIndex[$obContact['ID']] = $obContact['PROPERTY_LASTNAME_VALUE'];
			$tmpContacts[$obContact['ID']] = $obContact;
			//echo "<pre>"; print_r($tmpContacts); echo "</pre>";
		}

		asort($tmpIndex);

		foreach($tmpIndex as $key=>$lastname)
		{
			$obContact = $tmpContacts[$key];
			if ($obContact['PROPERTY_GROUPS_VALUE'])
			{
				$obContact["GROUPS_LIST"] = array();
				$res = CIBlockElement::GetByID($obContact['PROPERTY_GROUPS_VALUE']);
				$ar_res = $res->GetNext();
				$obContact["GROUPS_LIST"][] = array("ID" => $obContact['PROPERTY_GROUPS_VALUE'], "NAME" => $ar_res['NAME']);

				foreach($obContact['PROPERTY_GROUPS2_VALUE'] as $addCont)
				{
					$res = CIBlockElement::GetByID($addCont);
					$ar_res = $res->GetNext();
					$obContact["GROUPS_LIST"][] = array("ID" => $addCont, "NAME" => $ar_res['NAME']);
				}

				$arResult["phonebook"][$obContact['PROPERTY_GROUPS_VALUE']]['contacts'][] = $obContact;
				// проверяем, есть ли у контакта дополнительные группы
				if($obContact['PROPERTY_GROUPS2_VALUE'][0])
				{
					foreach($obContact['PROPERTY_GROUPS2_VALUE'] as $addCont)
					{
						$obContact['PROPERTY_GROUPS_VALUE'] = $addCont; // заменяем группу у контакта на дополнительную

						$arResult["phonebook"][$addCont]['contacts'][] = $obContact;
					}
				}
			}
			else
			{
				$arResult["phonebook"][0]['contacts'][] = $obContact;
			}
		}
		//echo "<pre>"; print_r($arResult["phonebook"]); echo "<pre>";
	}

	$cacheName = $_SERVER["DOCUMENT_ROOT"]."/bitrix/components/sms4b/phonebook/cache/".$cacheID.".txt";
	file_put_contents($cacheName,serialize($arResult));
    return $arResult;
}