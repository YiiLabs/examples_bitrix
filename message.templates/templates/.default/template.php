<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>
<?
global $APPLICATION;
/* Добавляем стили и скрипты для таблиц */
$APPLICATION->AddHeadScript("/bitrix/js/jquery-ui-1.8.16.custom.min.js");
$APPLICATION->AddHeadScript("/bitrix/js/ajaxupload.js");
$APPLICATION->SetAdditionalCSS("/bitrix/templates/web20/ui-lightness/jquery-ui-1.8.16.custom.css");
$APPLICATION->AddHeadScript("/bitrix/js/jquery.dataTables.js");
?>
<div id="templates-block">
	<div id="search-block">
		<?=GetMessage('FIND')?>
		: <input type="text" id="templates-search" />
		<table id="search-result"></table>
	</div>
	<div id="template-load-div">
		<button id="create-template"
			class="ui-state-default ui-corner-all ui-button" type="button">
			<?=GetMessage('ADD_TEMPLATE')?>
		</button>
		<button id="useto" action="add"
			class="ui-state-default ui-corner-all ui-button" type="button">
			<?=GetMessage('ADD_TO_LIST')?>
		</button>

		<div id="templates-header">
			<div class="moveElements">
				<div class="moveElements-header">
					<span class="moveElements-header-text-disabled"><?=GetMessage('MOVE_TO')?>
					</span>
				</div>
				<div class="moveElements-body action-menu">
					<?foreach($arResult['template'] as $arIndex):?>
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
					<?foreach($arResult['template'] as $arIndex):?>
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
					<div id="fromExcel" action="fromExcel" class="import-item">
						<?=GetMessage('FROM_EXCEL')?><img style="padding-left: 5px;" src="/bitrix/components/sms4b/message.templates_nechal/templates/.default/images/questmark.gif" border="0">
					</div>
					<div id="toExcel" action="toExcel" class="import-item">
						<?=GetMessage('IN_EXCEL')?>
					</div>
					<div action="del" class="import-item">
						<?=GetMessage('DELETE_ITEMS')?>						
					</div>
				</div>
			</div>
		</div>
		<!--<button id="load-templates" class="ui-state-default ui-corner-all ui-button" type="button">Загрузить из Excel или *.csv</button>-->

	</div>
	<div class="clear"></div>
	<div id="main-part">
		<div id="templates">

			<div id="template-list">
				<div id="template-list-load">
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
							<a class="group-current frequently"><?=GetMessage('RECENT_TEMPLATES')?></a>
						</p>
					</div>
					<?foreach($arResult['template'] as $arIndex):?>
					<div id="<?=$arIndex["ID"]?>">
						<p class="group-header">
						
							<a <?=($arIndex["ID"]==0 ? '' : '')?>><?=$arIndex['NAME']?></a>
							
							<?if ($arIndex["ID"] != 0):?>
							<span class="edit-group ui-icon ui-icon-pencil"
								title="<?=GetMessage('GROUP_NAME_EDIT')?>"></span>
							<?endif;?>
							<?if ($arIndex["ID"] != 0):?>
							<span class="delete-group ui-icon ui-icon-close"
								title="<?=GetMessage('GROUP_DELETE')?>"></span>
							<?endif;?>
							<?if ($arIndex["ID"] == 0):?>
							<span class="delete-group ui-icon ui-icon-trash"
								title="<?=GetMessage('GROUP_CLEAN')?>"></span>
							<?endif;?>
							<span groupid="<?=$arIndex["ID"]?>" class="add-all-group-templates ui-icon ui-icon-mail-closed"
								title="<?=GetMessage('GROUP_TEMPLATES_ADD')?>"></span>
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
								<?=GetMessage('RECENT_TEMPLATES')?>
							</h3>
							<table class="group-tbl-container templates-table">
								<thead>
									<tr>
										<th class="not-sort-col"></th>
										<th class="sort-col"><?=GetMessage('HEAD_TEMPLATES_NAME')?></th>
										<th class="sort-col"><?=GetMessage('HEAD_TEMPLATES_DETAIL_TEXT')?></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
									</tr>
								</thead>
								<tbody>
									<?
									$recenttemplates = array();
									$recentIndex = array();
									foreach($arResult["template"] as $group)
										foreach($group['templates'] as $template)
										{
											$usedCount = intval($template['PROPERTY_COUNTER_VALUE']);
											if($usedCount<1)
												continue;
											$recenttemplates[$template['ID']] = $template;
											$recentIndex[$template['ID']] = $usedCount;
										}
										arsort($recentIndex);
										$c=0;
										foreach($recentIndex as $templateID => $usedCount)
										{
											$template = $recenttemplates[$templateID];
											if($c==10) break;
											?>
									<?/* Группа "Часто используемые" */?>
									<tr id="<?=$template['ID']?>" groupId="1" templateName="<?=$template['NAME']?>" templateDetail="<?=$template['DETAIL_TEXT']?>">
										<td class="chkbox"><input type="checkbox" /></td>
										<td class="name"><?=$template['NAME']?></td>
										<td class="detail-text" title="Использовался <?=$usedCount?> раз"><?=$template['DETAIL_TEXT']?></td>
										<td class="template-groups">
											<div class="group-list">
												<?$i = 0;?>
												<div title="Перейти в группу '<?=$template['GROUPS_LIST'][0]["NAME"]?>'" groupId="<?=intval($template['GROUPS_LIST'][0]["ID"])?>" class="group-item"><a><?=$template['GROUPS_LIST'][0]["NAME"]?></a></div>
												<?unset($template['GROUPS_LIST'][0]);?>
												<?foreach($template['GROUPS_LIST'] as $group):?>
												    <?if($i == 2):?>
												    <br/>
												    <a class="get-more-groups"><?="Ещё группы"?></a>
												    <div class="more-groups">
												    <?endif;?>
													<?if($i%3 == 2 && $i != 2):?>
													<br/>
													<?endif;?>
													<div title="Перейти в группу '<?=$group["NAME"]?>'" groupId="<?=intval($group["ID"])?>" class="group-item"><a><?=$group["NAME"]?></a></div>
													<?if($i == count($template['GROUPS_LIST'])-1):?>
												    </div>
												    <?endif;?>
												    <?$i++;?>
												<?endforeach;?>
											</div>
										</td>
										<td></td>
										<td></td>
										<td><div class="use-template ui-icon ui-icon-mail-closed"
												title="<?=GetMessage('SEND_TEMPLATE')?>"></div></td>
									</tr>
									<?
									$c++;
										}
										?>
								</tbody>
							</table>
						</div>
					</div>
					<?foreach($arResult['template'] as $arIndex):?>
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
							$orderedtemplates = array();
							$orderedIndex = array();
							foreach($arIndex['templates'] as $template)
							{
								$orderedIndex[strtolower($template['NAME']).$template['ID']] = $template['ID'];
								$orderedtemplates[$template['ID']] = $template;
							}
							ksort($orderedIndex);
							?>
							<?//if(count($orderedIndex) > 0): <td class="template-groups"><span class="more-groups ui-icon" title="Группы контакта" style="cursor: pointer;"></span></td>?>
							<table class="group-tbl-containerv templates-table">
								<thead>
									<tr>
										<th class="not-sort-col"></th>
										<th class="sort-col"><?=GetMessage('HEAD_TEMPLATES_NAME')?></th>
										<th class="sort-col"><?=GetMessage('HEAD_TEMPLATES_DETAIL_TEXT')?></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
										<th class="not-sort-col"></th>
									</tr>
								</thead>
								<tbody>
									<?foreach($orderedIndex as $templateID):?>
									<?$template = $orderedtemplates[$templateID];?>
									<tr class="searchable" id="<?=$template['ID']?>" groupId="<?=intval($template['PROPERTY_GROUPS_VALUE'])?>" templateName="<?=$template['NAME']?>" templateDetail="<?=$template['DETAIL_TEXT']?>">
										<td class="chkbox"><input type="checkbox" /></td>
										<td class="name"><?=$template['NAME']?></td>
										<td class="detail-text" title="Использовался <?=intval($contact['PROPERTY_COUNTER_VALUE'])?> раз"><?=$template['DETAIL_TEXT']?></td>
										<td class="template-groups">
											<?if(intval($template['PROPERTY_GROUPS_VALUE']) != 0):?>
											<div class="group-list">
												<?$i = 0;?>
												<div title="Перейти в группу '<?=$template['GROUPS_LIST'][0]["NAME"]?>.'" groupId="<?=intval($template['GROUPS_LIST'][0]["ID"])?>" class="group-item"><a><?=$template['GROUPS_LIST'][0]["NAME"]?></a></div>
												<?unset($template['GROUPS_LIST'][0]);?>
												<?foreach($template['GROUPS_LIST'] as $group):?>
												    <?if($i == 2):?>
												    <br/>
												    <a class="get-more-groups"><?="Ещё группы"?></a>
												    <div class="more-groups">
												    <?endif;?>
													<div title="Перейти в группу '<?=$group["NAME"]?>'" groupId="<?=intval($group["ID"])?>" class="group-item"><a><?=$group["NAME"]?></a></div>
													<?if($i == count($template['GROUPS_LIST'])-1):?>
												    </div>
												    <?endif;?>
												    <?$i++;?>
												<?endforeach;?>
											</div>
											<?endif;?>
										</td>
										<td><div class="edit-template ui-icon ui-icon-pencil"
												title="<?=GetMessage('EDIT_TEMPLATE')?>"></div></td>
										<td><div class="delete-template ui-icon ui-icon-close"
												title="<?=GetMessage('DEL_TEMPLATE')?>"></div></td>
										<td><div class="use-template ui-icon ui-icon-mail-closed"
												title="<?=GetMessage('SEND_TEMPLATE')?>"></div></td>
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
<div id="template-add" title="<?=GetMessage('ADD_TEMPLATE')?>">
	<div>
		<div id="templateTip"></div>
		<form charset="windows-1251">
			<fieldset>
				<label for="name"><?=GetMessage('HEAD_TEMPLATES_NAME')?>*</label> 
				<input name="name" id="name" value="" class="text ui-widget-content ui-corner-all"> 
				<label for="name"><?=GetMessage('HEAD_TEMPLATES_DETAIL_TEXT')?></label>
				<textarea name="new-template-text" spellcheck='true' cols="75" rows="5" class="new-template-text ui-corner-all" id="detail-text"></textarea> 
				<label for="groups">
				<?=GetMessage('GROUP')?>
				</label>
				<select name="groups" id="groups" value="" class="text ui-widget-content ui-corner-all">
					<?foreach($arResult['template'] as $arIndex):?>
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
<!-- редактировать шаблон сообщения-->
<div id="template-edit">
	<div>
		<div id="templateEditTip"></div>
		<form>
			<label for="name"><?=GetMessage('HEAD_TEMPLATES_NAME')?>*</label> 
			<input name="edit-name" id="edit-name" value="" class="text ui-widget-content ui-corner-all"> 
			<label for="name"><?=GetMessage('HEAD_TEMPLATES_DETAIL_TEXT')?></label>
			<textarea name="edit-template-text" spellcheck='true' cols="65" rows="5" class="edit-template-text ui-corner-all" id="edit-detail-text"></textarea>

			<label for="edit-groups">
			<?=GetMessage('GROUP')?>
			</label>
			<select name="groups" id="edit-groups" value="" class="text ui-widget-content ui-corner-all">
				<?foreach($arResult['template'] as $arIndex):?>
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
			<input type="hidden" id="templateId" />
		</form>
	</div>
