<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
set_time_limit(300);
global $USER;
//������������� ��������� ��������
$contactsIblockId = 22;
//id ��������� �����
$groupsIblockId = 21;

$action = $_REQUEST["action"];

//��� ������ � ���������� ������ ������������ ������ ���� ����������� �����������
if (!$USER->IsAuthorized()) errorAjax("ERROR:1");
//������ ���� ��������� ����� ����������
if (!CModule::IncludeModule('iblock')) errorAjax("ERROR:10");

$userId = $USER->GetID();


//���������� ������ ��������
if ($action == "AddNewContact")
{
	$el = new CIBlockElement;
	$PROP = array();
	$PROP['lastname'] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['lastname']));
	$PROP['firstname'] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['name']));
	$PROP['phone'] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['phone']));


	//��������� ����� �������
//	$lastnameLength = strlen($PROP['lastname']);
//	if ($lastnameLength < 2 || $lastnameLength > 30)
//		errorAjax(GetMessage('SECOND_NAME_LENGTH'));
	//��������� ����� �����
//	$nameLength = strlen($PROP['firstname']);
//	if ($nameLength < 2 || $nameLength > 30)
//		errorAjax(GetMessage('NAME_LENGTH'));
	//��������� ����� ��������
// 	$phoneLength = strlen($PROP['phone']);
// 	if ($phoneLength < 4 || $phoneLength > 15)
// 		errorAjax(GetMessage('PHONE_LENGTH'));

	$groupId = htmlspecialchars($_REQUEST['group']);

	//��������, ����� ������������ �� ���� �������� ������� �� � ���� ������
	if (!empty($groupId) && is_numeric($groupId))
	{
		if ($group = GetIblockElement($groupId, 'phonebook'))
		{
			if (($group['IBLOCK_ID'] != $groupsIblockId) || ($group['CREATED_BY'] != $userId))
			{
				errorAjax(GetMessage('40_ERROR'));
			}
			else
			{
				$PROP['groups'] = $groupId;
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

			//��������, ����� ������������ �� ���� �������� ������� �� � ���� ������
			if (!empty($groupId) && is_numeric($groupId))
			{
				if ($group = GetIblockElement($groupId, 'phonebook'))
				{
					if (($group['IBLOCK_ID'] != $groupsIblockId) || ($group['CREATED_BY'] != $userId))
					{
						errorAjax(GetMessage('40_ERROR'));
					}
					else
					{
						$PROP['groups2'][] = $groupId;
					}
				}
			}
		}
	}

	//�������� �� ������������ �����
	$contactCDB = CIblockElement::GetList(
		array(),
		array(
			"IBLOCK_ID"=>$contactsIblockId,
			"CREATED_BY" => $userId,
			"PROPERTY_phone" => $PROP['phone']

		), false, array("nPageSize" => 1), array("ID"));

	if ($contactCDB->SelectedRowsCount() > 0)
	{
		errorAjax(GetMessage('PHONE_EXIST'));
	}

	$arLoadProductArray = array(
		"ACTIVE"         => "Y",
		"CREATED_BY"    => $userId,
		"IBLOCK_ID"      => $contactsIblockId,
		"PROPERTY_VALUES"=> $PROP,
		"NAME"           => GetMessage('CONTACT_FOR_BOOK').$USER->GetFirstName()." ".$USER->GetLastName()
	);

	if($contactId = $el->Add($arLoadProductArray))
		note(GetMessage('CONTACT_SCS_ADDED'), array('id'=>$contactId));
	else
		errorAjax(GetMessage('CONTACT_ADD_ERR'));
}
//���������� ����� ������
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
		"IBLOCK_ID"      => $groupsIblockId,
		"PROPERTY_VALUES"=> $PROP,
		"NAME"           => $groupName
	);

	if($PRODUCT_ID = $el->Add($arLoadProductArray))
		note(GetMessage('GROUP_ADDED'), array('id' => $PRODUCT_ID));
	else
		errorAjax(GetMessage('GROUP_ADD_ERR'));
}
//�������������� ������
else if ($action == "GroupEdit")
{
	if (!is_numeric($_REQUEST['groupId'])) errorAjax(GetMessage('GROUP_ID_ERR'));
	$groupName = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['groupName']));
	$groupNameLen = strlen($groupName);
	if ($groupNameLen < 2 || $groupNameLen > 50)
		errorAjax(GetMessage('GROUP_NAME_LENGTH'));

	$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$groupsIblockId, "CREATED_BY" => $userId, "ID" => intval($_REQUEST["groupId"])), false, false, array());

	if (!$group = $groupCDB->Fetch())
	{
		errorAjax(GetMessage('GROUP_NOT_FOUND'));
	}
	else
	{
		$el = new CIBlockElement;

		$arGroupArray = array(
			"NAME" => $groupName,
			"IBLOCK_ID"      => $groupsIblockId
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
}
//������ ��������� �� ������
else if ($action == "FilterContactsByGroup")
{
	if (empty($_REQUEST["groupID"]))
	{
		errorAjax(GetMessage('GROUP_ID_ERR2'));
	}
	else
	{
		$groupId = htmlspecialchars($_REQUEST['groupID']);

		//��������, ����� ������������ �� ���� �������� ���� �����-�� ������ ������
		if (!empty($groupId) && is_numeric($groupId))
		{
			if ($groupId == '-1')
			{
					$arSelect = array();
					$arFilter = array("IBLOCK_ID" => $contactsIblockId, "ACTIVE"=>"Y", "CREATED_BY" =>$userId );
					$res = CIBlockElement::GetList(array("PROPERTY_lastname" => "asc"), $arFilter, false, false, $arSelect);
					while($ob = $res->GetNextElement())
					{
						$props = $ob->GetProperties();
						$element['lastname'] = $props['lastname']['VALUE'];
						$element['name'] = $props['firstname']['VALUE'];
						$element['phone'] = $props['phone']['VALUE'];
						$result[] = $element;
					}
					echo str_replace("'","\"",CUtil::PhpToJSObject($result));
					die();
			}

			if ($group = GetIblockElement($groupId, 'phonebook'))
			{
				if ($group['IBLOCK_ID'] != $groupsIblockId || $group['CREATED_BY'] != $userId)
				{
					errorAjax(GetMessage('40_ERROR'));
				}
				else
				{
					$arSelect = array();
					$arFilter = array("IBLOCK_ID" => $contactsIblockId, "ACTIVE"=>"Y", "PROPERTY_groups"=>$groupId, "CREATED_BY" =>$userId);
					$res = CIBlockElement::GetList(array("PROPERTY_lastname" => "asc"), $arFilter, false, false, $arSelect);
					while($ob = $res->GetNextElement())
					{
					/*	$arFields = $ob->GetFields();*/
						$props = $ob->GetProperties();
						/*$element["id"] = $arFields['ID'];*/
						$element['lastname'] = $props['lastname']['VALUE'];
						$element['name'] = $props['firstname']['VALUE'];
						$element['phone'] = $props['phone']['VALUE'];
						$result[] = $element;
					}
					echo str_replace("'","\"",CUtil::PhpToJSObject($result));
					die();
				}
			}
		}
	}
}
else if ($action == "DeleteGroup")
{
	if (!is_numeric($_REQUEST["id"]) || $_REQUEST["id"] < 0)
		errorAjax(GetMessage('GROUP_ID_ERR'));

	$g = 0;

	// ���� ������� ��������� "�� � ������", �� ������ ������� ��� �������� �� ���� ������
	if ($_REQUEST["id"] == 0)
	{
		$contactsInDeletedGroupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "PROPERTY_GROUPS" => array(false,0)), false, false, array());

		while($contact = $contactsInDeletedGroupCDB->Fetch())
		{
			CIBlockElement::Delete($contact["ID"]);
			$g++;
		}

		note(GetMessage('DELETED').$g.GetMessage('CONTACTS_FROM_GROUP'));
	}
	else
	{
		// 1. ���� ���������� ������ � �������� ��������, �� ���������, ���� �� � ���� ��������������. ���� ����,
		// �� ������� ��������, �������������� �� �������. ���� �������������� ����� ���, �� ������� ������� ���������
		// 2. ���� � �������� ���������� ������ - ��������������, �� ������ ������� ��� �������������� ������.
		$deleteAddGroup = array();		// ������� �� �������������� �����
		$changedMainGroup = array();	// ������ �� �������� � �������� ���� �������� �� ���� �� ��������������
		$deleted = array();				// ��� ��������� ������
		$counter = 0;

		$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$groupsIblockId, "CREATED_BY" => $userId, "ID" => intval($_REQUEST["id"])), false, false, array("ID"));
       	$group = $groupCDB->Fetch();
		if (!$group)
		{
			errorAjax(GetMessage('GROUP_NOT_FOUND'));
		}
		else
		{
			// �������� ��������, ��� ������� ������ - ��������������
			$contactsCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "PROPERTY_GROUPS2" => $group["ID"]), false, false, array("ID" , "PROPERTY_GROUPS2"));
			while($contact = $contactsCDB->Fetch())
			{
				//$contact["PROPERTY_GROUPS2_VALUE"] = unserialize($contact["PROPERTY_GROUPS2_VALUE"]);
				//$contact["PROPERTY_GROUPS2_VALUE"] = $contact["PROPERTY_GROUPS2_VALUE"]["VALUE"];

				$key = array_search($group['ID'], $contact["PROPERTY_GROUPS2_VALUE"]); // ���� ������ �������� � ��������������

				unset($contact["PROPERTY_GROUPS2_VALUE"][$key]);
				CIBlockElement::SetPropertyValueCode($contact['ID'], "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
				$deleteAddGroup[] = $contact["ID"];
			}

			// �������� ��������, ��� ������� ������ - ��������
			$contactsCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "PROPERTY_groups" => $group["ID"]), false, false, array("ID", "PROPERTY_GROUPS2"));
			while($contact = $contactsCDB->Fetch())
			{
				//$contact["PROPERTY_GROUPS2_VALUE"] = unserialize($contact["PROPERTY_GROUPS2_VALUE"]);
				//$contact["PROPERTY_GROUPS2_VALUE"] = $contact["PROPERTY_GROUPS2_VALUE"]["VALUE"];

				if(empty($contact["PROPERTY_GROUPS2_VALUE"])) // ���� � �������� ��� �������������� �����, �� ����� ��� �������� �������
				{
					if (CIBlockElement::Delete($contact['ID']))
					{
						$deleted[] = $contact["ID"];
					}
					else
					{
						errorAjax(GetMessage('ITEM_DELETE_ERR'));
					}
				}
				else
				{
					// ���� ������� � ��������, �� ����� �������������� ������, �� ����� �������� �������� ����� �� ��������������
					$addGroup = array_pop($contact["PROPERTY_GROUPS2_VALUE"]);
					CIBlockElement::SetPropertyValueCode($contact['ID'], "groups", $addGroup);
					CIBlockElement::SetPropertyValueCode($contact['ID'], "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
					$changedMainGroup[] = $contact["ID"];
				}
			}

			//������� �������, ����� � ������
			if (CIBlockElement::Delete($group["ID"]))
			{
				note(GetMessage('GROUP_DEL_SCS'), array('groupId' => $group["ID"], 'deletedFromAdditionalGroupsContacts' => count($deleteAddGroup), 'deletedFromAdditionalGroupsContactsIds' => $deleteAddGroup,
													'deletedChangedMainGroupContacts' => count($changedMainGroup), 'deletedChangedMainGroupContactsIds' => $changedMainGroup,
													'deletedContacts' => count($deleted), 'deletedContactsIds' => $deleted));
			}
		}
	}
}
else if ($action == "ContactEdit")
{
	if (!is_numeric($_REQUEST['contactId'])) errorAjax(GetMessage('CONTACT_ID_ERR'));
	if (!is_numeric($_REQUEST['group'])) errorAjax(GetMessage('GROUP_ID_ERR'));

	// ���� ���� �� ���� ������ = "�� � ������", �� ������� ��� ������ � �������� ������� � ��
	if($_REQUEST['group'] == 0)
	{
		$el = new CIBlockElement;

		$PROP = array();
		$PROP['lastname'] = htmlspecialchars(iconv('UTF-8', 'windows-1251',$_REQUEST['lastname']));
		$PROP['firstname'] =  htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['name']));
		$PROP['phone'] =  htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['phone']));
		$PROP['recently_used'] =  intval($_REQUEST['recently_used']);

		//��������� ����� �������
		//$lastnameLength = strlen($PROP['lastname']);
		//if ($lastnameLength < 2 || $lastnameLength > 30)
			//errorAjax(GetMessage('SECOND_NAME_LENGTH'));
		//��������� ����� �����
		//$nameLength = strlen($PROP['firstname']);
		//if ($nameLength < 2 || $nameLength > 30)
			//errorAjax(GetMessage('NAME_LENGTH'));
		//��������� ����� ��������
		//$phoneLength = strlen($PROP['phone']);
		//if ($nameLength < 4 || $nameLength > 15)
			//errorAjax(GetMessage('PHONE_LENGTH'));

		$contactID = $_REQUEST['contactId'];

		$arContacts = array(
			"IBLOCK_ID"      => $contactsIblockId,
			"PROPERTY_VALUES"=> $PROP,
		);

		$res = $el->Update($contactID, $arContacts);
		if ($res)
		{
			$addFields = array("contactId" => $contactID, "newLastName" => $PROP['lastname'], "newName" => $PROP['firstname'] , "newPhone" => $PROP['phone'] , "newGroups" => 0, "recentlyUsed" => $PROP['recently_used']);

			$addFields['groupChange'] = "Y";

			note(GetMessage('CONTACT_SCS_CHANGED'), $addFields);
		}
		else
		{
			errorAjax(GetMessage('CONTACT_REFRESH_ERR'));
		}
	}
	else
	{
		$resultGroups = array();
		$resultGroups[] = $_REQUEST['group'];

		// ���� ������� �������������� ������
		if(strlen($_REQUEST['addGroups']) > 0)
		{
			$groupsArray = array();
			$groupsArray = explode(",",$_REQUEST['addGroups']);

			foreach($groupsArray as $addGroup)
			{
				$groupId = htmlspecialchars($addGroup);

				//��������, ����� ������������ �� ���� �������� ������� �� � ���� ������
				if (!empty($groupId) && is_numeric($groupId))
				{
					if ($group = GetIblockElement($groupId, 'phonebook'))
					{
						if (($group['IBLOCK_ID'] != $groupsIblockId) || ($group['CREATED_BY'] != $userId))
						{
							errorAjax(GetMessage('40_ERROR'));
						}
						else
						{
							$resultGroups[] = $groupId;
						}
					}
				}
			}
		}

		$contactCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "ID" => intval($_REQUEST["contactId"])), false, false, array());

		if (!$contact = $contactCDB->GetNextElement())
		{
			errorAjax(GetMessage('FAILED_CONTACT_SEARCH'));
		}
		else
		{
			foreach($resultGroups as $currGroup)
			{
				//�������� ������
				if (isset($currGroup))
				{
					$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$groupsIblockId, "CREATED_BY" => $userId, "ID" => intval($currGroup)), false, false, array());

					if (!$group = $groupCDB->GetNextElement())
					{
						errorAjax(GetMessage('NOT_CORRECT_GROUP'));
					}
				}
			}


			$el = new CIBlockElement;

			$PROP = array();
			$PROP['lastname'] = htmlspecialchars(iconv('UTF-8', 'windows-1251',$_REQUEST['lastname']));
			$PROP['firstname'] =  htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['name']));
			$PROP['phone'] =  htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['phone']));
			$PROP['recently_used'] =  intval($_REQUEST['recently_used']);

			//��������� ����� �������
			//$lastnameLength = strlen($PROP['lastname']);
			//if ($lastnameLength < 2 || $lastnameLength > 30)
				//errorAjax(GetMessage('SECOND_NAME_LENGTH'));
			//��������� ����� �����
			//$nameLength = strlen($PROP['firstname']);
			//if ($nameLength < 2 || $nameLength > 30)
				//errorAjax(GetMessage('NAME_LENGTH'));
			//��������� ����� ��������
			//$phoneLength = strlen($PROP['phone']);
			//if ($nameLength < 4 || $nameLength > 15)
				//errorAjax(GetMessage('PHONE_LENGTH'));

			$contactID = $_REQUEST['contactId'];  // �������� ������� � ����� (ID) 2

			$properties = $contact->GetProperty('groups'); // �������� �������� ������
			$properties2 = $contact->GetProperty('groups2'); // �������� �������������� ������
			if($properties2['VALUE'])
           		$initGroups = array_merge(array($properties['VALUE']), $properties2['VALUE']);
	        else
           		$initGroups = array($properties['VALUE']);

			$PROP['groups'] =  intval($properties['VALUE']);
			$key = array_search($properties['VALUE'], $resultGroups); // ���� �� ����� ������� �������� ������
			if($key>-1)
			{
				unset($resultGroups[$key]);
				$PROP["groups2"] = $resultGroups;
			}
			else // ����� �������� ������ �� �������� ��� ������� � ����� ������ �������� �������������� ������
			{
				$PROP["groups"] = $resultGroups[0]; // � �������� �������� - ������ ����������
				unset($resultGroups[0]);
				//if(!empty($resultGroups))
				$PROP["groups2"] = $resultGroups; // �������������� - ��� ���������
			}

			$arContacts = array(
				"IBLOCK_ID"      => $contactsIblockId,
				"PROPERTY_VALUES"=> $PROP,
			);

			$res = $el->Update($contactID, $arContacts);

			if ($res)
			{
				// � ������ ��������� ���������� ��������, �������� ������������� ������ �����
				$resultGroups = array_merge(array($PROP["groups"]), $PROP["groups2"]);

				$addFields = array("contactId" => $contactID, "newLastName" => $PROP['lastname'], "newName" => $PROP['firstname'] , "newPhone" => $PROP['phone'] , "newGroups" => $resultGroups, "recentlyUsed" => $PROP['recently_used'], "oldGroups" => ($properties['VALUE'] == "") ? '0':$initGroups);

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

				note(GetMessage('CONTACT_SCS_CHANGED'), $addFields);
			}
			else
			{
				errorAjax(GetMessage('CONTACT_REFRESH_ERR'));
			}
		}
	}
}
else if ($action == "ContactDelete")
{
	if (!is_numeric($_REQUEST['contactId']))
		errorAjax(GetMessage('CONTACT_ID_ERR'));
	if (!is_numeric($_REQUEST['groupId']))
		errorAjax(GetMessage('GROUP_ID_ERR'));

	$groupFrom = intval($_REQUEST['groupId']);
	$contactID = intval($_REQUEST['contactId']);

	$contactCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "ID" => $contactID), false, false, array("PROPERTY_groups2"));
	$contact = $contactCDB->Fetch();
	if (!($contact))
	{
		errorAjax(GetMessage('FAILED_CONTACT_SEARCH'));
	}
	else
	{
		if($groupFrom == 0)
		{
			if (CIBlockElement::Delete($contactID))
			{
				note(GetMessage('ITEM_SCS_DELETED'), array('contactId' => $contactID, 'groupId' => $groupFrom));
			}
			else
			{
				errorAjax(GetMessage('ITEM_DELETE_ERR'));
			}
		}
		else
		{
			$contact["PROPERTY_GROUPS2_VALUE"] = unserialize($contact["PROPERTY_GROUPS2_VALUE"]);
			$contact["PROPERTY_GROUPS2_VALUE"] = $contact["PROPERTY_GROUPS2_VALUE"]["VALUE"];

			$key = array_search($groupFrom, $contact["PROPERTY_GROUPS2_VALUE"]); // ���� ������� � �������������� �������
			if($key>-1)
			{
				unset($contact["PROPERTY_GROUPS2_VALUE"][$key]);
				CIBlockElement::SetPropertyValueCode($contactID, "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
				note(GetMessage('ITEM_SCS_DELETED'), array('contactId' => $contactID, 'groupId' => $groupFrom));
			}
			else
			{
				if(empty($contact["PROPERTY_GROUPS2_VALUE"])) // ���� � �������� ��� �������������� �����, �� ����� ��� �������� �������
				{
					if (CIBlockElement::Delete($contactID))
					{
						note(GetMessage('ITEM_SCS_DELETED'), array('contactId' => $contactID, 'groupId' => $groupFrom));
					}
					else
					{
						errorAjax(GetMessage('ITEM_DELETE_ERR'));
					}
				}
				else
				{
					// ���� ������� � ��������, �� ����� �������������� ������, �� ����� �������� �������� ����� �� ��������������
					$addGroup = array_pop($contact["PROPERTY_GROUPS2_VALUE"]);
					CIBlockElement::SetPropertyValueCode($contactID, "groups", $addGroup);
					CIBlockElement::SetPropertyValueCode($contactID, "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
					note(GetMessage('ITEM_SCS_DELETED'), array('contactId' => $contactID, 'groupId' => $groupFrom));
				}
			}
		}
	}
}
else if ($action == "AddContactsFromExcel")
{
	$el = new CIBlockElement;

	$arContactArray = array(
			"ACTIVE"         => "Y",
			"CREATED_BY"    => $userId,
			"IBLOCK_ID"      => $contactsIblockId,
			"NAME"           => "������� ��� ����� - ".$USER->GetFirstName()." ".$USER->GetLastName()
	);

	$succesfullyAdded = 0;
	$failToAdd = 0;
	$errText = '';
   	$addedContacts = array();

   	$contactCDB = CIblockElement::GetList(
		array(),
		array(
			"IBLOCK_ID"=>$contactsIblockId,
			"CREATED_BY" => $userId
		), false, false, array("ID", "PROPERTY_phone"));

	while($contact = $contactCDB->Fetch())
	{
		$contact['PROPERTY_PHONE_VALUE'] = str_replace(Array(" ", "-"), "", $contact['PROPERTY_PHONE_VALUE']); // ������� ������ ������� ��� ���� ���������
		CIBlockElement::SetPropertyValueCode($contact['ID'], "phone", $contact['PROPERTY_PHONE_VALUE']); // ��������� �������
		$phones[] = $contact['PROPERTY_PHONE_VALUE'];
	}

   	$contactsProcessed = array();
   	$contactsPhonesProcessed = array();
   	$groups = array();
	foreach($_REQUEST['contacts'] as $arIndex)
	{
		$properties = array();
		$arIndex = str_replace(",", ";", $arIndex);
		$properties = explode(';', $arIndex);
		if (!isset($properties[0]) && !isset($properties[1]) && !isset($properties[2]))
		{
			$failToAdd++;
			$errText .= '������ ������<br>';
			continue;
		}


		$fields['phone'] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $properties[0]));
		$fields['phone'] = str_replace(Array(" ", "-"), "", $fields['phone']); // ������� ������ �������
		if (in_array($fields['phone'], $phones))
		{
			$failToAdd++;
			$errText .= '��� ��������<br>';
			continue;
		}

		$fields['lastname'] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $properties[1]));
		$fields['firstname'] = htmlspecialchars(iconv('UTF-8', 'windows-1251', $properties[2]));
		$fields['groups'] = $properties[3] ? htmlspecialchars(iconv('UTF-8', 'windows-1251', $properties[3])) : '';

		if ($fields['groups'] != '')
		{
			// ������ �������, ������� ��� ���� � ������� ������� $contactsProcessed
			$key = array_search($fields['phone'], $contactsPhonesProcessed);
			if($key>-1) // ���� ����� ����� ��� ����������, �������� ��� ���� �� �������, �� � ������ ������
			{   // ���� ��������� ��� � �������, �� ��� ��� �� �������, ����� ��������� � ���. ������
				if($fields['firstname'] == $contactsProcessed[$key]['firstname'] && $fields['lastname'] == $contactsProcessed[$key]['lastname'])
				{
					$contactsProcessed[$key]['groups2'][] = $fields['groups'];
					continue;
				}
				else
				{
					$failToAdd++;
					$errText .= '��� ��������<br>';
					continue;
				}
			}
		}

		//����� ���������� ������ �����
		if ($fields['groups'] != '')
		{
			$groups[] = $fields['groups'];
		}

		$contactsProcessed[] = $fields;
		$contactsPhonesProcessed[] = $fields['phone'];
	}

	//��������� ���� �� ��� ������������ ������
	$existingGroups = array();
	$groupsCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$groupsIblockId, "CREATED_BY" => $userId), false, false, array());
	while($group = $groupsCDB->Fetch())
	{
		$existingGroups[$group['NAME']] = $group['ID'];
	}

	$newGroups = array();
	foreach($contactsProcessed as &$arIndex)
	{
	    $groupNameLen = strlen($arIndex['groups']);
	    //���� ������ �� ������� ������
	    if ($arIndex['groups'] == '' || $groupNameLen < 2 || $groupNameLen > 30 )
	    {
			$arIndex['groups'] = 0;
	    }
	    else
	    {
		    if ($existingGroups[$arIndex['groups']])
		    {
				$arIndex['groups'] = $existingGroups[$arIndex['groups']];
		    }
		    else
		    {
				//����� ������� ������
				$arLoadProductArray = array(
					"ACTIVE"         => "Y",
					"MODIFIED_BY"    => $userId,
					"IBLOCK_ID"      => $groupsIblockId,
					"NAME"           => $arIndex['groups']
				);

				if($newGroupId = $el->Add($arLoadProductArray))
				{
					$newGroups[] = array("id" => $newGroupId, "name" => $arIndex['groups']);
					$existingGroups[$arIndex['groups']] = $newGroupId;
					$arIndex['groups'] = $newGroupId;
				}
			}

			// ���� � �������� ���� ���. ������, �� �� ���� ����� ����� �������
	    	if(!empty($arIndex['groups2']))
	    	{
	    		foreach($arIndex['groups2'] as $id => $secondaryGroup)
	    		{
					if ($existingGroups[$secondaryGroup])
				    {
						$arIndex['groups2'][$id] = $existingGroups[$secondaryGroup]; // �������� ��������
				    }
				    else
				    {
						//����� ������� ������
						$arLoadProductArray = array(
							"ACTIVE"         => "Y",
							"MODIFIED_BY"    => $userId,
							"IBLOCK_ID"      => $groupsIblockId,
							"NAME"           => $secondaryGroup
						);

						if($newGroupId = $el->Add($arLoadProductArray))
						{
							$newGroups[] = array("id" => $newGroupId, "name" => $secondaryGroup);
							$existingGroups[$secondaryGroup] = $newGroupId;
							$arIndex['groups2'][$id] = $newGroupId;
						}
					}
	    		}
	    	}
		}

	    $arContactArray['PROPERTY_VALUES'] = array();
	    $arContactArray['PROPERTY_VALUES'] = $arIndex;

		if($newContactId = $el->Add($arContactArray))
		{
			$arIndex['id'] = $newContactId;
			$addedContacts[] = $arIndex;
			$succesfullyAdded++;
		}
		else
		{
			$failToAdd++;
			$errText .= $el->LAST_ERROR.'<br>';
		}
	}

	note(GetMessage('READING_SCS'), array('success' => $succesfullyAdded, 'fail' => $failToAdd,  'failText' => $errText, 'addedContacts' => $addedContacts , 'newGroups' => $newGroups));
}
else if ($action == "ChangeGroupForSelectedContacts")
{
	$groupID = $_REQUEST['toGroup'];
	if(!is_numeric($groupID) || !isset($groupID)) errorAjax(GetMessage('GROUP_ID_ERR2'));

	if ($groupID != 0)
	{
		$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$groupsIblockId, "CREATED_BY" => $userId, "ID" => intval($groupID)), false, false, array());

		if (!$group = $groupCDB->GetNextElement())
		{
			errorAjax(GetMessage('NOT_CORRECT_GROUP'));
		}
	}
	if (!is_array($_REQUEST['contactsId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['contactsId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('CONTACT_ID_ERR2'));
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

    // ���� �������� ������������ � "�� � ������"
	if($groupID == 0)
	{
		foreach($_REQUEST['contactsId'] as $ID)
		{
			CIBlockElement::SetPropertyValueCode($ID, "groups", null);
			CIBlockElement::SetPropertyValueCode($ID, "groups2", null);
			$mainChanged[] = $ID;
		}
		note(GetMessage('SUCCESS'), array('mainChanged' => count($mainChanged), 'mainChangedContactsIds' => $mainChanged));
	}
	else
	{
		$mainChanged = array();
		$additionalChanged = array();
		$notTouched = array();

		$counter = 0;

		while($currId = $_REQUEST['contactsId'][$counter])
		{
	        $contactCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "ID" => $currId), false, false, array("ID", "PROPERTY_groups", "PROPERTY_groups2"));
	        $contact = $contactCDB->Fetch();

	        $contact["PROPERTY_GROUPS_VALUE"] = empty($contact["PROPERTY_GROUPS_VALUE"]) ? 0 : $contact["PROPERTY_GROUPS_VALUE"];

			//$contact["PROPERTY_groups2_VALUE"] = unserialize($contact["PROPERTY_groups2_VALUE"]);
			//$contact["PROPERTY_groups2_VALUE"] = $contact["PROPERTY_groups2_VALUE"]["VALUE"];
			// ���� ������� ������������ �� �������� ������
			if($contact["PROPERTY_GROUPS_VALUE"] == $_REQUEST['groupsId'][$counter])
			{
				// ���� �������������� ����� ��� ������, �� �������� ������ �������� ������ �� �����
				if(empty($contact["PROPERTY_GROUPS2_VALUE"]))
				{
					CIBlockElement::SetPropertyValueCode($contact['ID'], "groups", $groupID);
					$mainChanged[] = $contact['ID'];
				}
				else // ����� �����������: � �� ���������� �� �� ������� � ������, � ������� �� ��� ���� (����� ��������������)
				{
					$key = array_search($groupID, $contact["PROPERTY_GROUPS2_VALUE"]);
					if($key>-1)
					{
						$notTouched[] = $contact['ID'];
					}
					else
					{
						CIBlockElement::SetPropertyValueCode($contact['ID'], "groups", $groupID);
						$mainChanged[] = $contact['ID'];
					}
				}
			}
			else // ������� ������������ �� �������������� ������
			{
				$key = array_search($groupID, $contact["PROPERTY_GROUPS2_VALUE"]); // ���� ���������� � ���. ������
				if($key>-1 || $groupID == $contact["PROPERTY_GROUPS2_VALUE"])
				{
					$notTouched[] = $contact['ID'];
				}
				else
				{
					$key = array_search($groupID, $contact["PROPERTY_GROUPS2_VALUE"]); // ���� ������ ���������� ����� ���. �����
				    $contact["PROPERTY_GROUPS2_VALUE"][$key] = $groupID;	// �������� �� ��, ���� ����������
				    CIBlockElement::SetPropertyValueCode($contact['ID'], "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
					$additionalChanged[] = $contact['ID'];
				}
			}

			$counter++;
		}

		note(GetMessage('SUCCESS'), array(	'mainChanged' => count($mainChanged), 'mainChangedContactsIds' => $mainChanged,
													'additionalChanged' => count($additionalChanged), 'additionalChangedIds' => $additionalChanged,
													'notTouched' => count($notTouched), 'notTouchedIds' => $notTouched));
	}

}
else if ($action == "AddGroupForSelectedContacts")
{
	$groupID = intval($_REQUEST['toGroup']);
	if(!is_numeric($groupID) || !isset($groupID)) errorAjax(GetMessage('GROUP_ID_ERR2'));

	$_REQUEST['contactsId'] = array_unique($_REQUEST['contactsId']);

	if ($groupID != 0)
	{
		$groupCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$groupsIblockId, "CREATED_BY" => $userId, "ID" => intval($groupID)), false, false, array());

		if (!$group = $groupCDB->GetNextElement())
		{
			errorAjax(GetMessage('NOT_CORRECT_GROUP'));
		}
	}
	if (!is_array($_REQUEST['contactsId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['contactsId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('CONTACT_ID_ERR2'));
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

	// ���������, ����� �� ������� ��� ������, ������� �� �������� � ���� ���������
	// ���� ������ ��� ������������ ��� ������� ��� ��������������, �� ������ �� ������

	$groupAdded = array(); // ��������, � ������� ������ ���� ���������
	$notTouched = array(); // ���������� ��������, � ��� ��� ���� ��� ������

	foreach($_REQUEST['contactsId'] as $currId)
	{
		$contactCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "ID" => $currId), false, false, array("ID", "PROPERTY_groups", "PROPERTY_groups2"));
		$contact = $contactCDB->Fetch();

		$key = array_search($groupID, $contact["PROPERTY_GROUPS2_VALUE"]); // �������� ����� � ���. �������
		if($key>-1 || $groupID == intval($contact["PROPERTY_GROUPS2_VALUE"]))
		{
			$notTouched[] = $contact['ID'];
		}
		else
		{
			if(isset($contact["PROPERTY_GROUPS2_VALUE"][0]))
			{
				$contact["PROPERTY_GROUPS2_VALUE"][] = $groupID;
				CIBlockElement::SetPropertyValueCode($contact['ID'], "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
			}
			else
			{
				CIBlockElement::SetPropertyValueCode($contact['ID'], "groups2", $groupID);
			}

			$groupAdded[] = $contact['ID'];
		}
	}

	note(GetMessage('SUCCESS'), array(	'groupAdded' => count($groupAdded), 'groupAddedContactsIds' => $groupAdded,
			'notTouched' => count($notTouched), 'notTouchedIds' => $notTouched));

}
else if ($action == 'DeleteSelectedContacts')
{
	if (!is_array($_REQUEST['contactsId']))
	{
		errorAjax(GetMessage('NOT_ARRAY'));
	}
	foreach($_REQUEST['contactsId'] as $arIndex)
	{
		if (!is_numeric($arIndex))
		{
			errorAjax(GetMessage('CONTACT_ID_ERR2'));
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

	$deleteAddGroup = array();		// ������� �� �������������� �����
	$changedMainGroup = array();		// ������ �� �������� � �������� ���� �������� �� ���� �� ��������������
	$deleted = array();				// ��� ��������� ������
	$counter = 0;

	$contactCDB = CIblockElement::GetList(array(), array("IBLOCK_ID"=>$contactsIblockId, "CREATED_BY" => $userId, "ID" => $_REQUEST['contactsId']), false, false, array("ID", "PROPERTY_groups2"));

	while($contact = $contactCDB->Fetch())
	{
		if($_REQUEST['groupsId'][$counter] == 0)
		{
			if (CIBlockElement::Delete($contact['ID']))
			{
				$deleted[] = $contact['ID'];
			}
			else
			{
				errorAjax(GetMessage('ITEM_DELETE_ERR'));
			}
		}
		else
		{
			// --- �������� �� ����������� � �������������� ������� ----
			//$contact["PROPERTY_groups2_VALUE"] = unserialize($contact["PROPERTY_groups2_VALUE"]);
			//$contact["PROPERTY_groups2_VALUE"] = $contact["PROPERTY_groups2_VALUE"]["VALUE"];

			$key = array_search($_REQUEST['groupsId'][$counter], $contact["PROPERTY_GROUPS2_VALUE"]); // ���� ������� � �������������� �������
			if($key>-1)
			{
				unset($contact["PROPERTY_GROUPS2_VALUE"][$key]);
				CIBlockElement::SetPropertyValueCode($contact['ID'], "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
				$deleteAddGroup[] = $contact['ID'];
			}
			else
			{
				if(empty($contact["PROPERTY_GROUPS2_VALUE"])) // ���� � �������� ��� �������������� �����, �� ����� ��� �������� �������
				{
					if (CIBlockElement::Delete($contact['ID']))
					{
						$deleted[] = $contact['ID'];
					}
					else
					{
						errorAjax(GetMessage('ITEM_DELETE_ERR'));
					}
				}
				else
				{
					// ���� ������� � ��������, �� ����� �������������� ������, �� ����� �������� �������� ����� �� ��������������
					$addGroup = array_pop($contact["PROPERTY_GROUPS2_VALUE"]);
					CIBlockElement::SetPropertyValueCode($contact['ID'], "groups", $addGroup);
					CIBlockElement::SetPropertyValueCode($contact['ID'], "groups2", $contact["PROPERTY_GROUPS2_VALUE"]);
					$changedMainGroup[] = $contact['ID'];
				}
			}
		}
		$counter++;
	}

	note(GetMessage('DELETE_IS_COMPL'), array(	'deletedFromAdditionalGroupsContacts' => count($deleteAddGroup), 'deletedFromAdditionalGroupsContactsIds' => $deleteAddGroup,
												'deletedChangedMainGroupContacts' => count($changedMainGroup), 'deletedChangedMainGroupContactsIds' => $changedMainGroup,
												'deletedContacts' => count($deleted), 'deletedContactsIds' => $deleted));
}
else if ($action == 'search')
{
	$strSearch = htmlspecialchars(iconv('UTF-8', 'windows-1251', $_REQUEST['strSearch']));
	$result = array();

	if ($strSearch == '')
	{
		note(GetMessage('SEARCH_IS_COMPL'), array('result' => $result));
	}

	$contactCDB = CIblockElement::GetList(
		array(),
		array(
			"IBLOCK_ID"=>$contactsIblockId,
			"CREATED_BY" => $userId,
			array(
				"LOGIC" => "OR",
				array("?PROPERTY_lastname" =>  $strSearch),
				array("?PROPERTY_firstname" => $strSearch),
				array("?PROPERTY_phone" => $strSearch)
			)
		), false, array("nPageSize" => 10), array("ID", "PROPERTY_lastname", "PROPERTY_firstname", "PROPERTY_phone", "PROPERTY_group"));

	while($contact = $contactCDB->Fetch())
	{
		$contact['PROPERTY_lastname_VALUE'] = str_ireplace($strSearch, '<b>'.$strSearch.'</b>', $contact['PROPERTY_lastname_VALUE']);
		$contact['PROPERTY_firstname_VALUE'] = str_ireplace($strSearch, '<b>'.$strSearch.'</b>', $contact['PROPERTY_firstname_VALUE']);
		$contact['PROPERTY_phone_VALUE'] = str_ireplace($strSearch, '<b>'.$strSearch.'</b>', $contact['PROPERTY_phone_VALUE']);
		$result[] = $contact;
	}

	note(GetMessage('SEARCH_IS_COMPL'), array('result' => $result));
}
else if ($action == "LoadContactsToGroup")
{
	if (!is_numeric($_REQUEST["groupId"]))
	{
		errorAjax('��� ����� ������');
	}

	$groupId = intval($_REQUEST["groupId"]);
	if ($groupId == 0)
	{
		$groupId = false;
	}

	$arSelect = array();
	$arFilter = array("IBLOCK_ID" => $contactsIblockId, "ACTIVE"=>"Y", "PROPERTY_groups"=>$groupId, "CREATED_BY" =>$userId);
	$res = CIBlockElement::GetList(array("PROPERTY_lastname" => "asc"), $arFilter, false, false, $arSelect);
	while($ob = $res->GetNextElement())
	{
		$arFields = $ob->GetFields();
		$props = $ob->GetProperties();
		/*$element["id"] = $arFields['ID'];*/
		$element["id"] = $arFields["ID"];
		$element['lastname'] = $props['lastname']['VALUE'];
		$element['name'] = $props['firstname']['VALUE'];
		$element['phone'] = $props['phone']['VALUE'];
		$result[] = $element;
	}

	echo str_replace("'","\"",CUtil::PhpToJSObject($result));
	die();
}
else if ($action == 'ToExcel')
{
	global $USER;
	$book = getFromFileCache(SITE_ID.'phonebook'.$USER->GetID());
	$csv = array("�����;�������;���;������");
	foreach($book['phonebook'] as $id => $arIndex)
		foreach($arIndex['contacts'] as $contact)
		{
			if(!$id)
				$arIndex['NAME'] = "";
			$csv[] = $contact['PROPERTY_PHONE_VALUE'].';'.$contact['PROPERTY_LASTNAME_VALUE'].';'.$contact['PROPERTY_FIRSTNAME_VALUE'].';'.$arIndex['NAME'];
		}
	ob_end_clean();
	header("Content-type: application/csv");
	header("Content-Disposition: attachment; filename=phonebook.csv");
	header("Pragma: no-cache");
	header("Expires: 0");
	echo implode("\n",$csv);
}

function errorAjax($errorText = '')
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

	echo str_replace("'","\"",CUtil::PhpToJSObject($answer));
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
