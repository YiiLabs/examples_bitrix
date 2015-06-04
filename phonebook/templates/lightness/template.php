<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>
<?
$APPLICATION->SetAdditionalCSS("/bitrix/templates/web20/ui-lightness/jquery-ui-1.8.16.custom.css");
/* ��������� ����� � ������� ��� ������ */
$APPLICATION->AddHeadScript("/bitrix/js/jquery.dataTables.js");
$APPLICATION->AddHeadScript("/bitrix/js/jquery-ui-timepicker-addon.js");
$APPLICATION->AddHeadScript("/bitrix/js/jquery.ui.datepicker-ru.js");
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
				<div class="moveElements-body action-menu">
					<?foreach($arResult['phonebook'] as $arIndex):?>
					<div groupId="<?=$arIndex['ID']?>">
						<?=$arIndex['NAME']?>
					</div>
					<?endforeach;?>
				</div>
			</div>
			<div class="addElements">
				<div class="addElements-header">
					<span class="addElements-header-text-disabled"><?=GetMessage('ADD_TO')?>
					</span>
				</div>
				<div class="addElements-body action-menu">
					<?foreach($arResult['phonebook'] as $arIndex):?>
					<?if($arIndex['ID'] == 0):?>
						<?continue;?>
					<?endif;?>
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
				<div class="actionElements-body action-menu">
					<div id="fromGmail" class="import-item">
						<div class="import-icon"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/gmailnotifr.png" border="0"></div>
						<div class="import-label"><?=GetMessage('FROM_GMAIL')?></div>
					</div>
					<div id="fromOutlook" class="import-item">
						<div class="import-icon"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/outlook_icon.gif" border="0"></div>
						<div class="import-label"><?=GetMessage('FROM_OUTLOOK')?></div>
					</div>
					<div id="fromAddressbook" style="padding-left: 2px;" class="import-item">
						<div class="import-icon"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/address_book.png" border="0"></div>
						<div class="import-label"><?=GetMessage('FROM_ADDRESSBOOK')?></div>
					</div>
					<div id="fromExcel" action="fromExcel" class="import-item">
						<div class="import-icon"></div>
						<div class="import-label"><?=GetMessage('FROM_EXCEL')?><img style="padding-left: 5px;" src="/bitrix/components/sms4b/phonebook/templates/lightness/images/questmark.gif" border="0"></div>
					</div>
					<div id="toExcel" action="toExcel" class="import-item">
						<div class="import-icon"></div>
						<div class="import-label"><?=GetMessage('IN_EXCEL')?></div>
					</div>
					<div id="delSelected" action="del" class="import-item">
						<div class="import-icon"></div>
						<div class="import-label"><?=GetMessage('DELETE_ITEMS')?></div>						
					</div>
				</div>
			</div>
		</div>
		<!--<button id="load-contacts" class="ui-state-default ui-corner-all ui-button" type="button">��������� �� Excel ��� *.csv</button>-->

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
					<div id="1">
						<p class="group-header">
							<a class="group-current"><?=GetMessage('RECENT_CONTACTS')?></a>
						</p>
					</div>
					<?foreach($arResult['phonebook'] as $arIndex):?>
					<div id="<?=$arIndex["ID"]?>">
						<p class="group-header">
							
							<a <?=($arIndex["ID"] == 0 ? '' : '')?>><?=$arIndex['NAME']?></a>
							
							<?if ($arIndex["ID"] != 0):?>
								<span class="edit-group ui-icon ui-icon-pencil" title="<?=GetMessage('GROUP_NAME_EDIT')?>"></span>
							<?endif;?>
							<?if ($arIndex["ID"] != 0):?>
								<span class="delete-group ui-icon ui-icon-close" title="<?=GetMessage('GROUP_DELETE')?>"></span>
							<?endif;?>
							<?if ($arIndex["ID"] == 0):?>
								<span class="delete-group ui-icon ui-icon-trash" title="<?=GetMessage('GROUP_CONTACTS_DEL')?>"></span>
							<?endif?>
							
							<a href="index.php?addfromgroup=<?=$arIndex["ID"]?>" class="add-all-group-numbers ui-icon ui-icon-mail-closed" title="<?=GetMessage('GROUP_CONTACTS_ADD')?>"></a>
							
						</p>
					</div>
					<?endforeach;?>
				</div>
				<div class="groupcontent">
					<div id="group-1" class="group-number">
						<div class="group-body">
							<div class="group-select-all">
								<input title="�������� ���" type="checkbox" class="selectall" />
							</div>
							<h3>
								<?=GetMessage('RECENT_CONTACTS')?>
							</h3>
							<table class="group-tbl-container contacts-table">
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
										<th class="not-sort-col"></th>
									</tr>
								</thead>
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
										groupId="<?="1"//$contact['PROPERTY_GROUPS_VALUE']?>"
										contactLastName="<?=$contact['PROPERTY_LASTNAME_VALUE']?>"
										contactName="<?=$contact['PROPERTY_FIRSTNAME_VALUE']?>"
										contactPhone="<?=$contact['PROPERTY_PHONE_VALUE']?>">
										<td class="chkbox"><input type="checkbox" /></td>
										<td class="lastname"><?=$contact['PROPERTY_LASTNAME_VALUE']?>
										</td>
										<td class="name"><?=$contact['PROPERTY_FIRSTNAME_VALUE']?></td>
										<td class="phone" title="<?=$usedCount?> ���"><?=$contact['PROPERTY_PHONE_VALUE']?>
										</td>
										<td class="contact-groups">
											<div class="group-list">
												<?$i = 0;?>
												<div title="������� � ������ '<?=$contact['GROUPS_LIST'][0]["NAME"]?>'" groupId="<?=intval($contact['GROUPS_LIST'][0]["ID"])?>" class="group-item"><a><?=$contact['GROUPS_LIST'][0]["NAME"]?></a></div>
												<?unset($contact['GROUPS_LIST'][0]);?>
												<?foreach($contact['GROUPS_LIST'] as $group):?>
												    <?if($i == 2):?>
												    <br/>
												    <a class="get-more-groups"><?="��� ������"?></a>
												    <div class="more-groups">
												    <?endif;?>
													<?if($i%3 == 2 && $i != 2):?>
													<br/>
													<?endif;?>
													<div title="������� � ������ '<?=$group["NAME"]?>'" groupId="<?=intval($group["ID"])?>" class="group-item"><a><?=$group["NAME"]?></a></div>
													<?if($i == count($contact['GROUPS_LIST'])-1):?>
												    </div>
												    <?endif;?>
												    <?$i++;?>
												<?endforeach;?>
											</div>
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
								<input title="�������� ���" type="checkbox" class="selectall" />
							</div>
							<?if($arIndex["ID"]==0):?>
							<h3>
								<?=$arIndex['NAME']?>
							</h3>
							<?else:?>
							<h3>
								������ &laquo;
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
							<?//if(count($orderedIndex) > 0): <td class="contact-groups"><span class="more-groups ui-icon" title="������ ��������" style="cursor: pointer;"></span></td>?>
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
										<td class="lastname"><?=$contact['PROPERTY_LASTNAME_VALUE']?></td>
										<td class="name">
											<?=$contact['PROPERTY_FIRSTNAME_VALUE']?>
											<div class='congrat-notify ui-corner-all'><a><b>���������� �������</b></a></div>
										</td>
										<td class="phone"
											title="<?=intval($contact['PROPERTY_RECENTLY_USED_VALUE'])?> ���"><?=$contact['PROPERTY_PHONE_VALUE']?>
										</td>
										<td class="contact-groups">
											<?if(intval($contact['PROPERTY_GROUPS_VALUE']) != 0):?>
											<div class="group-list">
												<?$i = 0;?>
												<?foreach($contact['GROUPS_LIST'] as $group):?>
												    <?if($group["ID"]==$arIndex["ID"]) continue;?>
												    <?if($i == 2):?>
													    <br/>
													    <a class="get-more-groups"><?="��� ������"?></a>
													    <div class="more-groups">
												    <?endif;?>
													<div title="����� ������ � ������ '<?=$group["NAME"]?>'" groupId="<?=intval($group["ID"])?>" class="group-item"><a><?=$group["NAME"]?></a></div>
													<?if($i == count($contact['GROUPS_LIST'])-1):?>
												    	</div>
												    <?endif;?>
												    <?$i++;?>
												<?endforeach;?>
											</div>
											<?endif;?>
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
							</table>
							<?//endif;?>
						</div>
					</div>
					<?endforeach;?>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- ������ ���������� �������� -->
