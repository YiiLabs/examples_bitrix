<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>
<?
$APPLICATION->SetAdditionalCSS("/bitrix/templates/web20/ui-lightness/jquery-ui-1.8.16.custom.css");
/* Добавляем стили и скрипты для таблиц */
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
								<input title="Отметить все" type="checkbox" class="selectall" />
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
										<td class="phone" title="<?=$usedCount?> смс"><?=$contact['PROPERTY_PHONE_VALUE']?>
										</td>
										<td class="contact-groups">
											<div class="group-list">
												<?$i = 0;?>
												<div title="Перейти в группу '<?=$contact['GROUPS_LIST'][0]["NAME"]?>'" groupId="<?=intval($contact['GROUPS_LIST'][0]["ID"])?>" class="group-item"><a><?=$contact['GROUPS_LIST'][0]["NAME"]?></a></div>
												<?unset($contact['GROUPS_LIST'][0]);?>
												<?foreach($contact['GROUPS_LIST'] as $group):?>
												    <?if($i == 2):?>
												    <br/>
												    <a class="get-more-groups"><?="Ещё группы"?></a>
												    <div class="more-groups">
												    <?endif;?>
													<?if($i%3 == 2 && $i != 2):?>
													<br/>
													<?endif;?>
													<div title="Перейти в группу '<?=$group["NAME"]?>'" groupId="<?=intval($group["ID"])?>" class="group-item"><a><?=$group["NAME"]?></a></div>
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
							<?//if(count($orderedIndex) > 0): <td class="contact-groups"><span class="more-groups ui-icon" title="Группы контакта" style="cursor: pointer;"></span></td>?>
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
											<div class='congrat-notify ui-corner-all'><a><b>Поздравить контакт</b></a></div>
										</td>
										<td class="phone"
											title="<?=intval($contact['PROPERTY_RECENTLY_USED_VALUE'])?> смс"><?=$contact['PROPERTY_PHONE_VALUE']?>
										</td>
										<td class="contact-groups">
											<?if(intval($contact['PROPERTY_GROUPS_VALUE']) != 0):?>
											<div class="group-list">
												<?$i = 0;?>
												<?foreach($contact['GROUPS_LIST'] as $group):?>
												    <?if($group["ID"]==$arIndex["ID"]) continue;?>
												    <?if($i == 2):?>
													    <br/>
													    <a class="get-more-groups"><?="Ещё группы"?></a>
													    <div class="more-groups">
												    <?endif;?>
													<div title="Также входит в группу '<?=$group["NAME"]?>'" groupId="<?=intval($group["ID"])?>" class="group-item"><a><?=$group["NAME"]?></a></div>
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
<!-- окошко добавления контакта -->
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
				<input type="button" name="groupAdd" id="moreGroup" value="Привязать к ещё одной группе">
			</fieldset>
		</form>
	</div>
</div>
<!-- редактировать пользователя-->
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
			<input type="button" name="groupAdd" id="moreGroup" value="Привязать к ещё одной группе">
			<input type="hidden" id="contactId" />
		</form>
	</div>
</div>
<!-- окошко добавления новой группы -->
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
<!-- редактировать группу-->
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
<!-- окошко поздравления контакта -->
<div id="celebrate-dialog" class="closed-window" title="<?=GetMessage('CELEBRATE_CONTACT')?>">
	<div>
		<form charset="windows-1251">
			<?/* Вкладки */?>
			<div class="celebrate-tabs" class="onepage-tabs">
				<ul>
					<li><a href="#birth-date-tab"><?=GetMessage('CELEBRATE_BIRTHDATE')?></a></li>
					<li><a href="#forward-celebrate-tab"><?=GetMessage('FORWARDING_MESSAGING')?></a></li>
				</ul>
				<div id="birth-date-tab" class="ui-corner-all">
						Дата рождения:&nbsp;<input name="birthDate" type="text" class="birth-date text ui-widget-content ui-corner-all"/>
				        <br/>
				        Шаблон для поздравления:&nbsp;
				        <select name="celebratePatterns" id="celebrate-patterns" value="" class="text ui-widget-content ui-corner-all">
							<?foreach($arResult['phonebook'] as $arIndex):?>
							<option value="<?=$arIndex['ID']?>">
								<?=$arIndex['NAME']?>
							</option>
							<?endforeach;?>
						</select>
						<a href="settings/">Перейти на страницу редактирования шаблонов для поздравления</a>
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
								<th class="task-time-date-column">Дата поздравления</th>
								<th class="task-time-author-column">Шаблон поздравления</th>
								<th class="task-time-spent-column">Результат</th>
								<th class="task-time-comment-column">Комментарий</th>
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
<!-- окошко для каких-нить сообщений  -->
<div id="ajaxdialog" class="closed-window" title="">
	<p></p>
</div>
<!-- окошко загрузки -->
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
<!-- окошко подтверждения -->
<div id="dialog-confirm" title="<?=GetMessage('CONFIRM')?>">
	<p></p>
