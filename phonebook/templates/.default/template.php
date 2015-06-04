<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>  

<div id="phonebook" title="<?=GetMessage('PHONE_BOOK')?><?=$arResult['USER']['NAME']?> <?=$arResult['USER']['LAST_NAME']?>">
	<div id="contact-load-div">
		<button id="create-user" class="ui-state-default ui-corner-all ui-button" type="button"><?=GetMessage('ADD_CONTACT')?></button>
		<button id="create-group" class="ui-state-default ui-corner-all ui-button" type="button"><?=GetMessage('ADD_GROUP')?></button>
		<!--<button id="load-contacts" class="ui-state-default ui-corner-all ui-button" type="button">«агрузить из Excel или *.csv</button>--> 
		<div id="search-block">
			<b><?=GetMessage('FIND')?></b> - <input type="text" id="contacts-search" />
			<div id = "search-result"></div>
		</div>
	</div>
	
	<div id="main-part">
		<div id="contacts">
			<div id="contacts-header">
				<span class="contacts-title"><?=GetMessage('CONTACTS')?></span>
				<div class="moveElements">
					<div class="moveElements-header"><span class="moveElements-header-text-disabled"><?=GetMessage('MOVE_TO')?></span></div>
					<div class="moveElements-body">							
						<?foreach($arResult['phonebook'] as $arIndex):?>
							<div groupId="<?=$arIndex['ID']?>"><?=$arIndex['NAME']?></div>
						<?endforeach;?>
					</div>
				</div>
				<div class="actionElements">
					<div class="actionElements-header"><span class="moveElements-header-text-disabled"><?=GetMessage('ACTS')?></span></div>
					<div class="actionElements-body">
						<div action="add"><?=GetMessage('ADD_TO_LIST')?></div>
						<div action="del"><?=GetMessage('DELETE_ITEMS')?></div>
					</div>
				</div>
				<div class="excelElements">
					<div class="excelElements-header"><span class="moveElements-header-text-enabled">Excel</span></div>
					<div class="excelElements-body">
						<span id = "contact-load-tip"></span>
						<div id="fromExcel" action="fromExcel"><?=GetMessage('FROM_EXCEL')?></div>
						<div id="toExcel" action="toExcel"><?=GetMessage('IN_EXCEL')?></div>
					</div>
				</div>
			</div>
			<div id="scroll-wrapper">
			<div id="contact-list">
				<div id="contact-list-load">
					<div class="message"><?=GetMessage('LIST_BUILDING')?></div>
				</div>
				<div groupId="1">				
					<p class = "group-header ui-widget-header">
						<span class = "recent-group ui-icon-circle-arrow-e"></span>
						<span id="recent-header"><?=GetMessage('RECENT_CONTACTS')?></span>						
					</p>
					<div class="recent-group-body">
						<table>
							<tbody>
							<?
							$recentContacts = array();
							$recentIndex = array();
							foreach($arResult["phonebook"] as $group)
								foreach($group['contacts'] as $contact)
								{
//shlo, 20.09.2011 не работает така€ проверка, нужно своЄ поле создавать с датой									
//									if((time()-strtotime($contact['DATE_CREATE']))>2592000) //мес€ц в секундах
//										continue;	
									$usedCount = intval($contact['PROPERTY_RECENTLY_USED_VALUE']);
									if($usedCount<1)
										continue;
									$recentContacts[$contact['ID']] = $contact;
									$recentIndex[$contact['ID']] = $usedCount;
								}
							arsort($recentIndex);	
							$c=0;
							foreach($recentIndex as $contactID => $usedCount)
							{
								$contact = $recentContacts[$contactID];						
								if($c==10) break;
								?>
								<tr id="<?=$contact['ID']?>" groupId="<?=$contact['PROPERTY_GROUPS_VALUE']?>" contactLastName="<?=$contact['PROPERTY_LASTNAME_VALUE']?>" contactName="<?=$contact['PROPERTY_FIRSTNAME_VALUE']?>" contactPhone="<?=$contact['PROPERTY_PHONE_VALUE']?>">
									<td><input type="checkbox" /></td>
									<td class="lastname"><?=$contact['PROPERTY_LASTNAME_VALUE']?></td>
									<td class="name" ><?=$contact['PROPERTY_FIRSTNAME_VALUE']?></td>
									<td class="phone" title="<?=$usedCount?> смс"><?=$contact['PROPERTY_PHONE_VALUE']?></td>
									<td><div class="edit-contact ui-icon-wrench"></div></td>
									<td></td>
									<td><div class="add-to-phone-list ui-icon-arrowstop-1-e"></div></td>
								</tr>
								<?
								$c++;
							}									
							?>		
							</tbody>
						</table>
					</div>
				</div>
				<?foreach($arResult['phonebook'] as $arIndex):?>
					<div id="<?=$arIndex["ID"]?>">
						<p class = "group-header ui-widget-header">
							<span class = "toggle-group ui-icon-circle-arrow-e"></span>
							<a><?=$arIndex['NAME']?></a>
							<?if ($arIndex["ID"] != 0):?><span class = "edit-group ui-icon-wrench" title="<?=GetMessage('GROUP_NAME_EDIT')?>"></span><?endif;?>
							<?if ($arIndex["ID"] != 0):?><span class = "delete-group ui-icon-close" title="<?=GetMessage('GROUP_DELETE')?>"></span><?endif;?>
							<?if ($arIndex["ID"] == 0):?><span class = "delete-group ui-icon-close" title="<?=GetMessage('GROUP_CONTACTS_DEL')?>"></span><?endif?>
							<span class = "add-all-group-numbers ui-icon-arrowstop-1-e" title="<?=GetMessage('GROUP_CONTACTS_ADD')?>"></span>
						</p>
						<div class="group-body">
							<?
							$orderedContacts = array();
							$orderedIndex = array();
							foreach($arIndex['contacts'] as $contact)
							{
								$orderedIndex[strtolower($contact['PROPERTY_LASTNAME_VALUE']).$contact['ID']] = $contact['ID'];
								$orderedContacts[$contact['ID']] = $contact;
							}
							ksort($orderedIndex);
							?>
							<table class="group-tbl-container">
								<tbody>
								<?foreach($orderedIndex as $contactID):?>
								<?$contact = $orderedContacts[$contactID];?>
								<tr id="<?=$contact['ID']?>" groupId="<?=$contact['PROPERTY_GROUPS_VALUE']?>" contactLastName="<?=$contact['PROPERTY_LASTNAME_VALUE']?>" contactName="<?=$contact['PROPERTY_FIRSTNAME_VALUE']?>" contactPhone="<?=$contact['PROPERTY_PHONE_VALUE']?>">
									<td><input type="checkbox" /></td>
									<td class="lastname"><?=$contact['PROPERTY_LASTNAME_VALUE']?></td>
									<td class="name" ><?=$contact['PROPERTY_FIRSTNAME_VALUE']?></td>
									<td class="phone" title="<?=intval($contact['PROPERTY_RECENTLY_USED_VALUE'])?> смс"><?=$contact['PROPERTY_PHONE_VALUE']?></td>
									<td><div class="edit-contact ui-icon-wrench"></div></td>
									<td><div class="delete-contact ui-icon-close"></div></td>
									<td><div class="add-to-phone-list ui-icon-arrowstop-1-e"></div></td>
								</tr>
								<?endforeach;?>		
								</tbody>
							</table>
						</div>
					</div>
				<?endforeach;?>
			</div>
			</div>
		</div>
	
		<div id="phones-list">
			<div id="phone-list-header">
				<span class="contacts-title"><?=GetMessage('NUMBERS_LIST')?></span><br />
			</div>
			<textarea id="numbers-list"></textarea>
		</div>
		<div style="clear: both;">		
	</div> 