<div id="dialog" class="closed-window" title="<?=GetMessage('ADD_CONTACT')?>">
	<div>
		<div id="contactTip"></div>
		<form charset="windows-1251">
			<fieldset>
				<label for="lastname"><?=GetMessage('SECOND_NAME')?> </label> <input
					name="lastname" id="lastname" value=""
					class="text ui-widget-content ui-corner-all"> <label for="name"><?=GetMessage('NAME')?>
				</label> <input name="name" id="name" value=""
					class="text ui-widget-content ui-corner-all"> <label
					for="telephone"><?=GetMessage('TELEPHONE')?>*</label> <input
					name="telephone" id="telephone" value=""
					class="text ui-widget-content ui-corner-all">
				<label for="groups">
				<?=GetMessage('GROUP')?>
				</label>
				<select name="groups" id="groups" value="" class="text ui-widget-content ui-corner-all">
					<?foreach($arResult['phonebook'] as $arIndex):?>
					<option value="<?=$arIndex['ID']?>">
						<?=$arIndex['NAME']?>
					</option>
					<?endforeach;?>
				</select>
				<table width="100%" id="add-groups-table">
					<tr>
						<td width="60%" class="groupsSelect">

						</td>
						<td valign="top" width="40%" class="groupsButton">

						</td>
					</tr>
				</table>
				<input type="button" name="groupAdd" id="moreGroup" value="��������� � ��� ����� ������">
			</fieldset>
		</form>
	</div>