</div>
<!-- мастер импорта gmail -->
<div id="gmail-master" class="import-master" title="Импорт контактов из Gmail">
	<h3>Чтобы загрузить контакты из вашей почты Gmail, выполните следующие шаги:</h3>
	<div class="import-instructions">
		<h4>Шаг 1. Экспорт контактов в CSV-файл</h4>
		<ol>
			<li>Войдите в Gmail.
			<li>Нажмите ссылку <strong>Контакты</strong> в верхней левой части любой страницы Gmail.
			<li>В раскрывающемся меню <strong>Дополнительно</strong> выберите пункт <strong>Экспорт...</strong>.
			<li>Выберите экспорт всех контактов или отдельной группы.
			<li>Выберите формат экспорта "Формат CSV для Outlook".
			<li>Нажмите кнопку <strong>Экспорт</strong>.</li>
			<li>При необходимости выберите папку, в которой нужно сохранить файл, и нажмите кнопку <strong>ОК</strong>.</li>
		</ol>
	</div>
	<div class="import-loader">
		<h4>Шаг 2. Загрузите файл с контактами</h4>
		<div class='pre'>Выберите файл contacts.csv, сохраненный на шаге 1: <a id="gmail_load">Выбрать CSV-файл</a></div>
		<div class='in'>Файл загружается. Пожалуйста, дождитесь окончания загрузки. <span class="loader"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/ajax-loader.gif" border="0"></span></div>
		<div class='post'>Контакты успешно загружены из файла.</div>
	</div>
	<div class="import-example">
		<h4>Шаг 3. Убедитесь, что контакты загружены верно</h4>
		<div class="tblwrap">
			<table class="example-list">
				<thead>
					<tr><th>Фамилия</th><th>Имя</th><th>Номер телефона</th><th>Группа</th></tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div class="import-submit">
		<h4>Шаг 4. Если контакты загрузились правильно, нажмите кнопку "Добавить контакты"</h4>
	</div>
</div>
<!-- мастер импорта outlook -->
<div id="outlook-master" class="import-master" title="Импорт контактов из Outlook">
	<h3>Чтобы загрузить контакты из почтовой программы Outlook, выполните следующие шаги:</h3>
	<div class="import-instructions">
		<h4>Шаг 1. Экспорт контактов в CSV-файл</h4>
		<ol class="cntIndent36" type="1" start="1">
		  <li>В Outlook в меню <b class="ui">Файл</b> выберите команду <b class="ui">Импорт и экспорт</b>.</li>
		  <li>Щелкните элемент <b class="ui">Экспорт в файл</b>, а затем нажмите кнопку <b class="ui">Далее</b>.</li>
		  <li>Выберите элемент <b class="ui">Значения, разделенные запятой (DOS)</b>, а затем нажмите кнопку <b class="ui">Далее</b>.</li>
		  <li>В списке папок щелкните папку контактов, которую хотите экспортировать данные, а затем нажмите кнопку <b class="ui">Далее</b></li>
		  <li>Выберите местоположение на своем компьютере для временного хранения файла.</li>
		</ol>
	</div>
	<div class="import-loader">
		<h4>Шаг 2. Загрузите файл с контактами</h4>
		<div class='pre'>Выберите файл, сохраненный на шаге 1: <a id="outlook_load">Выбрать CSV-файл</a></div>
		<div class='in'>Файл загружается. Пожалуйста, дождитесь окончания загрузки. <span class="loader"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/ajax-loader.gif" border="0"></span></div>
		<div class='post'>Контакты успешно загружены из файла.</div>
	</div>
	<div class="import-example">
		<h4>Шаг 3. Убедитесь, что контакты загружены верно</h4>
		<div class="tblwrap">
			<table class="example-list">
				<thead>
					<tr><th>Фамилия</th><th>Имя</th><th>Номер телефона</th><th>Группа</th></tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div class="import-submit">
		<h4>Шаг 4. Если контакты загрузились правильно, нажмите кнопку "Добавить контакты"</h4>
	</div>
</div>
<!-- мастер импорта address book -->
<div id="addressbook-master" class="import-master" title="Импорт контактов из адресной книги Mac">
	<h3>Чтобы загрузить контакты из адресной книги Mac, выполните следующие шаги:</h3>
	<div class="import-instructions">
		<h4>Шаг 1. Экспорт контактов в файл vCard</h4>
		<ol>
			<li>Откройте приложение Mac<sup>®</sup> Address Book и выберите контакт или группу контактов, которые нужно экспортировать.</li>
			<li>В меню <strong>Файл</strong> нажмите <strong>Экспорт</strong>.</li>
			<li>Нажмите <strong>Экспорт группы в vCard</strong> или <strong>Экспорт в vCard</strong> в зависимости от того, нужно ли экспортировать группу контактов или только один контакт.</li>
			<li>Введите имя файла и сохраните файл vCard.</li>
		</ol>
	</div>
	<div class="import-loader">
		<h4>Шаг 2. Загрузите файл с контактами</h4>
		<div class='pre'>Выберите файл, сохраненный на шаге 1: <a id="addressbook_load">Выбрать файл vCard</a></div>
		<div class='in'>Файл загружается. Пожалуйста, дождитесь окончания загрузки. <span class="loader"><img src="/bitrix/components/sms4b/phonebook/templates/lightness/images/ajax-loader.gif" border="0"></span></div>
		<div class='post'>Контакты успешно загружены из файла.</div>
	</div>
	<div class="import-example">
		<h4>Шаг 3. Убедитесь, что контакты загружены верно</h4>
		<div class="tblwrap">
			<table class="example-list">
				<thead>
					<tr><th>Фамилия</th><th>Имя</th><th>Номер телефона</th><th>Группа</th></tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
	<div class="import-submit">
		<h4>Шаг 4. Если контакты загрузились правильно, нажмите кнопку "Добавить контакты"</h4>
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

	//объявляем объект таблиц для сортировки по столбцам
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
			"sEmptyTable": "<span class='notify'>В этой группе контакты отсутствуют</span>"
		}
    });
	
    $('.not-sort-col').removeClass("sorting sorting_desc sorting_asc"); // удаляем все стрелочки сортировки у столбцов, которым они не нужны
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