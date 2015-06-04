<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>
<?
/* Добавляем стили и скрипты для таблиц */
$APPLICATION->AddHeadScript("/bitrix/js/jquery.dataTables.js");
?>
<div id="phonebook">
	<div id="search-block">
		<?=GetMessage('FIND')?>
		: <input type="text" id="contacts-search" />
		<table id="search-result"></table>
	</div>
	<div id="contact-load-div">
		<button id="create-user"
			class="ui-state-default ui-corner-all ui-button" type="button">
			<?=GetMessage('ADD_CONTACT')?>
		</button>
<!-- окошко добавления контакта -->
		<div id="dialog" title="<?=GetMessage('ADD_CONTACT')?>">
			<div>
				<form charset="windows-1251">
					<fieldset>
						<label for="lastname"><?=GetMessage('SECOND_NAME')?> </label> <input
							name="lastname" id="lastname" value=""
							class="text ui-widget-content ui-corner-all"> <label for="name"><?=GetMessage('NAME')?>
						</label> <input name="name" id="name" value=""
							class="text ui-widget-content ui-corner-all"> <label
							for="telephone"><?=GetMessage('TELEPHONE')?>*</label> <input
							name="telephone" id="telephone" value=""
							class="text ui-widget-content ui-corner-all"> <label for="groups"><?=GetMessage('GROUP')?>
						</label> <select name="groups" id="groups" value=""
							class="text ui-widget-content ui-corner-all">
							<?foreach($arResult['phonebook'] as $arIndex):?>
							<option value="<?=$arIndex['ID']?>">
								<?=$arIndex['NAME']?>
							</option>
							<?endforeach;?>
						</select>
					</fieldset>
				</form>
			</div>
		</div>		
		<button id="sendto" action="add"
			class="ui-state-default ui-corner-all ui-button" type="button">
			<?=GetMessage('ADD_TO_LIST')?>
		</button>

		<div id="contacts-header">
			<div class="moveElements">
				<div class="moveElements-header">
					<span class="moveElements-header-text-disabled"><?=GetMessage('MOVE_TO')?>
					</span>
				</div>
				<div class="moveElements-body">
					<?foreach($arResult['phonebook'] as $arIndex):?>
					<div groupId="<?=$arIndex['ID']?>">
						<?=$arIndex['NAME']?>
					</div>
					<?endforeach;?>
				</div>
			</div>
			<div class="actionElements">
				<div class="actionElements-header">
					<span class=""><?=GetMessage('ACTS')?> </span>
				</div>
				<div class="actionElements-body">
					<?/*<div id="fromExcel" action="fromExcel">
						<?=GetMessage('FROM_EXCEL')?>
						<span id="contact-load-tip"></span>
					</div>
					<div id="toExcel" action="toExcel">
						<?=GetMessage('IN_EXCEL')?>
					</div> */?>
					<div action="del">
						<?=GetMessage('DELETE_ITEMS')?>
					</div>
				</div>
			</div>
		</div>
		<!--<button id="load-contacts" class="ui-state-default ui-corner-all ui-button" type="button">Загрузить из Excel или *.csv</button>-->

	</div>
	<div class="clear"></div>
	<div id="main-part">
		<div id="contacts">

			<div id="contact-list">
				<div id="contact-list-load">
					<div class="message">
						<?=GetMessage('LIST_BUILDING')?>
					</div>
				</div>
				<div class="grouplist">
					<div id="newgroup">
						<button id="create-group"
							class="ui-state-default ui-corner-all ui-button" type="button">
							<?=GetMessage('ADD_GROUP')?>
						</button>
					</div>
					<div class="groupcontent">
					<div id="group-1" class="group-number">
						<div class="group-body">
							<div class="group-select-all">
								<input title="Отметить все" type="checkbox" class="selectall" />
							</div>
							<h3>
								<?=GetMessage('RECENT_CONTACTS')?>
							</h3>
							<table class="group-tbl-container">
								<tbody>
									<?
									$recentContacts = array();
									$recentIndex = array();
									foreach($arResult["phonebook"] as $group)
										foreach($group['contacts'] as $contact)
										{
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
									<tr id="<?=$contact['ID']?>"
										groupId="<?=$contact['PROPERTY_GROUPS_VALUE']?>"
										contactLastName="<?=$contact['PROPERTY_LASTNAME_VALUE']?>"
										contactName="<?=$contact['PROPERTY_FIRSTNAME_VALUE']?>"
										contactPhone="<?=$contact['PROPERTY_PHONE_VALUE']?>">
										<td class="chkbox"><input type="checkbox" /></td>
										<td class="lastname"><?=$contact['PROPERTY_LASTNAME_VALUE']?>
										</td>
										<td class="name"><?=$contact['PROPERTY_FIRSTNAME_VALUE']?></td>
										<td class="phone" title="<?=$usedCount?> смс"><?=$contact['PROPERTY_PHONE_VALUE']?>
										</td>
										<td></td>
										<td></td>
										<td><div class="send-contact ui-icon ui-icon-mail-closed"
												title="<?=GetMessage('SEND_CONTACT')?>"></div></td>
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
					<div id="group-<?=$arIndex["ID"]?>" class="group-number">
						<div class="group-body">
							<div class="group-select-all">
								<input title="Отметить все" type="checkbox" class="selectall" />
							</div>
							<?if($arIndex["ID"]==0):?>
							<h3>
								<?=$arIndex['NAME']?>
							</h3>
							<?else:?>
							<h3>
								Группа &laquo;
								<?=$arIndex['NAME']?>
								&raquo;
							</h3>
							<?endif;?>
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
							<?//if(count($orderedIndex) > 0):?>
							<table class="group-tbl-containerv contacts-table">
								<thead>
									<tr>
										<th class="not-sort-col"></th>
										<th class="sort-col"><?=GetMessage('HEAD_CONTACTS_LASTNAME')?>
										</th>
										<th class="sort-col"><?=GetMessage('HEAD_CONTACTS_NAME')?></th>
										<th class="sort-col"><?=GetMessage('HEAD_CONTACTS_PHONE')?></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
									</tr>
								</thead>
								<tbody>
									<?foreach($orderedIndex as $contactID):?>
									<?$contact = $orderedContacts[$contactID];?>
									<tr class="searchable" id="<?=$contact['ID']?>"
										groupId="<?=intval($contact['PROPERTY_GROUPS_VALUE'])?>"
										contactLastName="<?=$contact['PROPERTY_LASTNAME_VALUE']?>"
										contactName="<?=$contact['PROPERTY_FIRSTNAME_VALUE']?>"
										contactPhone="<?=$contact['PROPERTY_PHONE_VALUE']?>">
										<td class="chkbox"><input type="checkbox" /></td>
										<td class="lastname"><?=$contact['PROPERTY_LASTNAME_VALUE']?>
										</td>
										<td class="name"><?=$contact['PROPERTY_FIRSTNAME_VALUE']?></td>
										<td class="phone"
											title="<?=intval($contact['PROPERTY_RECENTLY_USED_VALUE'])?> смс"><?=$contact['PROPERTY_PHONE_VALUE']?>
										</td>
										<td><div class="edit-contact ui-icon ui-icon-pencil"
												title="<?=GetMessage('EDIT_CONTACT')?>"></div></td>
										<td><div class="delete-contact ui-icon ui-icon-close"
												title="<?=GetMessage('DEL_CONTACT')?>"></div></td>
										<td><div class="send-contact ui-icon ui-icon-mail-closed"
												title="<?=GetMessage('SEND_CONTACT')?>"></div></td>
									</tr>
									<?endforeach;?>
								</tbody>
								<tfoot>
									<tr>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"><?=GetMessage('HEAD_CONTACTS_LASTNAME')?>
										</th>
										<th class="not-sort-col"><?=GetMessage('HEAD_CONTACTS_NAME')?>
										</th>
										<th class="not-sort-col"><?=GetMessage('HEAD_CONTACTS_PHONE')?>
										</th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
									</tr>
								</tfoot>
							</table>
							<?//endif;?>
						</div>
					</div>
					<?endforeach;?>
				</div>					
			</div>		
					<div class="groups-list">
					<div id="1">
						<p class="group-header">
							<a class="group-current"><?=GetMessage('RECENT_CONTACTS')?> </a>
						</p>
					</div>
					<?foreach($arResult['phonebook'] as $arIndex):?>
					<div id="<?=$arIndex["ID"]?>">
						<p class="group-header">
							<a <?=($arIndex["ID"]==0 ? '' : '')?>><?=$arIndex['NAME']?> </a>
							<?if ($arIndex["ID"] != 0):?>
							<span class="edit-group ui-icon ui-icon-pencil"
								title="<?=GetMessage('GROUP_NAME_EDIT')?>"></span>
							<?endif;?>
							<?if ($arIndex["ID"] != 0):?>
							<span class="delete-group ui-icon ui-icon-close"
								title="<?=GetMessage('GROUP_DELETE')?>"></span>
							<?endif;?>
							<?if ($arIndex["ID"] == 0):?>
							<span class="delete-group ui-icon ui-icon-close"
								title="<?=GetMessage('GROUP_CONTACTS_DEL')?>"></span>
							<?endif?>
							<a href="index.php?addfromgroup=<?=$arIndex["ID"]?>"
								class="add-all-group-numbers ui-icon ui-icon-mail-closed"
								title="<?=GetMessage('GROUP_CONTACTS_ADD')?>"></a>
						</p>
					</div>
					<?endforeach;?>
					</div>
				</div>
			
		</div>
	</div>
</div>

<!-- редактировать пользователя-->
<div id="contact-edit">
	<div>
		<form>
			<label for="edit-lastname"><?=GetMessage('SECOND_NAME')?> </label> <input
				name="lastname" id="edit-lastname" value=""
				class="text ui-widget-content ui-corner-all"> <label for="edit-name"><?=GetMessage('NAME')?>
			</label> <input name="name" id="edit-name" value=""
				class="text ui-widget-content ui-corner-all"> <label
				for="edit-phone"><?=GetMessage('TELEPHONE')?>*</label> <input
				name="telephone" id="edit-phone" value=""
				class="text ui-widget-content ui-corner-all"> <label
				for="edit-groups"><?=GetMessage('GROUP')?> </label> <select
				name="groups" id="edit-groups" value=""
				class="text ui-widget-content ui-corner-all">
				<?foreach($arResult['phonebook'] as $arIndex):?>
				<option value="<?=$arIndex['ID']?>">
					<?=$arIndex['NAME']?>
				</option>
				<?endforeach;?>
			</select> <input type="hidden" id="contactId" />
		</form>
	</div>
</div>
<!-- окошко добавления новой группы -->
<div id="group" title="<?=GetMessage('ADD_GROUP')?>">
	<div>
		<form charset="windows-1251">
			<fieldset>
				<label for="groupname"><?=GetMessage('GROUP_NAME')?>*</label> <input
					name="groupname" id="groupname" value=""
					class="text ui-widget-content ui-corner-all">
			</fieldset>
		</form>
	</div>
</div>
<!-- редактировать группу-->
<div id="group-edit">
	<div>
		<form>
			<label for="edit-group-name"><?=GetMessage('GROUP_NAME')?> </label> <input
				name="lastname" id="edit-group-name" value=""
				class="text ui-widget-content ui-corner-all"> <input type="hidden"
				id="groupId" />
		</form>
	</div>
</div>
<!-- окошко для каких-нить сообщений  -->
<div id="ajaxdialog" title="">
	<p></p>
</div>
<!-- окошко загрузки -->
<div id="ajaxloading" title="<?=GetMessage('PROCESSING')?>">
	<div id="loader-wheel"></div>
	<div id="send-info">
		<div>
			<span id="actualSend"></span><span id="actualSendCount"></span>
		</div>
		<div>
			<span id="actualNotSend"></span><span id="actualNotSendCount"></span>
		</div>
	</div>
	<p>
		<?=GetMessage('WAIT')?>
	</p>
</div>

<script>
jQuery.expr[':'].Contains = function(a,i,m){
	 return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
};

$(document).ready(function() {
	var params = {};
	params.urlForAjaxRequests = '<?=$arResult['phonebookParams']['url']?>';
	params.session = '<?=$arResult['phonebookParams']['session']?>';
	params.mess = <?=$arResult['MESSAGES']?>;
	params.lang = <?=$arResult['LANG']?>;

	//объявляем объект таблиц для сортировки по столбцам
	var objClientSide = new clientSide(params);
	oTable = $('.contacts-table').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": false,
		"oLanguage": {
			"sEmptyTable": "<span class='notify'>В этой группе контакты отсутствуют.</span>"
		}
    });
    $('.not-sort-col').removeClass("sorting sorting_desc sorting_asc"); // удаляем все стрелочки сортировки у столбцов, которым они не нужны

});
</script>

<?
function clearPhoneNumber($dirtyPhoneNumber)
{
	return ('7'.substr($dirtyPhoneNumber, -10));
}
?>