</div>
<!-- ������������� ������������-->
<div id="contact-edit" class="closed-window">
	<div>
		<div id="contactEditTip"></div>
		<form>
			<label for="edit-lastname"><?=GetMessage('SECOND_NAME')?> </label> <input
				name="lastname" id="edit-lastname" value=""
				class="text ui-widget-content ui-corner-all"> <label for="edit-name"><?=GetMessage('NAME')?>
			</label> <input name="name" id="edit-name" value=""
				class="text ui-widget-content ui-corner-all"> <label
				for="edit-phone"><?=GetMessage('TELEPHONE')?>*</label> <input
				name="telephone" id="edit-phone" value=""
				class="text ui-widget-content ui-corner-all">

			<label for="edit-groups">
			<?=GetMessage('GROUP')?>
			</label>
			<select name="groups" id="edit-groups" value="" class="text ui-widget-content ui-corner-all">
				<?foreach($arResult['phonebook'] as $arIndex):?>
				<option value="<?=$arIndex['ID']?>">
					<?=$arIndex['NAME']?>
				</option>
				<?endforeach;?>
			</select>
			<table width="100%" id="edit-groups-table">
				<tr>
					<td width="60%" class="groupsSelectEdit">

					</td>
					<td valign="top" width="40%" class="groupsButtonEdit">

					</td>
				</tr>
			</table>
			<input type="button" name="groupAdd" id="moreGroup" value="��������� � ��� ����� ������">
			<input type="hidden" id="contactId" />
		</form>
	</div>
</div>
<!-- ������ ���������� ����� ������ -->
<div id="group" class="closed-window" title="<?=GetMessage('ADD_GROUP')?>">
	<div>
		<div id="groupTip"></div>
		<form charset="windows-1251">
			<fieldset>
				<label for="groupname"><?=GetMessage('GROUP_NAME')?>*</label> <input
					name="groupname" id="groupname" value=""
					class="text ui-widget-content ui-corner-all">
			</fieldset>
		</form>
	</div>
</div>
<!-- ������������� ������-->
<div id="group-edit" class="closed-window">
	<div>
		<div id="groupEditTip"></div>
		<form>
			<label for="edit-group-name"><?=GetMessage('GROUP_NAME')?> </label> <input
				name="lastname" id="edit-group-name" value=""
				class="text ui-widget-content ui-corner-all"> <input type="hidden"
				id="groupId" />
		</form>
	</div>
