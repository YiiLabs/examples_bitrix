

function clientSide(params)
{
	this.urlForAjaxRequests = params.urlForAjaxRequests;
	this.session = params.session;
	
	//перемещение
	this.movingHeader = $('.moveElements-header');
	this.movingHeaderText = $('.moveElements-header span');
	this.moveElementsBody = $('.moveElements-body');
	this.moveElementsBodyItem = $('.moveElements-body div');
	//доп.действия
	this.actionHeader = $('.actionElements-header');
	this.actionHeaderText = $('.actionElements-header span');
	this.actionElementsBody = $('.actionElements-body');
	this.actionElementsBodyItem = $('.actionElements-body div');
	//excel
	this.excelHeader = $('.excelElements-header');
	this.excelHeaderText = $('.excelElements-header span');
	this.excelElementsBody = $('.excelElements-body');
	this.excelElementsBodyItem = $('.excelElements-body div');
	//поиск
	this.searchInput = $('#contacts-search');
	this.searchResult = $('#search-result');
	lastNumbersFieldContent = "";
	this.intab = false;
	
	this.ajaxLoading = $("#ajaxloading");
	this.ajaxDialog = $("#ajaxdialog");
	this.ajaxDialogText = $("#ajaxdialog p");
	this.textareaPhoneList = $("#numbers-list");
	this.groupList = $(".grouplist");
	this.contactList = $(".groupcontent");
	this.contactEditDialog = $("#contact-edit");
	//это поле в другой! компоненте, форме отправки sms
	this.destination_number = $("textarea[name=numbers]");
	//поля для редактирования контакта
	this.editLastName = $("#edit-lastname");
	this.editName = $("#edit-name");
	this.editPhone = $("#edit-phone");
	this.editGroup = $("#edit-groups");
	this.contactId = $("#contactId");
	//поля для редактирования группы
	this.editGroupId = $("#groupId");
	this.editGroupName = $("#edit-group-name");
	this.needSms = $('#need-sms');
	this.correctNums = $('#correct-nums');
	this.messageLength = $('#lengmess');
	this.partSize = $('#size-part');
	this.parts = $('#parts');
	this.message = $('textarea[name=text]');
	this.mess = params.mess;
	this.lang = params.lang;
	
	this.everyNotSearch = $("*").not('tr.one-search-result #contacts-search'); // выбираем все, кроме строки поиска
	
	this.alreadyWasOpened = false;
	
	this.Init();
}
//инициализируем страницу
clientSide.prototype.Init = function()
{
	this.InitAjaxLoadingDialog();
	this.InitPhoneBook();
	this.InitControls();
	this.InitUpload();
	//this.InitUploadContactsFromExcel();
	this.InitGroupsList();
	this.InitAddingContactButton();
	this.InitAddingGroupButton();
	this.InitSearch();
	this.InitEditContact();
	this.InitEditGroup();
	this.InitAjaxMessageDialog();
}

//инициализация самой телефонной книги
clientSide.prototype.InitPhoneBook = function ()
{
	_this = this;
		
	$("#group-1 .group-body").fadeIn(); 
		
	$("#phonebook p").live('click', function(event){
		if($(this).children("a").hasClass('group-current')==false)
		{
			$(".group-number").hide();
			$(".grouplist a").removeClass('group-current');
			$(this).children("a").addClass('group-current')
			$("#group-"+$(this).parent().attr("id")+' .group-body').show();
			$("#group-"+$(this).parent().attr("id")).fadeIn();
		}	
	});
	
	$(".send-contact").live('click',function(){
		tr = $(this).parent().parent();
		telephone = tr.attr('contactPhone')+'<'+tr.attr('contactLastName')+' '+tr.attr('contactName')+'>';
		document.location.href="index.php?numbers="+telephone;	
	});
	
	_this.actionHeaderText.addClass('moveElements-header-text-enabled');
	_this.actionHeader.addClass('dashed');
	
	// делается для того, чтобы при клике на строку поиска не пропадал блок с результатами (связь со следующим блоком)
	_this.searchInput.click(function(e)
	{
	    e.stopImmediatePropagation();
	});
	// если кликнули на все, кроме блока с результатами поиска, то убираем этот блок
	_this.everyNotSearch.each(function(index)
	{
		$(this).live('click', function(event){
			_this.searchResult.hide();
		});
	}); 
	
}

	
//загрузка из excel и csv файла номеров
clientSide.prototype.InitUpload = function()
{
	_this = this;
	//здесь создадим обработчег excel файла
	
}
//загрузка из excel и csv файла контактов для телефонной книги
clientSide.prototype.InitUploadContactsFromExcel = function()
{
	_this = this;
	//здесь создадим обработчег excel файла
	new AjaxUpload('fromExcel',
	{
		action: 'excelupload/uploadContacts.php',
		//file upload name
		name: 'userfile',
		title: 'Формат файла - xls или csv. На первой странице в 1й колонке - номер, во 2й - фамилия, в 3й - имя, в 4й - группа. Колонки 2, 3 и 4 необязательные.',
		responseType: 'json',
		onSubmit: function(file, ext)
		{
			if (!(ext && /^(xls|csv)$/i.test(ext)))
			{
                //недопустимое расширение у файла
                alert(_this.mess['EXTENSION']);
                // cancel upload
                return false;
            }
			_this.ajaxLoading.dialog('open');
			this.disable();		
		},
		onComplete: function(file, response)
		{
			this.enable();
			
			if (response.state != 'error')
			{				
				if (response.length > 0)
				{
					_this.Request('AddContactsFromExcel', { 'contacts[]': response}, function(data) { _this.AfterContactAddFromExcel(data); _this.ajaxLoading.dialog('close'); });
				}			
			}
			else
			{
				_this.ShowError(_this.mess['ERROR'], response.text);
			}
			
		}
	 });	
}
//поиск
clientSide.prototype.InitSearch = function()
{
	_this = this;
	_this.searchInput.keyup(function(event){
		newNumbersFieldContent = $(this).val();
		if(newNumbersFieldContent!=lastNumbersFieldContent)
		{			
			lastNumbersFieldContent = newNumbersFieldContent;
			value = newNumbersFieldContent.trim();
	
			if(value.length>0)
			{				
				_this.searchResult.html("");
				trs = $("div#contact-list table tr.searchable:Contains('"+value+"')");
				count = trs.length;
				i=0;
				max=12;
				addedNumbers = {};
				trs.each(function(index){
					element = $(this); 
					if(typeof addedNumbers[element.attr("contactphone")] === 'undefined')
					{
						_this.searchResult.append('<tr class="one-search-result" groupid="'+element.attr("groupid")+'"><td class="search-result-phone">'+element.attr("contactphone")+'</td><td class="search-result-fio">'+element.attr("contactlastname")+' '+element.attr("contactname")+'</td><td class="search-result-group">'+($("#"+element.attr("groupid")+" a").text())+'</td><tr>');
						addedNumbers[element.attr("contactphone")] = '1';
					}					
					i++;
					//выполнится после обхода последнего элемента					
					if (!--count || i==max)
					{
						$("tr.one-search-result").on("click", function(event){
							event.stopImmediatePropagation();							
							$("#"+$(this).attr('groupid')+" a:first").click();
							phone =	$(this).children("td.search-result-phone").text();
							$("tr[contactphone='"+phone+"'] td:first").click();
							$('#search-result').hide();						
						});
						return false;
					}					
				});								
				_this.searchResult.show();
			}
		}
	}).focus(function(event) // появление результатов поиска, если уже есть символ в строке поиска
	{
		_this.searchResult.show();
	});
}