</div> 
<!-- окошко добавлени€ контакта -->
<div id="dialog" title="<?=GetMessage('ADD_CONTACT')?>">
	<p id="contactTip"><?=GetMessage('ALL_FIELDS_REQUIRED')?></p>
	<div>
		<form charset="windows-1251">
			<fieldset>
				<label for="lastname"><?=GetMessage('SECOND_NAME')?></label>
				<input name="lastname" id="lastname" value="" class = "text ui-widget-content ui-corner-all">
				<label for="name"><?=GetMessage('NAME')?></label>
				<input name="name" id="name"  value="" class = "text ui-widget-content ui-corner-all">
				<label for="telephone"><?=GetMessage('TELEPHONE')?></label>
				<input name="telephone" id="telephone" value="" class = "text ui-widget-content ui-corner-all">
				<label for="groups"><?=GetMessage('GROUP')?></label>
				<select name="groups" id="groups" value="" class = "text ui-widget-content ui-corner-all">
					<?foreach($arResult['phonebook'] as $arIndex):?>
						<option value="<?=$arIndex['ID']?>"><?=$arIndex['NAME']?></option>
					<?endforeach;?>
				</select>
			</fieldset>
		</form>
    </div>
</div>
<!-- редактировать пользовател€-->
<div id="contact-edit">
	<p id="contactEditTip"><?=GetMessage('ALL_FIELDS_REQUIRED')?></p>
	<div>
		<form>
			<label for="edit-lastname"><?=GetMessage('SECOND_NAME')?></label>
			<input name="lastname" id="edit-lastname" value="" class = "text ui-widget-content ui-corner-all">
			<label for="edit-name"><?=GetMessage('NAME')?></label>
			<input name="name" id="edit-name"  value="" class = "text ui-widget-content ui-corner-all">
			<label for="edit-phone"><?=GetMessage('TELEPHONE')?></label>
			<input name="telephone" id="edit-phone" value="" class = "text ui-widget-content ui-corner-all">
			<label for="edit-groups"><?=GetMessage('GROUP')?></label>
			<select name="groups" id="edit-groups" value="" class = "text ui-widget-content ui-corner-all">
				<?foreach($arResult['phonebook'] as $arIndex):?>
					<option value="<?=$arIndex['ID']?>"><?=$arIndex['NAME']?></option>
				<?endforeach;?>
			</select>
			<input type="hidden" id = "contactId" />
		</form>
	</div>