</div>
<!-- ������ ������������ �������� -->
<div id="celebrate-dialog" class="closed-window" title="<?=GetMessage('CELEBRATE_CONTACT')?>">
	<div>
		<form charset="windows-1251">
			<?/* ������� */?>
			<div class="celebrate-tabs" class="onepage-tabs">
				<ul>
					<li><a href="#birth-date-tab"><?=GetMessage('CELEBRATE_BIRTHDATE')?></a></li>
					<li><a href="#forward-celebrate-tab"><?=GetMessage('FORWARDING_MESSAGING')?></a></li>
				</ul>
				<div id="birth-date-tab" class="ui-corner-all">
						���� ��������:&nbsp;<input name="birthDate" type="text" class="birth-date text ui-widget-content ui-corner-all"/>
				        <br/>
				        ������ ��� ������������:&nbsp;
				        <select name="celebratePatterns" id="celebrate-patterns" value="" class="text ui-widget-content ui-corner-all">
							<?foreach($arResult['phonebook'] as $arIndex):?>
							<option value="<?=$arIndex['ID']?>">
								<?=$arIndex['NAME']?>
							</option>
							<?endforeach;?>
						</select>
						<a href="settings/">������� �� �������� �������������� �������� ��� ������������</a>
				</div>
				<div id="forward-celebrate-tab" class="ui-corner-all">
					<table class="task-time-table" cellspacing="0" cellpadding="0">
						<colgroup>
							<col class="task-time-date-column">
							<col class="task-time-author-column">
							<col class="task-time-spent-column">
							<col class="task-time-comments-column">
						</colgroup>	
						<tbody>
							<tr>
								<th class="task-time-date-column">���� ������������</th>
								<th class="task-time-author-column">������ ������������</th>
								<th class="task-time-spent-column">���������</th>
								<th class="task-time-comment-column">�����������</th>
							</tr>
							<tr id="task-elapsed-time-button-row">
								<td class="task-time-date-column">
									<a id="task-add-elapsed-time" class="task-add-new">
								</td>
								<td class="task-time-author-column">&nbsp;</td>
								<td class="task-time-spent-column">&nbsp;</td>
								<td class="task-time-comment-column">
									<div class="wrap-edit-nav">&nbsp;</div>
								</td>
							</tr>
							<tr id="task-elapsed-time-form-row" style="display: none;">
								<td class="task-time-date-column">&nbsp;</td>
								<td class="task-time-author-column">&nbsp;</td>
								<td class="task-time-spent-column">
								<td id="task-time-comment-column" class="task-time-comment-column">
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</form>
	</div>
</div>
<!-- ������ ��� �����-���� ���������  -->
<div id="ajaxdialog" class="closed-window" title="">
	<p></p>
</div>
<!-- ������ �������� -->
<div id="ajaxloading" class="closed-window" title="<?=GetMessage('PROCESSING')?>">
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
<!-- ������ ������������� -->
<div id="dialog-confirm" title="<?=GetMessage('CONFIRM')?>">
	<p></p>
</div>
<!-- ������ ������� gmail -->
<div id="gmail-master" class="import-master" title="������ ��������� �� Gmail">
	<h3>����� ��������� �������� �� ����� ����� Gmail, ��������� ��������� ����:</h3>
	<div class="import-instructions">
		<h4>��� 1. ������� ��������� � CSV-����</h4>
		<ol>
			<li>������� � Gmail.
			<li>������� ������ <strong>��������</strong> � ������� ����� ����� ����� �������� Gmail.
			<li>� �������������� ���� <strong>�������������</strong> �������� ����� <strong>�������...</strong>.
			<li>�������� ������� ���� ��������� ��� ��������� ������.
			<li>�������� ������ �������� "������ CSV ��� Outlook".
			<li>������� ������ <strong>�������</strong>.</li>
			<li>��� ������������� �������� �����, � ������� ����� ��������� ����, � ������� ������ <strong>��</strong>.</li>
		</ol>
	</div>
	<div class="import-loader">
		<h4>��� 2. ��������� ���� � ����������</h4>
		<div class='pre'>�������� ���� contacts.csv, ����������� �� ���� 1: <a id="gmail_load">������� CSV-����</a></div>
		<div class='in'>���� �����������. ����������, ��������� ��������� ��������. <span class="loader"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/ajax-loader.gif" border="0"></span></div>
		<div class='post'>�������� ������� ��������� �� �����.</div>
	</div>
	<div class="import-example">
		<h4>��� 3. ���������, ��� �������� ��������� �����</h4>
		<div class="tblwrap">
			<table class="example-list">
				<thead>
					<tr><th>�������</th><th>���</th><th>����� ��������</th><th>������</th></tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div class="import-submit">
		<h4>��� 4. ���� �������� ����������� ���������, ������� ������ "�������� ��������"</h4>
	</div>