//инициализация управляющих контролов
clientSide.prototype.InitControls = function()
{
	var _this = this;
	$("#sendto").button();
	$("#sendto").button( "option", "disabled", true );
	//нажатие на перемещение
	this.movingHeader.add(this.movingHeaderText).click(function(event) {
		if (_this.movingHeaderText.hasClass('moveElements-header-text-enabled'))
		{
			event.stopImmediatePropagation();
			var target = $(event.target);
			_this.moveElementsBody.css('display', _this.moveElementsBody.css('display') == 'block' ? 'none' : 'block');
			_this.actionElementsBody.css('display', 'none');
			_this.excelElementsBody.css('display', 'none');
		} 
	});
	
	this.moveElementsBody.click(function(event) {
		event.stopImmediatePropagation();
		target = $(event.target);
		toGroup = target.attr('groupid');
		if (toGroup != 'undefined')
		{
			if (confirm(_this.mess['GROUP']+ '"' + target.text() + '"' + "?"))
			{
				_this.moveElementsBody.css('display', 'none');
				var contactsArray = new Array();
				_this.contactList.find('tr:has(input:checked)').each(
					function() {
						contactsArray.push($(this).attr('id'));
					}
				);
				_this.Request('ChangeGroupForSelectedContacts', {'toGroup': toGroup, 'contactsId[]': contactsArray}, function(data) {_this.AfterGroupChangeSelectedContacts(data)});
			}
		}
	});
	
	//нажатие на действие
	this.actionHeader.add(this.actionHeaderText).click(function(event) {
		if (_this.actionHeaderText.hasClass('moveElements-header-text-enabled'))
		{
			event.stopImmediatePropagation();
			var target = $(event.target);
			_this.actionElementsBody.css('display', _this.actionElementsBody.css('display') == 'block' ? 'none' : 'block');
			_this.moveElementsBody.css('display', 'none');
			_this.excelElementsBody.css('display', 'none');
		}
	});
	
	this.actionElementsBody.click(function(event) {
		event.stopImmediatePropagation();
		target = $(event.target);
		var action = target.attr('action'); 
		if (action != 'undefined')
		{
			if (action == 'del')
			{
				if (confirm('Вы точно хотите удалить эти контакты?'))
				{
					_this.actionElementsBody.css('display', 'none');
					var contactsForDeleteArray = new Array();
					_this.contactList.find('tr:has(input:checked)').each(
						function() {
							contactsForDeleteArray.push($(this).attr('id'));
						});
					_this.Request('DeleteSelectedContacts', {'contactsId[]': contactsForDeleteArray}, function(data) {_this.AfterDeleteSelectedContacts(data)});		
				}
			}
		}
	});
	
	$("#sendto").click(function(){
		var telephones = '';
		_this.contactList.find('tr:has(input:checked)').each(function() {
			telephones += $(this).attr('contactPhone')+'<'+$(this).attr('contactLastName')+' '+$(this).attr('contactName')+'>'+'---';
		});			
		document.location.href="index.php?numberlist="+telephones;
	});
	
	this.excelHeader.add(this.excelHeaderText).click(function(event) {
			event.stopImmediatePropagation();
			var target = $(event.target);
			_this.excelElementsBody.css('display', _this.excelElementsBody.css('display') == 'block' ? 'none' : 'block');
			_this.actionElementsBody.css('display', 'none');
			_this.moveElementsBody.css('display', 'none');
	});
	//выгрузка в excel
	$('#toExcel').click(function(event){
		//alert(_this.urlForAjaxRequests+'/loadToExcel.php');
		event.stopImmediatePropagation();	
		$('<iframe class="loadExcel" name="excel" src="'+_this.urlForAjaxRequests+'?ToExcel=1"></iframe>').appendTo('body'); 
	})
	
	this.hoverForControls();
}
//после изменения группы у выбранных контактов
clientSide.prototype.AfterGroupChangeSelectedContacts = function(data)
{
	_this = this;
	if (data.state == 'good')
	{	
		$.each(data.contactsids, function() {
			image = $('#'+data.newGroup+' p span.toggle-group');
			if (image.hasClass("ui-icon-circle-arrow-e"))
			{
				image.removeClass("ui-icon-circle-arrow-e");
				image.addClass("ui-icon-circle-arrow-s");
			}
			_this.contactList.find('tr#'+this).appendTo('#group-'+data.newGroup+' table tbody');			
		});
		console.log("#"+data.newGroup+"p a");
		$("#"+data.newGroup+" p a").first().click();
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['CONTACT_ADD_ERR']);
	}
}
//после удаления элементов
clientSide.prototype.AfterDeleteSelectedContacts = function(data)
{
	_this = this;
	if (data.state == 'good')
	{
		$.each(data.ids, function() {
			_this.contactList.find('tr#'+this).remove();
		});	
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['DELETE_ERR']);
	}
}
//инициализация кнопок группы
clientSide.prototype.InitGroupsList = function (event)
{   
	_this = this;
	$(".selectall").click(function(){
		currentState = $(this).attr("checked");
		$(this).parent().next().next().find('input[type=checkbox]').each(function(i,box){
			box = $(box);
			if(currentState=='checked')
			{
				box.attr("checked",true);
			}
			else
			{
				box.attr("checked",false);
			}
		});
	});
	$("#contact-list").click(function(event) {
		
//		event.stopImmediatePropagation();
		
		var target = $(event.target);


		//редактирование группы
		if (target.hasClass("edit-group"))
		{
			$('.edit-group-dialog').insertAfter($('.groups-list'));
			event.stopImmediatePropagation();	
			groupEdit = $("#group-edit");
			groupName = target.parent().find('a').text();
			_this.editGroupId.val(target.parent().parent().attr('id'));
			_this.editGroupName.val(groupName);
			groupEdit.dialog('option', 'title', _this.mess['GROUP_EDIT']+groupName);
			groupEdit.dialog('open');		
		}
		//обработка удаления группы
		if (target.hasClass("delete-group"))
		{
			event.stopImmediatePropagation();	
			//получим id удаляемой группы
			groupToDeleteId = target.closest('div').attr('id');
			var question = '';
			if (groupToDeleteId == 0)
			{
				question = _this.mess['CONTACTS_DELETE'];
			}
			else
			{
				question = _this.mess['GROUP_DELETE'];
			}
			
			if (confirm(question))
			{
				
				
				_this.Request("DeleteGroup", 
										{id: groupToDeleteId},
											function(data) 
											{
												data.groupId = groupToDeleteId; 
												_this.AfterGroupDelete(data);
											}										
										);
			}
		}
		if (target.is("div.edit-contact")) 
		{
			$('.contact-edit-dialog').insertAfter($('.dataTables_wrapper'));
			contactEdit = $("#contact-edit");
			
			tr = target.closest('tr');
			
			contactEdit.dialog('option', 'title', _this.mess['CONTACT_EDIT']+tr.attr('contactlastname')+' '+tr.attr('contactname'));
			_this.editLastName.val(tr.attr('contactlastname'));
			_this.editName.val(tr.attr('contactname'));
			_this.editPhone.val(tr.attr('contactphone'));
			_this.editGroup.val(tr.attr('groupid'));
			_this.contactId.val(tr.attr('id'));
			contactEdit.dialog('open');		
		}
		else if (target.is("div.delete-contact"))
		{
			if (confirm(_this.mess['ARE_YOU_SURE']))
			{
				_this.Request("ContactDelete", {contactId: target.closest('tr').attr('id')}, function(data) { _this.AfterContactDelete(data)});
			}
		}
		else if (target.is("input[type=checkbox]"))
		{
			target.parent().parent().toggleClass('ui-selecting');
			//если выбран хотя бы один чекбокс, тогда активизируем контролы
			if (target.parent().parent().parent().find('input[type=checkbox]:checked').size() > 0)
			{
				$("#sendto").button( "option", "disabled", false );
				//перемещения
				_this.movingHeaderText.addClass('moveElements-header-text-enabled');
				_this.movingHeader.addClass('dashed');

			}
			else
			{
				$("#sendto").button( "option", "disabled", true );
				//перемещения
				_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
				_this.movingHeader.removeClass('dashed');	
				_this.moveElementsBody.css('display','none');
			}
			
		}
		else if (target.is("td"))
		{
			var clickedTr = $(target.parent());			
			checkbox = clickedTr.find("input[type=checkbox]");
			if(checkbox.attr("checked")==undefined || checkbox.attr("checked")==false)
			{
				clickedTr.addClass('ui-selecting');
				checkbox.attr("checked","checked");
			}
			else
			{
				clickedTr.removeClass('ui-selecting');
				checkbox.attr("checked",false);
			}
			
			//если выбран хотя бы один чекбокс, тогда активизируем контролы
			if (target.parent().parent().parent().find('input[type=checkbox]:checked').size() > 0)
			{
				$("#sendto").button( "option", "disabled", false );
				//перемещения
				_this.movingHeaderText.addClass('moveElements-header-text-enabled');
				_this.movingHeader.addClass('dashed');
			}
			else
			{
				$("#sendto").button( "option", "disabled", true );
				//перемещения
				_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
				_this.movingHeader.removeClass('dashed');				
				_this.moveElementsBody.css('display','none');

			}
		}
	});
	
	this.AddHoverEffectForContactList();
}
clientSide.prototype.LoadContactsToGroup = function(data, groupIdent) {
	if (data != '')
	{
		$groupElement = $('#contact-list div#'+groupIdent+' table tbody');
		$groupElement.html('');
		$(data).each(function() {
			$groupElement.append(
			'<tr id="'+this.id+'" groupId="'+groupIdent+'" contactLastName="'+this.lastname+'" contactName="'+this.name+'" contactPhone="'+this.phone+'">' +
												'<td><input type="checkbox" /></td>'+
												'<td class="lastname">'+this.lastname+'</td>'+
												'<td class="name" '+(this.name==''?'style="width:0px"':"")+'>'+this.name+'</td>'+
												'<td class="phone" '+(this.name==''?'"style="width:180px"':"")+'>'+this.phone+'</td>'+
												'<td><div class="edit-contact ui-icon-wrench"></div></td>'+
												'<td><div class="delete-contact ui-icon-close"></div></td>'+
												'<td><div class="add-to-phone-list ui-icon-arrowstop-1-e"></div></td></tr>');
		})
	}		
}
//добавляем ховер эфферкт для групп листа
/*clientSide.prototype.AddHoverEffectForGroupList = function()
{
	$(this.groupList).find('li')
	.hover(
		function () { $(this).addClass("group-hover")},       
		function () { $(this).removeClass("group-hover")}
	);	
}*/
//ховер эффект для контрола перемещения
clientSide.prototype.hoverForControls = function(){
	$('.moveElements-body div').hover(
		function () { $(this).addClass('ui-selected')}, 
  		function () { $(this).removeClass('ui-selected')}
	);
	$('.actionElements-body div').hover(
		function () { $(this).addClass('ui-selected')}, 
  		function () { $(this).removeClass('ui-selected')}
	);
}
//добавляем ховер эффект для контакт листа
clientSide.prototype.AddHoverEffectForContactList = function()
{
	$("#contacts table tbody").find('tr')
	.hover(
		function () { $(this).addClass("ui-selected")},       
		function () { $(this).removeClass("ui-selected")}
	);
	
	this.AddHoverEffectForGroupIcons();
	this.AddHoverEffectForContactIcons();	
}
//добавляем hover effect для кнопочег группы
clientSide.prototype.AddHoverEffectForGroupIcons = function(mainObject)
{
	var _this = this;
	$("#contact-list p.group-header > span").hover(
		function () { $(this).addClass('small-buttons-hover')},       
		function () { $(this).removeClass('small-buttons-hover')}	
	);
}
//добавляем hover effect для кнопочег контакта
clientSide.prototype.AddHoverEffectForContactIcons = function() 
{
	var _this = this;
	$("#contact-list div.group-body td.edit-contact, td.delete-contact, td.add-to-phone-list").hover(
		function () { $(this).addClass('hover')},       
		function () { $(this).removeClass('hover')}	
	);	
}
//функция возвращает уникальный список номеров, без пустых значений
clientSide.prototype.GetPhoneNumbers = function()
{
	var numbersList = this.textareaPhoneList.val();
	
	numbersList = numbersList.replace(/\n/g, ';');
	numbersList = numbersList.replace(/,/g, ';');
	
	var array = numbersList.split(";");
	var arrayWithoutEmpty = new Array();
	
	for (var ind in array)
	{
		if (array[ind] != "")
		{
			arrayWithoutEmpty.push(array[ind]);	
		}
	}
	
	var result_array = array_unique(arrayWithoutEmpty);
	
	return result_array;
}
//функция удаляет какой-нибудь элемент массива
clientSide.prototype.deletePhoneNumber =  function(phoneNumberForDelete)
{
	var numbersList = this.textareaPhoneList.val();
	
	this.textareaPhoneList.val(numbersList.replace(phoneNumberForDelete+'\r\n', ""));
}
//функция для вывода ошибок
function updateTips(container, updatedText) 
{
	container.text(updatedText).css("color", "red");
}
//функция проверки длины поля
function checkLength(o, n, min, max, container) 
{
		if ( o.val().length > max || o.val().length < min ) 
		{
			o.addClass('ui-state-error');
			updateTips(container, _this.mess['FIELD_LENGTH'] + n + _this.mess['MUST_BE']+min+_this.mess['AND']+max);
			return false;
		} 
		else 
		{
			return true;
		}
}