</div>
<!-- окошко добавлени€ новой группы -->
<div id="group" title="<?=GetMessage('ADD_NEW_GROUP')?>">
	<p id="groupTip"><?=GetMessage('THE_FIELD_IS_REQUIRED')?></p>
	<div>
		<form charset="windows-1251">
			<fieldset>
				<label for="groupname"><?=GetMessage('GROUP_NAME')?></label>
				<input name="groupname" id="groupname" value="" class = "text ui-widget-content ui-corner-all">
			</fieldset>
		</form>
    </div>
</div>
<!-- редактировать группу-->
<div id="group-edit">
	<p id="groupEditTip"><?=GetMessage('THE_FIELD_IS_REQUIRED')?></p>
	<div>
		<form>
			<label for="edit-group-name"><?=GetMessage('GROUP_NAME')?></label>
			<input name="lastname" id="edit-group-name" value="" class = "text ui-widget-content ui-corner-all">
			<input type="hidden" id = "groupId" />
		</form>
	</div>
</div>
<!-- окошко дл€ каких-нить сообщений  -->
<div id="ajaxdialog" title="">
	<p></p>
</div>
<!-- окошко загрузки -->
<div id="ajaxloading" title="<?=GetMessage('PROCESSING')?>">
	<div id="loader-wheel"></div>
	<div id="send-info">
        <div><span id="actualSend"></span><span id="actualSendCount"></span></div>
        <div><span id="actualNotSend"></span><span id="actualNotSendCount"></span></div>
    </div>
	<p><?=GetMessage('WAIT')?></p>
</div>

<script>
$(document).ready(function() {
	var params = {};
	params.urlForAjaxRequests = '<?=$arResult['phonebookParams']['url']?>';
	params.session = '<?=$arResult['phonebookParams']['session']?>';
	params.mess = <?=$arResult['MESSAGES']?>;
	params.lang = <?=$arResult['LANG']?>;
	
	//объ€вл€ем объект
	var objClientSide = new clientSide(params);
	
		//скроллинг дл€ iPhone, iPad, Android
	var Device = {};
	
	Device.isAndroid = function() {
		var userag = navigator.userAgent.toLowerCase();
		return userag.indexOf("android") > -1;
	}
	Device.isiPhone = function() {
	   return navigator.userAgent.indexOf('iPhone') != -1;
	}
	Device.isiPod = function() {
	   return navigator.userAgent.indexOf('iPod') != -1;
	}
	Device.isiPad = function() {
	   return navigator.userAgent.indexOf('iPad') != -1;
	}
	Device.isiOS = function() {
	   return Device.isiPhone() || Device.isiPod() || Device.isiPad();
	}
	Device.isTouch = function() {
	   return Device.isiOS() || Device.isAndroid();
	}

	//if(Device.isTouch())
//	{
//		
//	}
	recentShow = true;	
	$("span#recent-header, span.recent-group").click(function(){
		if(recentShow)
		{
			$("div.recent-group-body").slideUp();
			setTimeout("recentShow = false;",500);		
		}
		else
		{
			$("div.recent-group-body").slideDown();
			setTimeout("recentShow = true;",500);
		}
	});	
	$("#scroll-wrapper").scrollTop(0);
});
</script>
<div id="phones_from_book">
<?
$phonesIndex = array();
foreach($arResult["phonebook"] as $group)
{
	foreach($group['contacts'] as $contact)
	{       
		$phonesIndex[clearPhoneNumber($contact['PROPERTY_PHONE_VALUE'])] = $contact;                          		
	}
}
	
foreach($phonesIndex as $number => $contact)
{
	echo '<div id="'.$number.'">'.$contact['PROPERTY_LASTNAME_VALUE'].' '.$contact['PROPERTY_FIRSTNAME_VALUE'].'</div>';
}	
?>
</div>
<?
function clearPhoneNumber($dirtyPhoneNumber)
{
	return ('7'.substr($dirtyPhoneNumber, -10));
}
?>