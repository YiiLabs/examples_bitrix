<div style="display: none;"> 				<?foreach($arResult['phonebook'] as $arIndex):?>
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
									<td class="phone" ><?=$contact['PROPERTY_PHONE_VALUE']?></td>
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
<script type="text/javascript">

function MakeSendOnForm(date_lastpress)
{
	if (date_lastpress == lastpress)
	{

		searchInputOnForm = $('#workarea');
		lastSearch = searchInputOnForm.val();		
		values = searchInputOnForm.val().split('\n');
		p = values[values.length-1];
	
		if (p.search(/@@@/) == -1)    //не найдена @@@ - 
		{   
            $(document).unbind('ajaxStart');
            $(document).unbind('ajaxStop');
            searchInputOnForm.addClass('search-processing');
			var searchResultOnForm = $('#search-result-on-form');
			Request('search', {'strSearch':values[values.length-1]}, function(data) {AfterSearch(data, searchResultOnForm,'onform')});
            
            //инициализируем событи€ 
            $(document).ajaxStart(function() {
                _this.ajaxLoading.dialog('open');
            });
            
            $(document).ajaxStop(function() {
                _this.ajaxLoading.dialog('close');
            });    
		        }
		else
		{
			//телефон найден. »дет печать текста сообщени€
			//console.log('не нужен поиск');
		}
	}
} 

//ѕост запрос
function Request(method, postData, handler, url)
{	
	if (!url)
		url = this.urlForAjaxRequests;

	postData.action = method;
	postData.ajaxrequest = 'Y';
	postData.session = 	'<?=$arResult['phonebookParams']['session']?>';
	
	if (!handler)
	{
		handler = function(result) {};
	}
	
	$.post(url, postData, handler, "json");
}



//после выполнени€
function AfterSearch(data,container,action)
{
	container.empty();
    searchInputOnForm.removeClass('search-processing');
	if ($(data.result).size() == 0)
	{
		container.hide(); 		
	}
	else
	{
		$(data.result).each(function() {
			searchStrResult = this.PROPERTY_LASTNAME_VALUE+' '+this.PROPERTY_FIRSTNAME_VALUE+' '+this.PROPERTY_PHONE_VALUE;
			$('<div contactId="'+this.ID+'">'+searchStrResult+'</div>').appendTo(container);
		});
		
		container.find('div').hover(
			function () { $(this).addClass('ui-selected')}, 
  			function () { $(this).removeClass('ui-selected')}
		);
		
		onFormSearchContainer = container;
		OnSearchClickActionTarget = action;
		//обработка клика по результатам поиска
		container.click(function(event) {
			event.stopImmediatePropagation();
			if ($(event.target).attr("contactId") || $(event.target).parent().attr("contactId"))
			{
				if($(event.target).parent().attr("contactId"))
				{
					eventTarget = $(event.target).parent(); 
				}
				else
				{
					eventTarget = $(event.target);
				}
				if(OnSearchClickActionTarget=='onform')
				{
					contact = $('#'+$(eventTarget).attr('contactId'));
//					console.log(contact);
//					console.log('event.target');
//					console.log(event.target);
					
					values = searchInputOnForm.val().split('\n');
					values[values.length-1] = contact.attr('contactPhone')+'@@@';
					newValue = values.join('\n');

					searchInputOnForm.val(newValue);	
					searchInputOnForm.focus();	
				}
				onFormSearchContainer.css('display', 'none');
			}
			else
			{
				onFormSearchContainer.css('display', 'none');	
			}
				
		});

		marginTop = (searchInputOnForm.val().split('\n').length-1)*14-139; 
		container.css('margin-top',marginTop); 
		container.css('display', 'block');
	}
	
	container.mouseover(function() {intab = true;}).mouseout(function() {intab = false;});
	
	$(document).click(function(event) {
		event.stopImmediatePropagation();
		if (false == intab)
		{
			onFormSearchContainer.hide(); 
		}
	});
}

$(document).ready(function(){
	//поиск
	var urlForAjaxRequests = '<?=$arResult['phonebookParams']['url']?>';
	var searchInputOnForm = $('#workarea');
	var lastSearch = '';
	var intab = false;
	var ajaxDialog = $("#ajaxdialog");
	
	searchInputOnForm.keyup(function(event) {
		event.stopImmediatePropagation();
		var date = new Date();
		lastpress = date.getTime();
	   
	    if (lastSearch != searchInputOnForm.val())
	    {
	    	setTimeout("MakeSendOnForm("+lastpress+")", 500);
	    	//MakeSendOnForm(lastpress);
		}

	});	
	
	

	

});
</script>