</div>
<!-- ������ ������� outlook -->
<div id="outlook-master" class="import-master" title="������ ��������� �� Outlook">
	<h3>����� ��������� �������� �� �������� ��������� Outlook, ��������� ��������� ����:</h3>
	<div class="import-instructions">
		<h4>��� 1. ������� ��������� � CSV-����</h4>
		<ol class="cntIndent36" type="1" start="1">
		  <li>� Outlook � ���� <b class="ui">����</b> �������� ������� <b class="ui">������ � �������</b>.</li>
		  <li>�������� ������� <b class="ui">������� � ����</b>, � ����� ������� ������ <b class="ui">�����</b>.</li>
		  <li>�������� ������� <b class="ui">��������, ����������� ������� (DOS)</b>, � ����� ������� ������ <b class="ui">�����</b>.</li>
		  <li>� ������ ����� �������� ����� ���������, ������� ������ �������������� ������, � ����� ������� ������ <b class="ui">�����</b></li>
		  <li>�������� �������������� �� ����� ���������� ��� ���������� �������� �����.</li>
		</ol>
	</div>
	<div class="import-loader">
		<h4>��� 2. ��������� ���� � ����������</h4>
		<div class='pre'>�������� ����, ����������� �� ���� 1: <a id="outlook_load">������� CSV-����</a></div>
		<div class='in'>���� �����������. ����������, ��������� ��������� ��������. <span class="loader"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/ajax-loader.gif" border="0"></span></div>
		<div class='post'>�������� ������� ��������� �� �����.</div>
	</div>
	<div class="import-example">
		<h4>��� 3. ���������, ��� �������� ��������� �����</h4>
		<div class="tblwrap">
			<table class="example-list">
				<thead>
					<tr><th>�������</th><th>���</th><th>����� ��������</th><th>������</th></tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div class="import-submit">
		<h4>��� 4. ���� �������� ����������� ���������, ������� ������ "�������� ��������"</h4>
	</div>
</div>
<!-- ������ ������� address book -->
<div id="addressbook-master" class="import-master" title="������ ��������� �� �������� ����� Mac">
	<h3>����� ��������� �������� �� �������� ����� Mac, ��������� ��������� ����:</h3>
	<div class="import-instructions">
		<h4>��� 1. ������� ��������� � ���� vCard</h4>
		<ol>
			<li>�������� ���������� Mac<sup>�</sup> Address Book � �������� ������� ��� ������ ���������, ������� ����� ��������������.</li>
			<li>� ���� <strong>����</strong> ������� <strong>�������</strong>.</li>
			<li>������� <strong>������� ������ � vCard</strong> ��� <strong>������� � vCard</strong> � ����������� �� ����, ����� �� �������������� ������ ��������� ��� ������ ���� �������.</li>
			<li>������� ��� ����� � ��������� ���� vCard.</li>
		</ol>
	</div>
	<div class="import-loader">
		<h4>��� 2. ��������� ���� � ����������</h4>
		<div class='pre'>�������� ����, ����������� �� ���� 1: <a id="addressbook_load">������� ���� vCard</a></div>
		<div class='in'>���� �����������. ����������, ��������� ��������� ��������. <span class="loader"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/ajax-loader.gif" border="0"></span></div>
		<div class='post'>�������� ������� ��������� �� �����.</div>
	</div>
	<div class="import-example">
		<h4>��� 3. ���������, ��� �������� ��������� �����</h4>
		<div class="tblwrap">
			<table class="example-list">
				<thead>
					<tr><th>�������</th><th>���</th><th>����� ��������</th><th>������</th></tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div class="import-submit">
		<h4>��� 4. ���� �������� ����������� ���������, ������� ������ "�������� ��������"</h4>
	</div>
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

	//��������� ������ ������ ��� ���������� �� ��������
	var objClientSide = new clientSide(params);
	oTable = $('.contacts-table').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": true,
        "aaSorting": [[ 1, 'asc' ]],
        "bInfo": false,
        "bAutoWidth": false,
		"oLanguage": {
			"sEmptyTable": "<span class='notify'>� ���� ������ �������� �����������</span>"
		}
    });
	
    $('.not-sort-col').removeClass("sorting sorting_desc sorting_asc"); // ������� ��� ��������� ���������� � ��������, ������� ��� �� �����
    checkTableEmptiness();

	function checkTableEmptiness()
	{
		$("#contact-list table").each(function()
		{
			if($(this).find("tr td").hasClass("dataTables_empty"))
			{
				$(this).dataTable().fnSetColumnVis( 1, false );
				$(this).dataTable().fnSetColumnVis( 2, false );
				$(this).dataTable().fnSetColumnVis( 3, false );
		}
		else
		{
			$(this).dataTable().fnSetColumnVis( 1, true);
			$(this).dataTable().fnSetColumnVis( 2, true);
			$(this).dataTable().fnSetColumnVis( 3, true);
		}
		});
	}
});
</script>

<?
function clearPhoneNumber($dirtyPhoneNumber)
{
	return ('7'.substr($dirtyPhoneNumber, -10));
}
?>