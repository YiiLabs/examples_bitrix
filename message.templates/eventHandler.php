<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

global $USER;
//идентификатор инфоблока шаблоны
$templatesIblockId = 34;
//идентификатор инфоблока группы шаблонов
$templateGroupsIblockId = 59;

$action = $_REQUEST["action"];

//для работы с шаблонами пользователь должен быть авторизован обязательно
if (!$USER->IsAuthorized()) errorAjax("ERROR:1");
//должен быть подключен модль инфоблоков
if (!CModule::IncludeModule('iblock')) errorAjax("ERROR:10");

$userId = $USER->GetID();


//добавление нового шаблона
if ($action == "AddNewTemplate")
{
	$el = new CIBlockElement;
	
	$templateName = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['name']));
	$templateDetail = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['detail']));

	//проверяем длину названия
	$nameLength = strlen($templateName);
	if ($nameLength < 2 || $nameLength > 30)
		errorAjax(GetMessage('NAME_LENGTH'), array("NAME" => $templateName));

	$PROP = array();
	
	$groupId = htmlspecialchars($_REQUEST['group']);

	//проверка, чтобы пользователь не смог добавить контакт не в свою группу
	if (!empty($groupId) && is_numeric($groupId))
	{
		if ($group = GetIblockElement($groupId, 'phonebook'))
		{
			if (($group['IBLOCK_ID'] != $templateGroupsIblockId) || ($group['CREATED_BY'] != $userId))
			{
				errorAjax(GetMessage('40_ERROR'), array("GROUP" => $group));
			}
			else
			{
				$PROP['GROUPS'] = $groupId;
			}
		}
	}
    if(strlen($_REQUEST['addGroups']) > 0)
	{
		$groupsArray = array();
		$groupsArray = explode(",",$_REQUEST['addGroups']);

		foreach($groupsArray as $addGroup)
		{
			$groupId = htmlspecialchars($addGroup);

			//проверка, чтобы пользователь не смог добавить контакт не в свою группу
			if (!empty($groupId) && is_numeric($groupId))
			{
				if ($group = GetIblockElement($groupId, 'phonebook'))
				{
					if (($group['IBLOCK_ID'] != $templateGroupsIblockId) || ($group['CREATED_BY'] != $userId))
					{
						errorAjax(GetMessage('40_ERROR'), array("GROUP2" => $groupId));
					}
					else
					{
						$PROP['GROUPS2'][] = $groupId;
					}
				}
			}
		}
	}

	$arLoadTemplateArray = array(
		"ACTIVE"			=> "Y",
		"CREATED_BY"		=> $userId,
		"IBLOCK_ID"			=> $templatesIblockId,
		"PROPERTY_VALUES"	=> $PROP,
		"NAME"				=> $templateName,
		"DETAIL_TEXT"		=> $templateDetail
	);

	if($templateId = $el->Add($arLoadTemplateArray))
		note(GetMessage('TEMPLATE_SCS_ADDED'), array('id'=>$templateId));
	else
		errorAjax(GetMessage('TEMPLATE_ADD_ERR'), array('TYPE'=>'ELEMENT_ADDING_ERROR'));
}
else if ($action == "TemplateEdit")
{
	if (!is_numeric($_REQUEST['templateId'])) errorAjax(GetMessage('TEMPLATE_ID_ERR'));
	if (!is_numeric($_REQUEST['group'])) errorAjax(GetMessage('GROUP_ID_ERR'));

	// если хотя бы одна группа = "Не в группе", то удаляем все группы и помещаем контакт в неё
	if($_REQUEST['group'] == 0)
	{
		$el = new CIBlockElement;

		$templateName = htmlspecialchars(iconv('UTF-8', 'windows-1251',$_REQUEST['name']));
		$templateDetail = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['detail']));
		
		$PROP = array();
		
		$PROP['RECENTLY_USED'] = intval($_REQUEST['recently_used']);

		//проверяем длину названия
		$nameLength = strlen($templateName);
		if ($nameLength < 2 || $nameLength > 30)
			errorAjax(GetMessage('NAME_LENGTH'), array("NAME_LENGTH" => $templateName));
	
		$templateID = $_REQUEST['templateId'];

		$arTemplates = array(
				"IBLOCK_ID"      	=> $templatesIblockId,
				"PROPERTY_VALUES"	=> $PROP,
				"NAME"				=> $templateName,
				"DETAIL_TEXT"		=> $templateDetail
		);

		$res = $el->Update($templateID, $arTemplates);
		if ($res)
		{
			$addFields = array("templateId" => $templateID, "newName" => $templateName, "newDetail" => $templateDetail, "newGroups" => 0, "recentlyUsed" => $PROP['RECENTLY_USED']);

			$addFields['groupChange'] = "Y";

			note(GetMessage('TEMPLATE_SCS_CHANGED'), $addFields);
		}
		else
		{
			errorAjax(GetMessage('TEMPLATE_REFRESH_ERR'), array("REFRESH" => $templateName));
		}
	}
	else
	{
		$resultGroups = array();
		$resultGroups[] = $_REQUEST['group'];

		// если имеются дополнительные группы
		if(strlen($_REQUEST['addGroups']) > 0)
		{
			$groupsArray = array();
			$groupsArray = explode(",",$_REQUEST['addGroups']);

			foreach($groupsArray as $addGroup)
			{
				$groupId = htmlspecialchars($addGroup);

				//проверка, чтобы пользователь не смог добавить контакт не в свою группу
				if (!empty($groupId) && is_numeric($groupId))
				{
					if ($group = GetIblockElement($groupId, 'phonebook'))
					{
						if (($group['IBLOCK_ID'] != $templateGroupsIblockId) || ($group['CREATED_BY'] != $userId))
						{
							errorAjax(GetMessage('40_ERROR'), array("ADD_GROUPS" => $groupId));
						}
						else
						{
							$resultGroups[] = $groupId;
						}
					}
				}
			}
		}
		
		$templateCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$TemplatesIblockId, "CREATED_BY" => $userId, "ID" => intval($_REQUEST["templateId"])), false, false, array());

		if (!$template = $templateCDB->GetNextElement())
		{
			errorAjax(GetMessage('FAILED_TEMPLATE_SEARCH'));
		}
		else
		{
			foreach($resultGroups as $currGroup)
			{
				//проверим группу
				if (isset($currGroup))
				{
					$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templateGroupsIblockId, "CREATED_BY" => $userId, "ID" => intval($currGroup)), false, false, array());

					if (!$group = $groupCDB->GetNextElement())
					{
						errorAjax(GetMessage('NOT_CORRECT_GROUP'), array("NOT_CORRECT_GROUP" => $currGroup));
					}
				}
			}


			$el = new CIBlockElement;

			$templateID = $_REQUEST['templateId'];
			
			$templateName = htmlspecialchars(iconv('UTF-8', 'windows-1251',$_REQUEST['name']));
			$templateDetail = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['detail']));
		
			$PROP = array();
		
			$PROP['RECENTLY_USED'] = intval($_REQUEST['recently_used']);

			//проверяем длину названия
			$nameLength = strlen($templateName);
			if ($nameLength < 2 || $nameLength > 30)
				errorAjax(GetMessage('NAME_LENGTH'), array("NAME_LENGTH2" => $templateName));

			$templateID = $_REQUEST['templateId'];  // изменяем элемент с кодом (ID) 2

			$properties = $template->GetProperty('GROUPS'); // получаем основную группу
			$properties2 = $template->GetProperty('GROUPS2'); // получаем дополнительные группы
			if($properties2['VALUE'])
				$initGroups = array_merge(array($properties['VALUE']), $properties2['VALUE']);
			else
				$initGroups = array($properties['VALUE']);

			$PROP['GROUPS'] =  intval($properties['VALUE']);
			$key = array_search($properties['VALUE'], $resultGroups); // если не будет найдена основная группа
			if($key>-1)
			{
				unset($resultGroups[$key]);
				$PROP["GROUPS2"] = $resultGroups;
			}
			else // иначе основную группу не изменили или удалили и можно просто изменить дополнительные группы
			{
				$PROP["GROUPS"] = $resultGroups[0]; // в качестве основной - первая попавшаяся
				unset($resultGroups[0]);
				//if(!empty($resultGroups))
				$PROP["GROUPS2"] = $resultGroups; // дополнительные - все остальные
			}

			$arTemplates = array(
					"IBLOCK_ID"      	=> $templatesIblockId,
					"PROPERTY_VALUES"	=> $PROP,
					"NAME"				=> $templateName,
					"DETAIL_TEXT"		=> $templateDetail
			);
			
			$res = $el->Update($templateID, $arTemplates);

			if ($res)
			{
				// в случае успешного добавления элемента, получаем окончательный массив групп
				$resultGroups = array_merge(array($PROP["GROUPS"]), $PROP["GROUPS2"]);

				$addFields = array("templateId" => $templateID, "newName" => $templateName, "newDetail" => $templateDetail, "newGroups" => $resultGroups, "recentlyUsed" => $PROP['RECENTLY_USED'], "oldGroups" => ($properties['VALUE'] == "") ? '0':$initGroups);

				$flag = true;
				if(count($initGroups) == count($resultGroups))
				{
					foreach($initGroups as $gr)
					{
						if(in_array($gr, $resultGroups))
						{
							$flag = false;
						}
						else
						{
							$flag = true;
							break;
						}
					}
				}
				if($flag)
					$addFields['groupChange'] = "Y";

				note(GetMessage('TEMPLATE_SCS_CHANGED'), $addFields);
			}
			else
			{
				errorAjax(GetMessage('TEMPLATE_REFRESH_ERR'), array("TEMPLATE_REFRESH_ERR" => $templateName));
				
			}
		}
	}
}
else if ($action == "TemplateDelete")
{
	if (!is_numeric($_REQUEST['templateId']))
		errorAjax(GetMessage('TEMPLATE_ID_ERR'));
	if (!is_numeric($_REQUEST['groupId']))
		errorAjax(GetMessage('GROUP_ID_ERR'));

	$groupFrom = intval($_REQUEST['groupId']);
	$templateID = intval($_REQUEST['templateId']);

	$templateCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templatesIblockId, "CREATED_BY" => $userId, "ID" => $templateID), false, false, array("PROPERTY_GROUPS2"));
	$template = $templateCDB->Fetch();
	if (!($template))
	{
		errorAjax(GetMessage('FAILED_TEMPLATE_SEARCH'));
	}
	else
	{
		if($groupFrom == 0)
		{
			if (CIBlockElement::Delete($templateID))
			{
				note(GetMessage('ITEM_SCS_DELETED'), array('templateId' => $templateID, 'groupId' => $groupFrom));
			}
			else
			{
				errorAjax(GetMessage('ITEM_DELETE_ERR'));
			}
		}
		else
		{
			$template["PROPERTY_GROUPS2_VALUE"] = unserialize($template["PROPERTY_GROUPS2_VALUE"]);
			$template["PROPERTY_GROUPS2_VALUE"] = $template["PROPERTY_GROUPS2_VALUE"]["VALUE"];

			$key = array_search($groupFrom, $template["PROPERTY_GROUPS2_VALUE"]); // если контакт в дополнительных группах
			if($key>-1)
			{
				unset($template["PROPERTY_GROUPS2_VALUE"][$key]);
				CIBlockElement::SetPropertyValueCode($templateID, "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
				note(GetMessage('ITEM_SCS_DELETED'), array('templateId' => $templateID, 'groupId' => $groupFrom));
			}
			else
			{
				if(empty($template["PROPERTY_GROUPS2_VALUE"])) // если у контакта нет второстепенных групп, то можно его спокойно удалять
				{
					if (CIBlockElement::Delete($templateID))
					{
						note(GetMessage('ITEM_SCS_DELETED'), array('templateId' => $templateID, 'groupId' => $groupFrom));
					}
					else
					{
						errorAjax(GetMessage('ITEM_DELETE_ERR'));
					}
				}
				else
				{
					// если контакт в основной, но имеет дополнительные группы, то нужно заменить основную одной из дополнительных
					$addGroup = array_pop($template["PROPERTY_GROUPS2_VALUE"]);
					CIBlockElement::SetPropertyValueCode($templateID, "GROUPS", $addGroup);
					CIBlockElement::SetPropertyValueCode($templateID, "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
					note(GetMessage('ITEM_SCS_DELETED'), array('templateId' => $templateID, 'groupId' => $groupFrom));
				}
			}
		}
	}
}
//добавление новой ГРУППЫ
else if ($action == "AddNewGroup")
{
	$el = new CIBlockElement;
	$PROP = array();

	$groupName = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['groupname']));
	$groupNameLen = strlen($groupName);
	if ($groupNameLen < 2 || $groupNameLen > 50)
		errorAjax(GetMessage('GROUP_NAME_LENGTH'));


	$arLoadProductArray = array(
		"ACTIVE"         => "Y",
		"MODIFIED_BY"    => $USER->GetID(),
		"IBLOCK_ID"      => $templateGroupsIblockId,
		"PROPERTY_VALUES"=> $PROP,
		"NAME"           => $groupName
	);

	if($PRODUCT_ID = $el->Add($arLoadProductArray))
		note(GetMessage('GROUP_ADDED'), array('id' => $PRODUCT_ID));
	else
		errorAjax(GetMessage('GROUP_ADD_ERR'));
}
//редактирование группы
else if ($action == "GroupEdit")
{
	if (!is_numeric($_REQUEST['groupId'])) errorAjax(GetMessage('GROUP_ID_ERR'));
	$groupName = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['groupName']));
	$groupNameLen = strlen($groupName);
	if ($groupNameLen < 2 || $groupNameLen > 50)
		errorAjax(GetMessage('GROUP_NAME_LENGTH'));

	$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templateGroupsIblockId, "CREATED_BY" => $userId, "ID" => intval($_REQUEST["groupId"])), false, false, array());

	if (!$group = $groupCDB->Fetch())
	{
		errorAjax(GetMessage('GROUP_NOT_FOUND'));
	}
	else
	{
		$el = new CIBlockElement;

		$arGroupArray = array(
			"NAME"		=> $groupName,
			"IBLOCK_ID"	=> $templateGroupsIblockId
		);

		$groupId = $_REQUEST['groupId'];

		$res = $el->Update($groupId, $arGroupArray);

		if ($res)
		{
			note(GetMessage('GROUP_NAME_CHANGED'), array('id' => $groupId, 'groupname' => $groupName));
		}
		else
		{
			errorAjax(GetMessage('GROUP_NAME_CHANGED_ERR'));
		}
	}
} // удалить группу
else if ($action == "DeleteGroup")
{
	if (!is_numeric($_REQUEST["id"]) || $_REQUEST["id"] < 0)
		errorAjax(GetMessage('GROUP_ID_ERR'));

	$g = 0;

	// если контакт находится "не в группе", то просто удаляем все контакты из этой группы
	if ($_REQUEST["id"] == 0)
	{
		$templatesInDeletedGroupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templatesIblockId, "CREATED_BY" => $userId, "PROPERTY_GROUPS" => array(false,0)), false, false, array());

		while($template = $templatesInDeletedGroupCDB->Fetch())
		{
			CIBlockElement::Delete($template["ID"]);
			$g++;
		}

		note(GetMessage('DELETED').$g.GetMessage('TEMPLATES_FROM_GROUP') , array('groupId' => 0));
	}
	else
	{
		// 1. Если полученная группа у контакта основная, то проверяем, есть ли у него дополнительные. Если есть,
		// то удаляем основную, дополнительные не трогаем. Если дополнительных групп нет, то удаляем контакт полностью
		// 2. Если у контакта полученная группа - дополнительная, то просто удаляем эту дополнительную группу.
		$deleteAddGroup = array();		// удалены из дополнительных групп
		$changedMainGroup = array();	// удален из основной и основная была изменена на одну из дополнительных
		$deleted = array();				// был полностью удален
		$counter = 0;

		$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templateGroupsIblockId, "CREATED_BY" => $userId, "ID" => intval($_REQUEST["id"])), false, false, array("ID"));
       	$group = $groupCDB->Fetch();
		if (!$group)
		{
			errorAjax(GetMessage('GROUP_NOT_FOUND'));
		}
		else
		{
			// выбираем контакты, для которых группа - дополнительная
			$templatesCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templatesIblockId, "CREATED_BY" => $userId, "PROPERTY_GROUPS2" => $group["ID"]), false, false, array("ID" , "PROPERTY_GROUPS2"));
			while($template = $templatesCDB->Fetch())
			{
				//$Template["PROPERTY_GROUPS2_VALUE"] = unserialize($Template["PROPERTY_GROUPS2_VALUE"]);
				//$Template["PROPERTY_GROUPS2_VALUE"] = $Template["PROPERTY_GROUPS2_VALUE"]["VALUE"];

				$key = array_search($group['ID'], $template["PROPERTY_GROUPS2_VALUE"]); // ищем группу контакта в дополнительных

				unset($template["PROPERTY_GROUPS2_VALUE"][$key]);
				CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
				$deleteAddGroup[] = $template["ID"];
			}

			// выбираем контакты, для которых группа - основная
			$templatesCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templatesIblockId, "CREATED_BY" => $userId, "PROPERTY_GROUPS" => $group["ID"]), false, false, array("ID", "PROPERTY_GROUPS2"));
			while($template = $templatesCDB->Fetch())
			{
				//$Template["PROPERTY_GROUPS2_VALUE"] = unserialize($Template["PROPERTY_GROUPS2_VALUE"]);
				//$Template["PROPERTY_GROUPS2_VALUE"] = $Template["PROPERTY_GROUPS2_VALUE"]["VALUE"];

				if(empty($template["PROPERTY_GROUPS2_VALUE"])) // если у контакта нет второстепенных групп, то можно его спокойно удалять
				{
					if (CIBlockElement::Delete($template['ID']))
					{
						$deleted[] = $template["ID"];
					}
					else
					{
						errorAjax(GetMessage('ITEM_DELETE_ERR'));
					}
				}
				else
				{
					// если контакт в основной, но имеет дополнительные группы, то нужно заменить основную одной из дополнительных
					$addGroup = array_pop($template["PROPERTY_GROUPS2_VALUE"]);
					CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS", $addGroup);
					CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
					$changedMainGroup[] = $template["ID"];
				}
			}

			//удалили контакы, удали и группу
			if (CIBlockElement::Delete($group["ID"]))
			{
				note(GetMessage('GROUP_DEL_SCS'), array('groupId' => $group["ID"], 'deletedFromAdditionalGroupsTemplates' => count($deleteAddGroup), 'deletedFromAdditionalGroupsTemplatesIds' => $deleteAddGroup,
													'deletedChangedMainGroupTemplates' => count($changedMainGroup), 'deletedChangedMainGroupTemplatesIds' => $changedMainGroup,
													'deletedTemplates' => count($deleted), 'deletedTemplatesIds' => $deleted));
			}
		}
	}
}
else if ($action == "AddTemplatesFromExcel")
{
	$el = new CIBlockElement;

	$artemplateArray = array(
			"ACTIVE"        => "Y",
			"CREATED_BY"    => $userId,
			"IBLOCK_ID"     => $templatesIblockId
	);

	$succesfullyAdded = 0;
	$failToAdd = 0;
   	$addedTemplates = array();

    unset($_REQUEST['templates'][0]); // убираем первую строчку
    
   	$templatesProcessed = array();
   	$templatesNamesProcessed = array();
   	$groups = array();
   	
	foreach($_REQUEST['templates'] as $arIndex)
	{
		$properties = array();
		$arIndex = str_replace(",", ";", $arIndex);
		$properties = explode(';', $arIndex);

		/* $new[0] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $properties[0]));
		$new[1] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $properties[1]));
		$new[2] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $properties[2]));
		note(GetMessage('READING_SCS'), $new); */
		
		if (!isset($properties[0]))
		{
			$failToAdd++;
			continue;
		}

		$templateName = htmlspecialchars(str_replace("\"","",iconv('UTF-8', 'windows-1251', $properties[0])));
		$templateDetail = htmlspecialchars(str_replace("\"","",iconv('UTF-8', 'windows-1251', $properties[1])));
		$fields['GROUPS'] = $properties[2] ? htmlspecialchars(str_replace("\"","",iconv('UTF-8', 'windows-1251', $properties[2]))) : '';

		if ($fields['GROUPS'] != '')
		{
			// поищем шаблон, который уже есть в массиве $templatesProcessed
			$key = array_search($templateName, $templatesNamesProcessed);
			if($key>-1) // если такое имя шаблона уже добавлялось, возможно это этот же шаблон, но в другой группе
			{   // если совпадают детальный текст, то это тот же шаблон, нужно поместить в доп. группу
				if($templateDetail == $templatesProcessed[$key]['DETAIL_TEXT'])
				{
					$templatesProcessed[$key]['GROUPS2'][] = $fields['GROUPS'];
					continue;
				}
				else
				{
					$failToAdd++;
					continue;
				}
			}
		}

		//сразу сформируем массив групп
		if ($fields['GROUPS'] != '')
		{
			$groups[] = $fields['GROUPS'];
		}
		
		$fields["NAME"] = $templateName;
		$fields["DETAIL"] = $templateDetail;

		$templatesProcessed[] = $fields;
		$templatesNamesProcessed[] = $templateName;
	}
	
	//errorAjax(GetMessage('ITEM_DELETE_ERR'), $templatesProcessed);
	
	//посмотрим есть ли уже существующие группы
	$existingGroups = array();
	$groupsCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templateGroupsIblockId, "CREATED_BY" => $userId), false, false, array());
	while($group = $groupsCDB->Fetch())
	{
		$existingGroups[$group['NAME']] = $group['ID'];
	}
	
	$newGroups = array();
	foreach($templatesProcessed as $arIndex)
	{
		
		#echo "<pre>";print_r($arIndex);echo "</pre>";
	    $groupNameLen = strlen($arIndex['GROUPS']);
	    //если группа не указана вообще
	    if ($arIndex['GROUPS'] == '' || $groupNameLen < 2 || $groupNameLen > 30 )
	    {
			$arIndex['GROUPS'] = 0;
	    }
	    else
	    {
		    if ($existingGroups[$arIndex['GROUPS']])
		    {
				$arIndex['GROUPS'] = $existingGroups[$arIndex['GROUPS']];
		    }
		    else
		    {
				//нужно создать группу
				$arLoadProductArray = array(
					"ACTIVE"         => "Y",
					"MODIFIED_BY"    => $userId,
					"IBLOCK_ID"      => $templateGroupsIblockId,
					"NAME"           => $arIndex['GROUPS']
				);
				
				if($newGroupId = $el->Add($arLoadProductArray))
				{
					$newGroups[] = array("id" => $newGroupId, "name" => $arIndex['GROUPS']);
					$existingGroups[$arIndex['GROUPS']] = $newGroupId;
					$arIndex['GROUPS'] = $newGroupId;
				}
			}

			// если у контакта есть доп. группы, то их тоже нужно будет создать
	    	if(!empty($arIndex['GROUPS2']))
	    	{
	    		foreach($arIndex['GROUPS2'] as $id => $secondaryGroup)
	    		{
					if ($existingGroups[$secondaryGroup])
				    {
						$arIndex['GROUPS2'][$id] = $existingGroups[$secondaryGroup]; // получаем айдишник
				    }
				    else
				    {
						//нужно создать группу
						$arLoadProductArray = array(
							"ACTIVE"         => "Y",
							"MODIFIED_BY"    => $userId,
							"IBLOCK_ID"      => $templateGroupsIblockId,
							"NAME"           => $secondaryGroup
						);

						if($newGroupId = $el->Add($arLoadProductArray))
						{
							$newGroups[] = array("id" => $newGroupId, "name" => $secondaryGroup);
							$existingGroups[$secondaryGroup] = $newGroupId;
							$arIndex['GROUPS2'][$id] = $newGroupId;
						}
					}
	    		}
	    	}
		}
		
		$artemplateArray["NAME"] = $arIndex["NAME"];
		$artemplateArray["DETAIL_TEXT"] = $arIndex["DETAIL"];
		
		unset($arIndex["NAME"]);
		unset($arIndex["DETAIL"]);

	    $artemplateArray['PROPERTY_VALUES'] = array();
	    $artemplateArray['PROPERTY_VALUES'] = $arIndex;
	    
	    $arIndex["NAME"] = $artemplateArray["NAME"];
	    $arIndex["DETAIL"] = $artemplateArray["DETAIL_TEXT"];

		if($newtemplateId = $el->Add($artemplateArray))
		{
			$arIndex['id'] = $newtemplateId;
			$addedTemplates[] = $arIndex;
			$succesfullyAdded++;
		}
		else
			$failToAdd++;
	}

	note(GetMessage('READING_SCS'), array('success' => $succesfullyAdded, 'fail' => $failToAdd, 'addedTemplates' => $addedTemplates , 'newGroups' => $newGroups));
}
else if ($action == "ChangeGroupForSelectedTemplates")
{
	$groupID = $_REQUEST['toGroup'];
	if(!is_numeric($groupID) || !isset($groupID)) errorAjax(GetMessage('GROUP_ID_ERR2'));

	if ($groupID != 0)
	{
		$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templateGroupsIblockId, "CREATED_BY" => $userId, "ID" => intval($groupID)), false, false, array());

		if (!$group = $groupCDB->GetNextElement())
		{
			errorAjax(GetMessage('NOT_CORRECT_GROUP'));
		}
	}
	if (!is_array($_REQUEST['templatesId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['templatesId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('TEMPLATE_ID_ERR2'));
		}
	}
	if (!is_array($_REQUEST['groupsId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['groupsId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('GROUP_ID_ERR2'));
		}
	}
	if (!is_array($_REQUEST['recently_used']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['recently_used'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('RECENTLY_USED_ERR2'));
		}
	}

    // если контакты перемещаются в "Не в группе"
	if($groupID == 0)
	{
		foreach($_REQUEST['templatesId'] as $ID)
		{
			CIBlockElement::SetPropertyValueCode($ID, "GROUPS", null);
			CIBlockElement::SetPropertyValueCode($ID, "GROUPS2", null);
			$mainChanged[] = $ID;
		}
		note(GetMessage('SUCCESS'), array('mainChanged' => count($mainChanged), 'mainChangedTemplatesIds' => $mainChanged));
	}
	else
	{
		$mainChanged = array();
		$additionalChanged = array();
		$notTouched = array();

		$counter = 0;

		while($currId = $_REQUEST['templatesId'][$counter])
		{
	        $templateCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templatesIblockId, "CREATED_BY" => $userId, "ID" => $currId), false, false, array("ID", "PROPERTY_GROUPS", "PROPERTY_GROUPS2"));
	        $template = $templateCDB->Fetch();

	        $template["PROPERTY_GROUPS_VALUE"] = empty($template["PROPERTY_GROUPS_VALUE"]) ? 0 : $template["PROPERTY_GROUPS_VALUE"];

			//$Template["PROPERTY_GROUPS2_VALUE"] = unserialize($Template["PROPERTY_GROUPS2_VALUE"]);
			//$Template["PROPERTY_GROUPS2_VALUE"] = $Template["PROPERTY_GROUPS2_VALUE"]["VALUE"];
			// если контакт перемещается из основной группы
			if($template["PROPERTY_GROUPS_VALUE"] == $_REQUEST['groupsId'][$counter])
			{
				// если дополнительных групп нет вообще, то спокойно меняем основную группу на новую
				if(empty($template["PROPERTY_GROUPS2_VALUE"]))
				{
					CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS", $groupID);
					$mainChanged[] = $template['ID'];
				}
				else // иначе анализируем: а не перемещаем ли мы контакт в группу, в которой он уже есть (среди дополнительных)
				{
					$key = array_search($groupID, $template["PROPERTY_GROUPS2_VALUE"]);
					if($key>-1)
					{
						$notTouched[] = $template['ID'];
					}
					else
					{
						CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS", $groupID);
						$mainChanged[] = $template['ID'];
					}
				}
			}
			else // контакт перемещается из дополнительной группы
			{
				$key = array_search($groupID, $template["PROPERTY_GROUPS2_VALUE"]); // если перемещаем в доп. группу
				if($key>-1 || $groupID == $template["PROPERTY_GROUPS_VALUE"])
				{
					$notTouched[] = $template['ID'];
				}
				else
				{
					$key = array_search($groupID, $template["PROPERTY_GROUPS2_VALUE"]); // ищем откуда перемещаем среди доп. групп
				    $template["PROPERTY_GROUPS2_VALUE"][$key] = $groupID;	// заменяем на ту, куда перемещаем
				    CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
					$additionalChanged[] = $template['ID'];
				}
			}

			$counter++;
		}

		note(GetMessage('SUCCESS'), array(	'mainChanged' => count($mainChanged), 'mainChangedTemplatesIds' => $mainChanged,
													'additionalChanged' => count($additionalChanged), 'additionalChangedIds' => $additionalChanged,
													'notTouched' => count($notTouched), 'notTouchedIds' => $notTouched));
	}

}
else if ($action == "AddGroupForSelectedTemplates")
{
	$groupID = intval($_REQUEST['toGroup']);
	if(!is_numeric($groupID) || !isset($groupID)) errorAjax(GetMessage('GROUP_ID_ERR2'));

	$_REQUEST['templatesId'] = array_unique($_REQUEST['templatesId']);

	if ($groupID != 0)
	{
		$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templateGroupsIblockId, "CREATED_BY" => $userId, "ID" => intval($groupID)), false, false, array());

		if (!$group = $groupCDB->GetNextElement())
		{
			errorAjax(GetMessage('NOT_CORRECT_GROUP'));
		}
	}
	if (!is_array($_REQUEST['templatesId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['templatesId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('TEMPLATE_ID_ERR2'));
		}
	}
	if (!is_array($_REQUEST['recently_used']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['recently_used'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('RECENTLY_USED_ERR2'));
		}
	}

	// проверяем, имеет ли контакт уже группу, которую мы пытаемся к нему привезать
	// если группа уже присутствует как главная или дополнительная, то ничего не делаем

	$groupAdded = array(); // контакты, к которым группа была привязана
	$notTouched = array(); // нетронутые контакты, у них уже есть эта группа

	foreach($_REQUEST['templatesId'] as $currId)
	{
		$templateCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templatesIblockId, "CREATED_BY" => $userId, "ID" => $currId), false, false, array("ID", "PROPERTY_GROUPS", "PROPERTY_GROUPS2"));
		$template = $templateCDB->Fetch();

		$key = array_search($groupID, $template["PROPERTY_GROUPS2_VALUE"]); // пытаемся найти в доп. группах
		if($key>-1 || $groupID == intval($template["PROPERTY_GROUPS_VALUE"]))
		{
			$notTouched[] = $template['ID'];
		}
		else
		{
			if(isset($template["PROPERTY_GROUPS2_VALUE"][0]))
			{
				$template["PROPERTY_GROUPS2_VALUE"][] = $groupID;
				CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
			}
			else
			{
				CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS2", $groupID);
			}

			$groupAdded[] = $template['ID'];
		}
	}

	note(GetMessage('SUCCESS'), array(	'groupAdded' => count($groupAdded), 'groupAddedTemplatesIds' => $groupAdded,
			'notTouched' => count($notTouched), 'notTouchedIds' => $notTouched));

}
else if ($action == 'DeleteSelectedTemplates')
{
	if (!is_array($_REQUEST['templatesId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['templatesId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('TEMPLATE_ID_ERR2'));
		}
	}
	if (!is_array($_REQUEST['groupsId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['groupsId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('GROUP_ID_ERR2'));
		}
	}

	$deleteAddGroup = array();		// удалены из дополнительных групп
	$changedMainGroup = array();		// удален из основной и основная была изменена на одну из дополнительных
	$deleted = array();				// был полностью удален
	$counter = 0;

	$templateCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$templatesIblockId, "CREATED_BY" => $userId, "ID" => $_REQUEST['templatesId']), false, false, array("ID", "PROPERTY_GROUPS2"));

	while($template = $templateCDB->Fetch())
	{
		if($_REQUEST['groupsId'][$counter] == 0)
		{
			if (CIBlockElement::Delete($template['ID']))
			{
				$deleted[] = $template['ID'];
			}
			else
			{
				errorAjax(GetMessage('ITEM_DELETE_ERR'));
			}
		}
		else
		{
			// --- проверка на присутствие в дополнительных группах ----
			//$Template["PROPERTY_GROUPS2_VALUE"] = unserialize($Template["PROPERTY_GROUPS2_VALUE"]);
			//$Template["PROPERTY_GROUPS2_VALUE"] = $Template["PROPERTY_GROUPS2_VALUE"]["VALUE"];

			$key = array_search($_REQUEST['groupsId'][$counter], $template["PROPERTY_GROUPS2_VALUE"]); // если контакт в дополнительных группах
			if($key>-1)
			{
				unset($template["PROPERTY_GROUPS2_VALUE"][$key]);
				CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
				$deleteAddGroup[] = $Template['ID'];
			}
			else
			{
				if(empty($template["PROPERTY_GROUPS2_VALUE"])) // если у контакта нет второстепенных групп, то можно его спокойно удалять
				{
					if (CIBlockElement::Delete($template['ID']))
					{
						$deleted[] = $template['ID'];
					}
					else
					{
						errorAjax(GetMessage('ITEM_DELETE_ERR'));
					}
				}
				else
				{
					// если контакт в основной, но имеет дополнительные группы, то нужно заменить основную одной из дополнительных
					$addGroup = array_pop($template["PROPERTY_GROUPS2_VALUE"]);
					CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS", $addGroup);
					CIBlockElement::SetPropertyValueCode($template['ID'], "GROUPS2", $template["PROPERTY_GROUPS2_VALUE"]);
					$changedMainGroup[] = $template['ID'];
				}
			}
		}
		$counter++;
	}

	note(GetMessage('DELETE_IS_COMPL'), array(	'deletedFromAdditionalGroupsTemplates' => count($deleteAddGroup), 'deletedFromAdditionalGroupsTemplatesIds' => $deleteAddGroup,
												'deletedChangedMainGroupTemplates' => count($changedMainGroup), 'deletedChangedMainGroupTemplatesIds' => $changedMainGroup,
												'deletedTemplates' => count($deleted), 'deletedTemplatesIds' => $deleted));
}
else if ($action == 'ToExcel')
{
	global $USER;
	$templates = getFromFileCache(SITE_ID.'template'.$USER->GetID());
	$csv = array("Название;Текст Шаблона;Группа");
	foreach($templates['template'] as $id => $arIndex)
		foreach($arIndex['templates'] as $template)
		{
			if(!$id)
				$arIndex['NAME'] = "";
			$csv[] = $template['NAME'].';'. $template['DETAIL_TEXT'].';'.$arIndex['NAME'];
		}
	ob_end_clean();
	header("Content-type: application/csv");
	header("Content-Disposition: attachment; filename=templates.csv");
	header("Pragma: no-cache");
	header("Expires: 0");
	echo implode("\n",$csv);
}


function errorAjax($errorText = '', $additionalFields = array())
{
	$answer['state'] = 'error';

	if ($errorText == '')
	{
		$answer['text'] = GetMessage('UNKNOWN_ERROR');
	}
	else
	{
		$answer['text'] = $errorText;
	}

	echo str_replace("'","\"",CUtil::PhpToJSObject((array_merge($answer, $additionalFields))));
	die();
}
function note($noteText = '', $additionalFields = array())
{
	$answer['state'] = 'good';

	if ($noteText == '')
	{
		$answer['text'] = GetMessage('OK');
	}
	else
	{
		$answer['text'] = $noteText;
	}

	echo str_replace("'","\"",CUtil::PhpToJSObject((array_merge($answer, $additionalFields))));
}

?>