//наличие номера в массиве
function in_array(needle, haystack) 
{
	var found = false, key;

	for (key in haystack) 
	{
		if (haystack[key] === needle)
		{
			found = true;
			break;
		}
	}

	return found;
}
//возвращает уникальные ключи массива
function array_unique(arr) 
{
	var tmp_arr = new Array();
	
	for (i = 0; i < arr.length; i++) 
	{
		if (arr[i].length == 11 && arr[i][0] == 8)
		{
			arr[i] = "7" + arr[i].slice(1); 	
		}
		
		if (!in_array(arr[i], tmp_arr)) 
		{
			tmp_arr.push(arr[i]);
		}
	}
	
	return tmp_arr;
}







	//инициализация кнопки добавления нового контакта
	clientSide.prototype.InitAddingContactButton = function ()
	{
		_this = this;
		if (_this.lang == 'ru')
		{				
			var name = $("#name"), lastname = $("#lastname"), telephone = $("#telephone"), group = $("#groups"), allFields = $([]).add(lastname).add(name).add(telephone), tips = $("#contactTip");
			
			$("#dialog").dialog({
					bgiframe: true,
					resizable: false,
					autoOpen: false,
					width: 320,
					modal: false,
					dialogClass: 'new-contact',
					buttons: {
						'Сохранить контакт': function() {
							var bValid = true;
							allFields.removeClass('ui-state-error');

//							bValid = bValid && checkLength(lastname, _this.mess['SECOND_NAME'], 2, 30, tips);
//							bValid = bValid && checkLength(name, _this.mess['NAME'], 2, 30, tips);
							bValid = bValid && checkLength(telephone, _this.mess['TELEPHONE'], 4, 15, tips);
							
							if (bValid) 
							{
								_this.Request("AddNewContact", 
												{'lastname': lastname.val(), 'name': name.val(), 'phone': telephone.val(), 'group': group.val()},
												function(data) 
												{ 
													data.lastname = lastname.val();
													data.name = name.val();
													data.telephone = telephone.val();
													data.group = group.val(),
													_this.AfterContactAdd(data);
													$("#dialog").dialog('close'); 
												}										
												);
							}
						},
						'Создать группу': function() {
							$("#group").dialog('open');	
						},
						'Закрыть': function() {
							$(this).dialog('close');
						}
					},
					close: function() {
						allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					}
				});
			}
			else
			{
						var name = $("#name"), lastname = $("#lastname"), telephone = $("#telephone"), group = $("#groups"), allFields = $([]).add(lastname).add(name).add(telephone), tips = $("#contactTip");
			
			$("#dialog").dialog({
					bgiframe: true,
					resizable: false,
					autoOpen: false,
					width: 400,
					modal: false,
					dialogClass: 'new-contact',
					buttons: {
						'Save contact': function() {
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(lastname, _this.mess['SECOND_NAME'], 2, 30, tips);
							bValid = bValid && checkLength(name, _this.mess['NAME'], 2, 30, tips);
							bValid = bValid && checkLength(telephone, _this.mess['TELEPHONE'], 4, 15, tips);
							
							if (bValid) 
							{
								_this.Request("AddNewContact", 
												{'lastname': lastname.val(), 'name': name.val(), 'phone': telephone.val(), 'group': group.val()},
												function(data) 
												{ 
													data.lastname = lastname.val();
													data.name = name.val();
													data.telephone = telephone.val();
													data.group = group.val(),
													_this.AfterContactAdd(data);
													$("#dialog").dialog('close'); 
												}										
												);
							}
						},
						'Create a template': function() {
							$("#group").dialog('open');	
						},
						'Close': function() {
							$(this).dialog('close');
						}
					},
					close: function() {
						allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					}
				});	
			}

		$('.new-contact').insertAfter($('#create-user'));
		
		$('#create-user').click(function() {
				$('#dialog').dialog('open');
			})
			.hover(
				function(){ 
					$(this).addClass("ui-state-hover"); 
				},
				function(){ 
					$(this).removeClass("ui-state-hover"); 
				}
			).mousedown(function(){
				$(this).addClass("ui-state-active"); 
			})
			.mouseup(function(){
					$(this).removeClass("ui-state-active");
		});	
	}
	
	//инициализация окна редактирования контакта
	clientSide.prototype.InitEditContact = function()
	{
		var _this = this;
		if (_this.lang == 'ru')
		{
			var allFields = $([]).add(this.editLastName).add(this.editName).add(this.editPhone), tips = $("#contactEditTip");
			
			$('#contact-edit').dialog({
					bgiframe: true,
					autoOpen: false,
					resizable: false,
					width: 400,
					modal: false,
					dialogClass: 'contact-edit-dialog',
					buttons: {
						'Сохранить': function(){
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editLastName, _this.mess['SECOND_NAME'], 2, 30, tips);
							bValid = bValid && checkLength(_this.editName, _this.mess['NAME'], 2, 30, tips);
							bValid = bValid && checkLength(_this.editPhone, _this.mess['TELEPHONE'], 4, 15, tips);
							
							if (bValid) 
							{
								_this.Request("ContactEdit", 
												{
													lastname: _this.editLastName.val(),
													name: _this.editName.val(),
													phone: _this.editPhone.val(),
													group: _this.editGroup.val(),
													contactId: _this.contactId.val()
												},
													function(data) 
													{
														_this.AfterContactEdit(data);
														_this.contactEditDialog.dialog('close');
													}										
												);
							}
						},
						'Закрыть': function() {
							$(this).dialog('close');
						}
					},
					close: function() {
						allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					} 
			});
		}
		else
		{
			var allFields = $([]).add(this.editLastName).add(this.editName).add(this.editPhone), tips = $("#contactEditTip");
			
			$('#contact-edit').dialog({
					bgiframe: true,
					autoOpen: false,
					resizable: false,
					width: 400,
					modal: false,
					dialogClass: 'contact-edit-dialog',
					buttons: {
						'Save': function(){
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editLastName, _this.mess['SECOND_NAME'], 2, 30, tips);
							bValid = bValid && checkLength(_this.editName, _this.mess['NAME'], 2, 30, tips);
							bValid = bValid && checkLength(_this.editPhone, _this.mess['TELEPHONE'], 4, 15, tips);
							
							if (bValid) 
							{
								_this.Request("ContactEdit", 
												{
													lastname: _this.editLastName.val(),
													name: _this.editName.val(),
													phone: _this.editPhone.val(),
													group: _this.editGroup.val(),
													contactId: _this.contactId.val()
												},
													function(data) 
													{
														_this.AfterContactEdit(data);
														_this.contactEditDialog.dialog('close');
													}										
												);
							}
						},
						'Close': function() {
							$(this).dialog('close');
						}
					},
					close: function() {
						allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					} 
			});	
		}		
	}

	//инициализируем кнопку добавления группы
	clientSide.prototype.InitAddingGroupButton = function ()
	{
		var _this = this;
		if(_this.lang == 'ru')
		{
			var groupname = $("#groupname"), allFields = $([]).add(groupname), tips = $("#groupTip");
			
			$("#group").dialog({
					bgiframe: true,
					autoOpen: false,
					width: 400,
					resizable: false,
					modal: false,
					dialogClass: 'add-group',
					buttons: {
						'Сохранить': function() {
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(groupname, _this.mess['GROUP_NAME'], 2, 30, tips);
							
							if (bValid) 
							{
								_this.Request("AddNewGroup", 
												{'groupname': groupname.val()},
													function(data) 
													{
														data.name = groupname.val();
														$("#group").dialog('close');
														_this.AfterGroupAdd(data);
													}										
												);
							}
						},
						'Закрыть': function() {
							$(this).dialog('close');
						}
					},
					close: function() {
						allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					}
				});
			}
			else
			{
				var groupname = $("#groupname"), allFields = $([]).add(groupname), tips = $("#groupTip");
				
				$("#group").dialog({
						bgiframe: true,
						autoOpen: false,
						width: 400,
						resizable: false,
						modal: false,
						dialogClass: 'add-group',
						buttons: {
							'Save': function() {
								var bValid = true;
								allFields.removeClass('ui-state-error');

								bValid = bValid && checkLength(groupname, _this.mess['GROUP_NAME'], 2, 30, tips);
								
								if (bValid) 
								{
									_this.Request("AddNewGroup", 
													{'groupname': groupname.val()},
														function(data) 
														{
															data.name = groupname.val();
															$("#group").dialog('close');
															_this.AfterGroupAdd(data);
														}										
													);
								}
							},
							'Close': function() {
								$(this).dialog('close');
							}
						},
						close: function() {
							allFields.val('').removeClass('ui-state-error');
							tips.text(_this.mess['ALL_FIELDS']).css("color", "");
						}
					});	
				}
		
		
		
		$('#create-group').click(function() {
				$('#group').dialog('open');
				$('.add-group').insertAfter($('#newgroup'));
			})
			.hover(
				function(){ 
					$(this).addClass("ui-state-hover"); 
				},
				function(){ 
					$(this).removeClass("ui-state-hover"); 
				}
			).mousedown(function(){
				$(this).addClass("ui-state-active"); 
			})
			.mouseup(function(){
					$(this).removeClass("ui-state-active");
		});			
	}
	
	
	
	
	
	//инициализация редактирования группы
	clientSide.prototype.InitEditGroup = function()
	{
		var _this = this; 
				
		if (_this.lang == 'ru')
		{
			tips = $('#groupEditTip');
			allFields = $([]).add(_this.editGroupName);
			
			$('#group-edit').dialog({
					bgiframe: true,
					autoOpen: false,
					width: 400,
					resizable: false,
					modal: false,
					dialogClass: 'edit-group-dialog',
					buttons: {
						'Сохранить': function(){
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editGroupName, _this.mess['GROUP_NAME'], 2, 30, tips);
							
							if (bValid) 
							{
								_this.Request("GroupEdit", 
												{
													groupId: _this.editGroupId.val(),
													groupName: _this.editGroupName.val()
												},
													function(data) 
													{
														_this.AfterGroupEdit(data);
														$('#group-edit').dialog('close');
													}										
												);
							}
						},
						'Закрыть': function() {
							$(this).dialog('close');
						}
					},
					close: function() {
						allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					} 
			});
		}
		else
		{
			tips = $('#groupEditTip');
			allFields = $([]).add(_this.editGroupName);
			
			$('#group-edit').dialog({
			bgiframe: true,
			autoOpen: false,
			width: 450,
			resizable: false,
			dialogClass: 'edit-group-dialog', 
			modal: false,
			buttons: {
				'Save': function(){
					var bValid = true;
					allFields.removeClass('ui-state-error');

					bValid = bValid && checkLength(_this.editGroupName, _this.mess['GROUP_NAME'], 2, 30, tips);
					
					if (bValid) 
					{
						_this.Request("GroupEdit", 
										{
											groupId: _this.editGroupId.val(),
											groupName: _this.editGroupName.val()
										},
											function(data) 
											{
												_this.AfterGroupEdit(data);
												$('#group-edit').dialog('close');
											}										
										);
					}
				},
				'Close': function() {
					$(this).dialog('close');
				}
			},
			close: function() {
				allFields.val('').removeClass('ui-state-error');
				tips.text(_this.mess['ALL_FIELDS']).css("color", "");
			} 
			});	
		}		
	}
	//инициализация диалога для индикации ajax загрузки
	clientSide.prototype.InitAjaxLoadingDialog = function ()
	{
		_this = this;
		$("#ajaxloading").dialog({
			closeOnEscape: false,
			bgiframe: true,
			autoOpen: false,
			modal: false,
			resizable: false,
			open: function(event, ui) {  
				$('#ajaxloading').prev().find("a.ui-dialog-titlebar-close").hide();
				
				$(document).keypress(function(event) {
					if (event.which == 0)
					{
						event.preventDefault();
					} 
				})
			},
			close: function() {
				$(document).unbind('keypress');	
			}
		});
		
	}
	//инициализация диалог для сообщений
	clientSide.prototype.InitAjaxMessageDialog = function ()
	{
		_this = this;
		if (_this.lang == 'ru')
		{
			$("#ajaxdialog").dialog({
				bgiframe: true,
				resizable: false,
				autoOpen: false,
				modal: false,
				buttons: {
						'Закрыть': function() {
							$(this).dialog('close');
						}
				}
			});
		}
		else
		{
			$("#ajaxdialog").dialog({
			bgiframe: true,
			resizable: false,
			autoOpen: false,
			modal: false,
			buttons: {
					'Close': function() {
						$(this).dialog('close');
					}
				}
			});	
		}	
	}

	
	