</div>
<!-- окошко добавления новой группы -->
<div id="group" title="<?=GetMessage('ADD_GROUP')?>">
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
<div id="group-edit">
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
<!-- окошко для каких-нить сообщений  -->
<div id="ajaxdialog" title="">
	<p></p>
	<span id="dialog-id"></span>
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
<!-- окошко подтверждения -->
<div id="dialog-confirm" title="<?=GetMessage('CONFIRM')?>">
	<p></p>
</div>

<script>
jQuery.expr[':'].Contains = function(a,i,m){
	 return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
};

$(document).ready(function() {
	var params = {};
	params.urlForAjaxRequests = '<?=$arResult['templateParams']['url']?>';
	params.session = '<?=$arResult['templateParams']['session']?>';
	params.mess = <?=$arResult['MESSAGES']?>;
	params.lang = <?=$arResult['LANG']?>;

	//объявляем объект таблиц для сортировки по столбцам
	var objClientSide = new clientSide(params);
	oTable = $('.templates-table').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": true,
        "aaSorting": [[ 1, 'asc' ]],
        "bInfo": false,
        "bAutoWidth": false,
		"oLanguage": {
			"sEmptyTable": "<span class='notify'>В этой группе шаблоны отсутствуют</span>"
		}
    });
    
    $('.not-sort-col').removeClass("sorting sorting_desc sorting_asc"); // удаляем все стрелочки сортировки у столбцов, которым они не нужны
    checkTableEmptiness();

	function checkTableEmptiness()
	{
		$("#template-list table").each(function()
		{
			if($(this).find("tr td").hasClass("dataTables_empty"))
			{
				$(this).dataTable().fnSetColumnVis( 1, false );
				$(this).dataTable().fnSetColumnVis( 2, false );
		}
		else
		{
			$(this).dataTable().fnSetColumnVis( 1, true);
			$(this).dataTable().fnSetColumnVis( 2, true);
		}
		});
	}
});
</script>