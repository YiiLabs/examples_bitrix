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
	$cacheID = SITE_ID.'template'.$USER->GetID();
	//обработчик AJAX
	if (isset($_POST['ajaxrequest']) && $_POST['ajaxrequest'] == 'Y')
	{
		//нам не нужен никакой html до компоненты, поэтому РЕСТАРТИМ БУФЕР
		$APPLICATION->RestartBuffer();
		include($_SERVER['DOCUMENT_ROOT'].$this->GetPath()."/eventHandler.php");
		buildTemplateCache($cacheID);
		die();
	}

	if($_GET['clear_cache']=='Y')
	{
		buildTemplateCache($cacheID);
	}

//	$timer = new CTimer();
//	$timer->start("total");
	if($arResult = getFromFileCache($cacheID)) //если кеш есть
	{

	}
	else //кеша нет, строим
	{
		$arResult = buildTemplateCache($cacheID);
	}
//	$timer->stop("Время формирования данных", "total");
	$this->IncludeComponentTemplate();
}


function getFromFileCache($cacheID)
{
	$cacheName = $_SERVER["DOCUMENT_ROOT"]."/bitrix/components/sms4b/message.templates/cache/".$cacheID.".txt";
	if(file_exists($cacheName))
		return unserialize(file_get_contents($cacheName));
	else
		return false;
}
/**
* формируем параметры для телефонной книги
*
*/
function buildTemplateCache($cacheID)
{
	$templatesIblockId = 34;
	$templateGroupsIblockId = 59;
	global $APPLICATION;
	global $USER;


	$arResult = array();
	$arResult['templateParams']['url'] = $APPLICATION->GetCurPage(false);
	$arResult['templateParams']['session'] = session_id();
	$MESSAGES = array(
		'NEW_GROUP' => GetMessage('NEW_GROUP'),
		'NEW_GROUP_ERR' => GetMessage('NEW_GROUP_ERR'),
		'GROUP_EDITED' => GetMessage('GROUP_EDITED'),
		'GROUP_EDIT_ERR' => GetMessage('GROUP_EDIT_ERR'),
		'GROUP' => GetMessage('GROUP'),
		'ADD_GROUP' => GetMessage('ADD_GROUP'),
		'GROUP_NAME' => GetMessage('GROUP_NAME'),
		'GROUP_DELETE' => GetMessage('GROUP_DELETE'),
		'GROUP_DELETE_NOTGROUP' => GetMessage('GROUP_DELETE_NOTGROUP'),
		'GROUP_EDIT' => GetMessage('GROUP_EDIT'),
		'GROUP_DELETED' => GetMessage('GROUP_DELETED'),
		'GROUP_DELETE_ERR' => GetMessage('GROUP_DELETE_ERR'),
		'GROUP_NO_GROUP_DELETED' => GetMessage('GROUP_NO_GROUP_DELETED'),
		'GROUP_NO_GROUP_EMPTY' => GetMessage('GROUP_NO_GROUP_EMPTY'),
		'NEW_TEMPLATE' => GetMessage('NEW_TEMPLATE'),
		'TEMPLATE_EDIT' => GetMessage('TEMPLATE_EDIT'),
		'TEMPLATE_EDITED' => GetMessage('TEMPLATE_EDITED'),
		'TEMPLATE_EDIT_ERR' => GetMessage('TEMPLATE_EDIT_ERR'),
		'TEMPLATE_DELETE_ERR' => GetMessage('TEMPLATE_DELETE_ERR'),
		'DEL_TEMPLATES_FROM_GROUP' => GetMessage('DEL_TEMPLATES_FROM_GROUP'),
		'TEMPLATE_DELETED' => GetMessage('TEMPLATE_DELETED'),
		'NEW_TEMPLATE_ADDED' => GetMessage('NEW_TEMPLATE_ADDED'),
		'TEMPLATES_MOVED' => GetMessage('TEMPLATES_MOVED'),
		'TEMPLATES_MOVED_BIG' => GetMessage('TEMPLATES_MOVED_BIG'),
		'TEMPLATES_GROUP_ADDED' => GetMessage('TEMPLATES_GROUP_ADDED'),
		'TEMPLATES_GROUP_ADDED_BIG' => GetMessage('TEMPLATES_GROUP_ADDED_BIG'),
		'TEMPLATES_DELETED' => GetMessage('TEMPLATES_DELETED'),
		'TEMPLATES_DELETED_BIG' => GetMessage('TEMPLATES_DELETED_BIG'),
		'TEMPLATE_GROUP' => GetMessage('TEMPLATE_GROUP'),
		'TEMPLATE_ADD_ERR' => GetMessage('TEMPLATE_ADD_ERR'),
		'TEMPLATES_DELETE' => GetMessage('TEMPLATES_DELETE'),
		'TEMPLATE_EDIT' => GetMessage('TEMPLATE_EDIT'),
		'NO_TEXT' => GetMessage('NO_TEXT'),
		'ALL_FIELDS' => GetMessage('ALL_FIELDS'),
		'ARE_YOU_SURE' => GetMessage('ARE_YOU_SURE'),
		'EXTENSION' => GetMessage('EXTENSION'),
		'HEAD_NAME' => GetMessage('HEAD_NAME'),
		'HEAD_DETAIL' => GetMessage('HEAD_DETAIL'),
		'DELETED' => GetMessage('DELETED'),
		'TEMPLATES' => GetMessage('TEMPLATES'),
		'DELETE_ERR' => GetMessage('DELETE_ERR'),
		'ARE_YOU_SURE_MULTIPLE' => GetMessage('ARE_YOU_SURE_MULTIPLE'),
		'FIELD_LENGTH' => GetMessage('FIELD_LENGTH'),
		'MUST_BE' => GetMessage('MUST_BE'),
		'AND' => GetMessage('AND'),
		'SUCCESS_DOWNLOAD' => GetMessage('SUCCESS_DOWNLOAD'),
		'UNSUCCESS_DOWNLOAD' => GetMessage('UNSUCCESS_DOWNLOAD'),
		'NOT_IN_GROUP' => GetMessage('NOT_IN_GROUP'),
		'NO_IB' => GetMessage('NO_IB'),
		'SUCCESS' => GetMessage('SUCCESS'),
		'ERROR' => GetMessage('ERROR'),
		'CAPTION_EXCEL' => GetMessage('CAPTION_EXCEL'),
		'ATTENTION' => GetMessage('ATTENTION'),
		'CHANGE_TEMPLATE' => GetMessage('CHANGE_TEMPLATE'),
		'DELETE_TEMPLATE' => GetMessage('DELETE_TEMPLATE'),
		'USE_TEMPLATE' => GetMessage('USE_TEMPLATE'),
		'USED1' => GetMessage('USED1'),
		'USED2' => GetMessage('USED2'),
		'TO_GROUP' => GetMessage('TO_GROUP'),
		'DELETE_LINK' => GetMessage('DELETE_LINK'),
		'EDIT_GROUP_NAME' => GetMessage('EDIT_GROUP_NAME'),
		'DELETE_GROUP' => GetMessage('DELETE_GROUP'),
		'USE_GROUP' => GetMessage('USE_GROUP'),
		'MARK_ALL' => GetMessage('MARK_ALL'),
		'EMPTY_GROUP' => GetMessage('EMPTY_GROUP'),
		'GROUP_NAME_OLD' => GetMessage('GROUP_NAME_OLD'),
		'GROUP_NAME_NEW' => GetMessage('GROUP_NAME_NEW'),
		'TEMPLATE_NAME' => GetMessage('TEMPLATE_NAME'),
		'NAME_DELETED_TEMPLATE' => GetMessage('NAME_DELETED_TEMPLATE'),
		'GROUP_HEAD' => GetMessage('GROUP_HEAD')
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
		$arSelect = array("ID", "NAME", "DETAIL_TEXT", "PROPERTY_*");
		$arFilter = array("ACTIVE"=>"Y", "IBLOCK_ID" => $templateGroupsIblockId, "CREATED_BY" => $userCurrent['ID']);
		$arGroups = CIBlockElement::GetList(array("NAME"=>"ASC"), $arFilter, false, false, $arSelect);
		//Не в группе
		$noneGroup = array('ID' => 0, 'NAME' => GetMessage('NOT_IN_GROUP'));
		$arResult["template"][0] = $noneGroup;
		while($obGroup = $arGroups->Fetch())
		{
			$arResult["template"][$obGroup['ID']] = $obGroup;
		}

		//получим список номеров
		// nechal - не забываем про дополнительные группы (контакт в нескольких группах)
		$arSelect = array("ID", "NAME", "DETAIL_TEXT", "DATE_CREATE", "PROPERTY_COUNTER", "PROPERTY_GROUPS", "PROPERTY_GROUPS2");
		$arFilter = array("IBLOCK_ID" => $templatesIblockId, "CREATED_BY" => $userCurrent['ID'], "ACTIVE"=>"Y");
		$arTemplates = CIBlockElement::GetList(array(), $arFilter, false, false, $arSelect);
		$tmpTemplates = array();
		$tmpIndex = array();

		while($obTemplate = $arTemplates->Fetch())
		{
			$tmpIndex[$obTemplate['ID']] = $obTemplate['NAME'];
			$tmpTemplates[$obTemplate['ID']] = $obTemplate;
			//echo "<pre>"; print_r($tmpTemplates); echo "</pre>";
		}

		asort($tmpIndex);

		foreach($tmpIndex as $key=>$lastname)
		{
			$obTemplate = $tmpTemplates[$key];
			if ($obTemplate['PROPERTY_GROUPS_VALUE'])
			{
				$obTemplate["GROUPS_LIST"] = array();
				$res = CIBlockElement::GetByID($obTemplate['PROPERTY_GROUPS_VALUE']);
				$ar_res = $res->GetNext();
				$obTemplate["GROUPS_LIST"][] = array("ID" => $obTemplate['PROPERTY_GROUPS_VALUE'], "NAME" => $ar_res['NAME']);

				foreach($obTemplate['PROPERTY_GROUPS2_VALUE'] as $addTemp)
				{
					$res = CIBlockElement::GetByID($addTemp);
					$ar_res = $res->GetNext();
					$obTemplate["GROUPS_LIST"][] = array("ID" => $addTemp, "NAME" => $ar_res['NAME']);
				}

				$arResult["template"][$obTemplate['PROPERTY_GROUPS_VALUE']]['templates'][] = $obTemplate;
				// проверяем, есть ли у контакта дополнительные группы
				if($obTemplate['PROPERTY_GROUPS2_VALUE'][0])
				{
					foreach($obTemplate['PROPERTY_GROUPS2_VALUE'] as $addTemp)
					{
						$obTemplate['PROPERTY_GROUPS_VALUE'] = $addTemp; // заменяем группу у контакта на дополнительную

						$arResult["template"][$addTemp]['templates'][] = $obTemplate;
					}
				}
			}
			else
			{
				$arResult["template"][0]['templates'][] = $obTemplate;
			}
		}
	}

	$cacheName = $_SERVER["DOCUMENT_ROOT"]."/bitrix/components/sms4b/message.templates/cache/".$cacheID.".txt";
	file_put_contents($cacheName,serialize($arResult));
    return $arResult;
}
?>