//функция вызывается после добавления контакта
clientSide.prototype.AfterContactAdd = function(data)
{
	if (data.state == 'good')
	{
		$("#contact-list #group-"+data.group+" table tbody").append(
			'<tr id="'+data.id+'" groupId="'+data.group+'" contactLastName="'+data.lastname+'" contactName="'+data.name+'" contactPhone="'+data.telephone+'">' +
											'<td><input type="checkbox" /></td>'+
											'<td class="lastname">'+data.lastname+'</td>'+
											'<td class="name">'+data.name+'</td>'+
											'<td class="phone">'+data.telephone+'</td>'+
											'<td><div class="edit-contact ui-icon ui-icon-pencil" title="Изменить контакт"></div></td>'+
											'<td><div class="delete-contact ui-icon ui-icon-close" title="Удалить контакт"></div></td>'+
											'<td><div class="send-contact ui-icon ui-icon-mail-closed" title="Отправить на номер"></div></td>'+
										'</tr>'
							);
		tableSort($("#contact-list #group-"+data.group+" table tbody"));					
		this.AddHoverEffectForContactList();
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], data.text);
	}
}
//функция вызывается после добавления группы
clientSide.prototype.AfterGroupAdd = function(data)
{
	if (data.state == 'good')
	{
		this.groupList.append('<div id = "'+data.id+'"> \
									<p class = "group-header"> \
										<a class="">'+data.name+'</a>\
										<span class = "edit-group ui-icon-pencil" title="Редактировать название группы"></span> \
										<span class = "delete-group ui-icon-close" title="Удалить группу"></span> \
										<a href="index.php?addfromgroup='+data.id+'" class="add-all-group-numbers ui-icon-mail-closed" title="Отправить на все контакты из группы"></a> \
									</p></div>');
									
		$(".groupcontent").append('<div id="group-'+data.id+'" class="group-number"><div class="group-body"><h3>Группа &laquo;'+data.name+'&raquo;</h3><table><tbody></tbody></table></div></div>');
		$("#groups").append("<option value="+data.id+" selected>"+data.name+"</option>");
		$("#edit-groups").append("<option value="+data.id+">"+data.name+"</option>");
		this.AddHoverEffectForGroupIcons();
		
		this.moveElementsBody.append("<div groupid="+data.id+">"+data.name+"</div>");
		this.hoverForControls();
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['NEW_GROUP_ERR']);	
	}	
}
//функция после редактирования группы
clientSide.prototype.AfterGroupEdit = function(data)
{
	if (data.state == 'good')
	{
		$("#contact-list #"+data.id+" p a").text(data.groupname);
		$("#group-"+data.id+" h3").html("Группа &laquo;"+data.groupname+"&raquo;");
		$('#edit-groups option[value='+data.id+']').text(data.groupname);
		$('#groups option[value='+data.id+']').text(data.groupname);
		$(".moveElements-body div[groupid="+data.id+"]").text(data.groupname);
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_EDIT_ERR']); 
	}	
}
//функция после реадктирования элемента
clientSide.prototype.AfterContactEdit = function(data)
{
	$('.contact-edit-dialog').insertAfter($('.dataTables_wrapper'));
	if (data.state == 'good')
	{		
		//если поменялась группа, то тогда нужно удалять узел и прикреплять его в другое место
		if (data.groupChange == "Y")
		{
			$("#"+data.oldGroup+" table tbody").find("tr[id="+data.contactId+"]").remove();
			$("#"+data.newGroup+" table tbody").append(
				'<tr id="'+data.contactId+'" groupId="'+data.newGroup+'" contactLastName="'+data.newLastName+'" contactName="'+data.newName+'" contactPhone="'+data.newPhone+'">' +
											'<td><input type="checkbox" /></td>'+
											'<td class="lastname">'+data.newLastName+'</td>'+
											'<td class="name">'+data.newName+'</td>'+
											'<td class="phone">'+data.newPhone+'</td>'+
											'<td><div class="edit-contact ui-icon-wrench"></div></td>'+
											'<td><div class="delete-contact ui-icon-close"></div></td>'+
											'<td><div class="add-to-phone-list ui-icon-arrowstop-1-e"></div></td>'+
										'</tr>'
			);
			this.AddHoverEffectForContactList();
		}
		//иначе просто меняем данные о контакте
		else
		{
			objTrContact = $("#group-"+data.oldGroup+" table tbody").find("tr[id="+data.contactId+"]");
			
			objTrContact.attr('id', data.contactId);
			arrTdContacts = objTrContact.find("td");
			arrTdContacts.eq(1).text(data.newLastName);
			arrTdContacts.eq(2).text(data.newName);
			arrTdContacts.eq(3).text(data.newPhone);
/*			arrTdContacts.eq(3).addClass("edit-contact ui-icon-wrench");*/
			objTrContact.attr("id", data.contactId);
			objTrContact.attr("groupId", data.newGroup);
			objTrContact.attr("contactLastName", data.newLastName);
			objTrContact.attr("contactName", data.newName);
			objTrContact.attr("contactPhone", data.newPhone);
		}	
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['CONTACT_EDIT_ERR']);
	}		
}
//после удаления контакта
clientSide.prototype.AfterContactDelete = function(data)
{
	if (data.state == 'good')
	{
		$("#contact-list tr[id="+data.contactId+"]").remove();
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['CONTACT_DELETE_ERR']);
	}	
}
//после удаления группы
clientSide.prototype.AfterGroupDelete = function(data)
{
	if (data.state == 'good')
	{
		if (data.groupId==0)
			$("#"+data.groupId+" "+"div.group-body table tbody").remove();
		else
			$("#"+data.groupId).remove();
		
		/*image = $("#"+data.groupId).find("span.toggle-group");	
				
		if (image.hasClass("ui-icon-circle-arrow-e"))
		{
			image.removeClass("ui-icon-circle-arrow-e");
			image.addClass("ui-icon-circle-arrow-s");
		}
		else
		{
			image.removeClass("ui-icon-circle-arrow-s");
			image.addClass("ui-icon-circle-arrow-e");
		}*/
		
		$("#groups option[value="+data.groupId+"]").remove();
		$("#edit-groups option[value="+data.groupId+"]").remove();
		$(".moveElements-body div[groupid="+data.groupId+"]").remove();
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_DELETE_ERR']);
	}
}
//после добавления контактов
clientSide.prototype.AfterContactAddFromExcel = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		//сначала добавим новые группы, если они есть
		if (data.newGroups.length > 0)
		{
			for(var index in data.newGroups)
			{
				this.groupList.append('<div id = "'+data.newGroups[index].id+'"> \
										<p class = "group-header ui-widget-header"> \
											<span class = "toggle-group ui-icon-circle-arrow-e"></span><a>'+data.newGroups[index].name+'</a> \
											<span class = "edit-group ui-icon-wrench" title="Редактировать название группы"></span> \
											<span class = "add-all-group-numbers ui-icon-arrowstop-1-e" title="Добавить все контакты из группы"></span> \
											<span class = "delete-group ui-icon-close" title="Удалить группу"></span> \
										</p>\
										<div class="group-body"> \
											<table><tbody></tbody></table>\
										</div>\
			                      </div>');
				$("#groups").append("<option value="+data.newGroups[index].id+" selected>"+data.newGroups[index].name+"</option>");
				$("#edit-groups").append("<option value="+data.newGroups[index].id+">"+data.newGroups[index].name+"</option>");
				this.moveElementsBody.append("<div groupid="+data.newGroups[index].id+">"+data.newGroups[index].name+"</div>");
			}
			this.AddHoverEffectForGroupIcons();
			this.hoverForControls();
		}
		
		 
		if (data.success > 0)
		{
			for (var i in data.addedContacts)
			{
				addedContacts = data.addedContacts;
				//добавляем контакты в группу "не в группе"
				$("#contact-list #"+addedContacts[i].groups+" table tbody").append(
					'<tr id="'+addedContacts[i].id+'" groupId="'+addedContacts[i].groups+'" contactLastName="'+addedContacts[i].lastname+'" contactName="'+addedContacts[i].firstname+'" contactPhone="'+addedContacts[i].phone+'">' +
											'<td><input type="checkbox" /></td>'+
											'<td class="lastname">'+addedContacts[i].lastname+'</td>'+
											'<td class="name">'+addedContacts[i].firstname+'</td>'+
											'<td class="phone">'+addedContacts[i].phone+'</td>'+
											'<td><div class="edit-contact ui-icon ui-icon-pencil"></div></td>'+
											'<td><div class="delete-contact ui-icon ui-icon-close"></div></td>'+
											'<td><div class="send-contact ui-icon ui-icon-mail-closed"></div></td>'+
										'</tr>'
				);
			}
			
			_this.AddHoverEffectForContactList();
		}
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['SUCCESS_DOWNLOAD']+data.success+_this.mess['UNSUCCESS_DOWNLOAD']+data.fail);
	}	
}
clientSide.prototype.Request = function(method, postData, handler, url)
{	
	if (!url)
		url = this.urlForAjaxRequests;
	postData.action = method;
	postData.ajaxrequest = 'Y';
	postData.session = this.session;
	
	if (!handler)
	{
		handler = function(result) {};
	}
	posthandler = function(data) {
		$("#ajaxloading").dialog('close');	
		handler(data);
	};
	$("#ajaxloading").dialog('open');
	$.post(url, postData, posthandler, "json");
}
clientSide.prototype.ShowNote = function(title, text)
{
	this.ajaxDialog.dialog('option', 'title', title);
	this.ajaxDialogText.html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + text);
	this.ajaxDialog.dialog('open');			
}
clientSide.prototype.ShowError = function(title, text)
{
	this.ajaxDialog.dialog('option', 'title', title);
	this.ajaxDialogText.html('<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' + '<span style="color:red">'+text+'</span>');
	this.ajaxDialog.dialog('open');				
}
//подсчет параметров сообщения
clientSide.prototype.Recount = function()
{
	var text = this.message.val();
	/*дьявольский хак
	* \n - в FF - это один символ, в IE - два, поэтому вынуждены делать так  
	*/
	//определяем, IE это или нет
	if (text.match(/\r/g) == null)
	{
		//считаем количество символов
		var newLinesymbols = text.match(/\n/g);
		newLinesymbolsCount = (newLinesymbols != null)? newLinesymbols.length : 0;					
	}
	
	//исходя из хака считаем количество символов
	textLength = text.length + newLinesymbolsCount;
	//определяем длину части
	messLenPart = (isRus(text)) ? ((textLength) > 70 ? 66 : 70) : ((textLength) > 160 ? 153 : 160);
	
	var parts = Math.ceil(textLength / messLenPart);
	
	this.messageLength.text(textLength);
	this.partSize.text(messLenPart);
	this.parts.text(parts);
	this.needSms.text(parts * this.correctNums.text());
}
                  
function tableSort(jqTableObject)
{
	table = jqTableObject.get(0);
	var a = new Array();
	for(i=0; i < table.rows.length; i++) 
	{
		a[i] = new Array();
		a[i][0]=table.rows[i].getElementsByTagName("td").item(1).innerHTML.toLowerCase();
		a[i][1]=table.rows[i];
	}
	a.sort();
	$(table).html('');
	for(i=0; i < a.length; i++)
		table.appendChild(a[i][1]);
}