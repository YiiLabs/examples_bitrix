new function($) {
	$.fn.getCursorPosition = function() {
	    var pos = 0;
	    var el = $(this).get(0);
	    // IE Support
	    if (document.selection) {
	        el.focus();
	        var Sel = document.selection.createRange();
	        var SelLength = document.selection.createRange().text.length;
	        Sel.moveStart('character', -el.value.length);
	        pos = Sel.text.length - SelLength;
	    }
	    // Firefox support
	    else if (el.selectionStart || el.selectionStart == '0')
	        pos = el.selectionStart;

	    return pos;
	}
}(jQuery);

function getCursorRow(textarea)
{
	currentPos = 0;
	
	values = textarea.val().split('\n');
	cursorPos = textarea.getCursorPosition();
	cursorRow = 0;
	for(var i=0;i<values.length;i++)
	{
		row = values[i];			
		if(cursorPos>=currentPos && cursorPos<=(currentPos+row.length))
		{
			cursorRow = i;
			break;
		}			
		currentPos += row.length+1;
	}
	return cursorRow;	
}

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
	this.searchInputOnForm = $('#destinationNumber');
	this.searchInputOnFormPrevValue = '';
	this.searchResult = $('#search-result');
	this.searchResultOnForm = $('#search-result-on-form');
	this.lastSearch = '';
	this.lastpress = 0;
	this.intab = false;
	
	this.ajaxLoading = $("#ajaxloading");
	this.ajaxDialog = $("#ajaxdialog");
	this.ajaxDialogText = $("#ajaxdialog p");
	this.textareaPhoneList = $("#numbers-list");
	this.groupList = $("#contact-list");
	this.contactEditDialog = $("#contact-edit");
	//это поле в другой! компоненте, форме отправки sms
	this.destination_number = $("#destinationNumber");
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
	this.message = $('#message');
	this.mess = params.mess;
	this.lang = params.lang;
	
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
	this.InitUploadContactsFromExcel();
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
	
	if (_this.lang == 'ru')
	{
		var phonebook = $("#phonebook");
		$("#phonebook").dialog({
				bgiframe: true,
				autoOpen: false,
				resizable: false,
				width: 810,
				minWidth: 800,
				minHeight: 600,
				modal: false,
				buttons: {
					'Заполнить список получателей': function(){
						if (_this.destination_number.hasClass('gray'))
						{
							_this.destination_number.removeClass('gray');
							_this.destination_number.val('');
						}
						_this.destination_number.val(_this.textareaPhoneList.val());						
						_this.textareaPhoneList.val('');
												

						var message = $('#message');
						
						if (message.hasClass('gray'))
						{
							message.removeClass('gray');
							message.val('');
						}
						 
						var text = '';
						$('#editTemplates').find('input[type=checkbox]:checked').parents('tr').each(function() {
							text += $(this).find('td').eq(2).text();
						})
						
						message.val(message.val() + text);
						
						$('#editTemplates').find('input[type=checkbox]:checked').attr('checked', false);
						
						_this.Recount();
						
						window.mainObject.CountDestination(_this.destination_number[0]);
						$(this).dialog('close');
					},
					'Заполнить шаблон и получателей': function() {
						$('#editTemplates').dialog('open');
					},
					'Очистить все': function() {
						_this.textareaPhoneList.val('');
						$("#contact-list").find("tr.ui-selecting").removeClass('ui-selecting');
					},
					'Закрыть': function() {
						$(this).dialog('close');
					}
				},
				close: function() {
//					$('#contact-list div table.group-tbl-container tbody tr').remove();
//					
//					
//					$('#contact-list span.ui-icon-circle-arrow-s').each(function() {
//						$(this).removeClass("ui-icon-circle-arrow-s");
//						$(this).addClass("ui-icon-circle-arrow-e");
//					});
//					
					$('.group-body').hide();
				} 
		});
	}
	else
	{
		var phonebook = $("#phonebook");
		$("#phonebook").dialog({
				bgiframe: true,
				autoOpen: false,
				resizable: false,
				width: 810,
				minWidth: 800,
				minHeight: 600,
				modal: false,
				buttons: {
					'Fill in the recipient list': function(){
						if (_this.destination_number.hasClass('gray'))
						{
							_this.destination_number.removeClass('gray');
							_this.destination_number.val('');
						}
						_this.destination_number.val(_this.textareaPhoneList.val());
						_this.textareaPhoneList.val('');
						
						var message = $('#message');
						
						if (message.hasClass('gray'))
						{
							message.removeClass('gray');
							message.val('');
						}
						
						var text = '';
						$('#editTemplates').find('input[type=checkbox]:checked').parents('tr').each(function() {
							text += $(this).find('td').eq(2).text();
						})
						
						message.val(message.val() + text);
						
						$('#editTemplates').find('input[type=checkbox]:checked').attr('checked', false);
						
						_this.Recount();
						
						window.mainObject.CountDestination(_this.destination_number[0]);
						$(this).dialog('close');
					},
					'Fill out the template and the recipient': function() {
						$('#editTemplates').dialog('open');
					},
					'Clear all': function() {
						_this.textareaPhoneList.val('');
						$("#contact-list").find("tr.ui-selecting").removeClass('ui-selecting');
					},
					'Close': function() {
						$(this).dialog('close');
					}
				} 
		});	
	}

	//tooltips
	$('#phonebook-load').click( function() {phonebook.dialog('open'); });
}

	
//загрузка из excel и csv файла номеров
clientSide.prototype.InitUpload = function()
{
	_this = this;
	//здесь создадим обработчег excel файла
	var phonesLoad = new AjaxUpload('excel-load',
	{
		action: 'excelupload/upload.php',
		//file upload name
		name: 'userfile',
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
			var str = new String();
			
			if (response.state != 'error')
			{
				_this.destination_number.val(response.join('\n'));
				_this.destination_number.removeClass('gray')
				window.mainObject.CountDestination(_this.destination_number[0]);	
			}
			else
			{
				_this.ShowError(_this.mess['ERROR'], response.text);
			}
			_this.ajaxLoading.dialog('close');
		}
	 }); 
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
	_this.lastpress = 0;
	
	this.searchInput.keyup(function(event) {
		event.stopImmediatePropagation();
		var date = new Date();
		_this.lastpress = date.getTime();
		//инициализируем события 
		$(document).unbind('ajaxStart');
	    $(document).unbind('ajaxStop');
	    
	    if (_this.lastSearch != _this.searchInput.val())
	    {
	    	setTimeout("_this.MakeSend("+_this.lastpress+")", 500);
		}
	});	
	
	this.searchInputOnForm.keyup(function(event) {
		event.stopImmediatePropagation();
		var date = new Date();
		_this.lastpress = date.getTime();	
		searchVal = _this.searchInputOnForm.val();    
	    if (_this.lastSearch != searchVal && _this.searchInputOnFormPrevValue != searchVal)
	    {
	    	setTimeout("_this.MakeSendOnForm("+_this.lastpress+")", 500);
	    	_this.searchInputOnFormPrevValue = searchVal;
		}
	});	
}
clientSide.prototype.MakeSend = function(date_lastpress)
{
	_this = this;
	if (date_lastpress == this.lastpress)
	{		
		this.lastSearch = _this.searchInput.val();
		this.searchInput.addClass('search-processing');
        
        // деинициализируем события 
        $(document).unbind('ajaxStart');
        $(document).unbind('ajaxStop');
        
		this.Request('search', {'strSearch':_this.searchInput.val()}, function(data) {_this.AfterSearch(data,_this.searchResult,'inbook')});
                
        //инициализируем события 
        $(document).ajaxStart(function() {
            _this.ajaxLoading.dialog('open');
        });        
        $(document).ajaxStop(function() {
            _this.ajaxLoading.dialog('close');
        }); 
	}
}
clientSide.prototype.MakeSendOnForm = function(date_lastpress)
{	
	_this = this;
	if (date_lastpress == this.lastpress)
	{
		this.lastSearch = _this.searchInput.val();
		this.searchInputOnForm.addClass('search-processing');
		values = _this.searchInputOnForm.val().split('\n');
		lastValueForSearch = '';
		cursorRow = getCursorRow(_this.searchInputOnForm);	
        
        //деинициализируем события 
        $(document).unbind('ajaxStart');
        $(document).unbind('ajaxStop');
    			 
		this.Request('search', {'strSearch':values[cursorRow]}, function(data) {_this.AfterSearch(data,_this.searchResultOnForm,'onform')});
        
        //инициализируем события 
        $(document).ajaxStart(function() {
            _this.ajaxLoading.dialog('open');
        });        
        $(document).ajaxStop(function() {
            _this.ajaxLoading.dialog('close');
        });    
	}
}
//после выполнения
clientSide.prototype.AfterSearch = function(data,container,action)
{
	//alert('отработал пост');
	_this = this;
	container.empty();
    _this.searchInput.removeClass('search-processing');
    _this.searchInputOnForm.removeClass('search-processing');
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
					contact = $('#'+eventTarget.attr('contactId'));
					values = _this.searchInputOnForm.val().split('\n');
					cursorRow = getCursorRow(_this.searchInputOnForm);
					values[cursorRow] = contact.attr('contactPhone')+'<'+contact.attr('contactLastName')+' '+contact.attr('contactName')+'>';
					newValue = values.join('\n');

					_this.searchInputOnForm.val(newValue+'\n');	
					_this.searchInputOnForm.focus();	
				}
				else
				{
					contact = $('#'+$(eventTarget).attr('contactId'));
					_this.textareaPhoneList.val(_this.textareaPhoneList.val()+contact.attr('contactPhone')+'<'+contact.attr('contactLastName')+' '+contact.attr('contactName')+'>'+'\n');
				}				
				onFormSearchContainer.css('display', 'none');
			}
			else
			{
				onFormSearchContainer.css('display', 'none');	
			}
				
		});

		container.fadeIn();
	}
	
	container.mouseover(function() {_this.intab = true;}).mouseout(function() {_this.intab = false;});
	
	$(document).click(function(event) {
		event.stopImmediatePropagation();
		if (false == _this.intab)
		{
			onFormSearchContainer.css('display', 'none'); 
		}
	});
}
//инициализация управляющих контролов
clientSide.prototype.InitControls = function()
{
	var _this = this;
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
			if (confirm(_this.mess['GROUP']+ target.text() + "?"))
			{
				_this.moveElementsBody.css('display', 'none');
				var contactsArray = new Array();
				_this.groupList.find('tr:has(input[checked])').each(
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
				if (confirm(_this.mess['CONTACTS_DELETE']))
				{
					_this.actionElementsBody.css('display', 'none');
					var contactsForDeleteArray = new Array();
					_this.groupList.find('tr:has(input[checked])').each(
						function() {
							contactsForDeleteArray.push($(this).attr('id'));
						});
					_this.Request('DeleteSelectedContacts', {'contactsId[]': contactsForDeleteArray}, function(data) {_this.AfterDeleteSelectedContacts(data)});		
				}
			}
			else if (action == 'add')
			{
				_this.actionElementsBody.css('display', 'none');
				var telephones = '';
				_this.groupList.find('tr:has(input[checked])').each(
					function() {
						telephones += $(this).attr('contactPhone')+'<'+$(this).attr('contactLastName')+' '+$(this).attr('contactName')+'>'+'\n';
					}
				);
			
				_this.textareaPhoneList.val(_this.textareaPhoneList.val()+telephones);	
			}
		}
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
		$('<iframe class="loadExcel" name="excel" src="/office/loadToExcel.php"></iframe>').appendTo('body'); 
	})
	
	this.hoverForControls();
}
//после изменения группы у выбранных контактов
clientSide.prototype.AfterGroupChangeSelectedContacts = function(data)
{
	_this = this;
	if (data.state == 'good')
	{	
		this.ShowNote(_this.mess['SUCCESS'], _this.mess['CONTACT_GROUP']);
		$.each(data.contactsids, function() {
			image = $('#'+data.newGroup+' p span.toggle-group');
			if (image.hasClass("ui-icon-circle-arrow-e"))
			{
				image.removeClass("ui-icon-circle-arrow-e");
				image.addClass("ui-icon-circle-arrow-s");
			}
			$('#'+data.newGroup+' div.group-body').slideDown('slow');
			_this.groupList.find('tr[id='+this+']').appendTo('#'+data.newGroup+' table tbody');
		});
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
		this.ShowNote(_this.mess['SUCCESS'], _this.mess['DELETED']+data.deletedContacts+_this.mess['CONTACTS']);
		$.each(data.ids, function() {
			_this.groupList.find('tr[id='+this+']').remove();
		});	
	}
	else
	{
		this.ShowError(_this.mess['ERROR'], _this.mess['DELETE_ERR']);
	}
}
//инициализация кнопок группы
clientSide.prototype.InitGroupsList = function ()
{   
	_this = this;
	$("#contact-list").click(function(event) {
		
		event.stopImmediatePropagation();
		
		var target = $(event.target);
		
		//отрабатываем нажатие на p
		if (target.is("p")) 
		{
			//$('#contact-list-load').css('opacity', '.9').show();
			//setTimeout(function() {
			var workarea = target.next();
			if (workarea.is(':visible'))
			{
				workarea.slideUp();	
			}
			else
			{
//				var groupIdVal = target.parents().attr("id");				
//				if ($('div#'+groupIdVal+' table tbody tr').length == 0)
//				{
//					_this.Request("LoadContactsToGroup", {groupId: groupIdVal}, function(data) {
//						_this.LoadContactsToGroup(data, groupIdVal);
//					});
//				}				
				workarea.slideDown();
			}
			
			//найдем картинку
			image = target.find("span.toggle-group");
			
			if (image.hasClass("ui-icon-circle-arrow-e"))
			{
				image.removeClass("ui-icon-circle-arrow-e");
				image.addClass("ui-icon-circle-arrow-s");
			}
			else
			{
				image.removeClass("ui-icon-circle-arrow-s");
				image.addClass("ui-icon-circle-arrow-e");
			}				
			//}, 1000);
			
		}
		
		//отрабатываем нажатие внутри p
		if (target.parent().is("p") && (target.hasClass("toggle-group") || target.is("a")))
		{
//			setTimeout(function() { 
				var workarea = target.parent().next();
				if (workarea.is(':visible'))
				{
					workarea.slideUp();	
				}
				else
				{
//					var groupIdVal = target.parents().parents().attr("id");
//					if ($('div#'+groupIdVal+' table tbody tr').length == 0)
//					{
//						_this.Request("LoadContactsToGroup", {groupId: groupIdVal}, function(data) {
//							_this.LoadContactsToGroup(data, groupIdVal);
//						});
//					}
					workarea.slideDown();
				}
				
				
				image = target.parent().find("span.toggle-group");
				if (image.hasClass("ui-icon-circle-arrow-e"))
				{
					image.removeClass("ui-icon-circle-arrow-e");
					image.addClass("ui-icon-circle-arrow-s");
				}
				else
				{
					image.removeClass("ui-icon-circle-arrow-s");
					image.addClass("ui-icon-circle-arrow-e");
				}
//			}, 1000);
		}
		
		//добавление всех номеров из группы в список
		if (target.hasClass("add-all-group-numbers"))
		{
//			if (target.parent().next().is(":visible"))
			{
				var numbers = '';
				target.parent().next().find("tr").each(function () { numbers += $(this).attr('contactPhone')+'<'+$(this).attr('contactLastName')+' '+$(this).attr('contactName')+'>'+'\n'; });
				_this.textareaPhoneList.val(_this.textareaPhoneList.val()+numbers);
					
				if ($.browser.opera)
					_this.textareaPhoneList.css("display", "block");
			}
//			else
//			{
//				var numbers = '';
//				var groupIdVal = target.parent().parent().attr('id');
//				_this.Request("LoadContactsToGroup", {groupId: groupIdVal}, function(data) {
//					$(data).each(function() {
//						numbers += this.phone+'<'+this.lastname+' '+this.name+'>'+'\n';
//					})
//					_this.textareaPhoneList.val(_this.textareaPhoneList.val()+numbers);
//				});
//				
//			}
		}
		//редактирование группы
		if (target.hasClass("edit-group"))
		{
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
		else if (target.is('div.add-to-phone-list'))
		{
			var clickedTr = target.closest('tr');
			clickedTr.addClass('ui-selecting');
			var telephone = clickedTr.attr("contactPhone")+'<'+clickedTr.attr('contactLastName')+' '+clickedTr.attr('contactName')+'>';
			
			if (in_array(telephone, _this.GetPhoneNumbers()))
			{
				_this.deletePhoneNumber(telephone);
				clickedTr.removeClass('ui-selecting');
			}
			else
			{
				var existingText = _this.textareaPhoneList.val();
				_this.textareaPhoneList.val(existingText+telephone+'\n');		
			}	
		}
		else if (target.is("input[type=checkbox]"))
		{
			//если выбран хотя бы один чекбокс, тогда активизируем контролы
			if (_this.groupList.find('input[checked]').size() > 0)
			{
				//перемещения
				_this.movingHeaderText.addClass('moveElements-header-text-enabled');
				_this.movingHeader.addClass('dashed');
				//дополнительные действия
				_this.actionHeaderText.addClass('moveElements-header-text-enabled');
				_this.actionHeader.addClass('dashed');
			}
			else
			{
				//перемещения
				_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
				_this.movingHeader.removeClass('dashed');	
				//дополнительные действия
				_this.actionHeaderText.removeClass('moveElements-header-text-enabled');
				_this.actionHeader.removeClass('dashed');
				
				_this.moveElementsBody.css('display','none');
				_this.actionElementsBody.css('display','none');
			}
			
		}
		else if (target.is("td"))
		{
			var clickedTr = $(target.parent());
			clickedTr.addClass('ui-selecting');
			var telephone = clickedTr.attr('contactPhone')+'<'+clickedTr.attr('contactLastName')+' '+clickedTr.attr('contactName')+'>';
			
			if (in_array(telephone, _this.GetPhoneNumbers()))
			{
				_this.deletePhoneNumber(telephone);
				clickedTr.removeClass('ui-selecting');
			}
			else
			{
				var existingText = _this.textareaPhoneList.val();
				_this.textareaPhoneList.val(existingText+telephone+'\n');		
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
	
	this.textareaPhoneList.val(numbersList.replace(phoneNumberForDelete+'\n', ""));
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
					width: 450,
					modal: true,
					buttons: {
						'Сохранить контакт': function() {
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
					width: 450,
					modal: true,
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
					modal: true,
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
					modal: true,
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
					modal: true,
					buttons: {
						'Сохранить': function() {
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(groupname, _this.mess['GROUP_NAME'], 2, 50, tips);
							
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
						modal: true,
						buttons: {
							'Save': function() {
								var bValid = true;
								allFields.removeClass('ui-state-error');

								bValid = bValid && checkLength(groupname, _this.mess['GROUP_NAME'], 2, 50, tips);
								
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
					width: 450,
					resizable: false,
					modal: true,
					buttons: {
						'Сохранить': function(){
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editGroupName, _this.mess['GROUP_NAME'], 2, 50, tips);
							
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
			modal: true,
			buttons: {
				'Save': function(){
					var bValid = true;
					allFields.removeClass('ui-state-error');

					bValid = bValid && checkLength(_this.editGroupName, _this.mess['GROUP_NAME'], 2, 50, tips);
					
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
			modal: true,
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
		
		//инициализируем события 
		$(document).ajaxStart(function() {
			_this.ajaxLoading.dialog('open');
		});
	    
	    $(document).ajaxStop(function() {
    		_this.ajaxLoading.dialog('close');
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
				modal: true,
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
			modal: true,
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
		//this.ShowNote(_this.mess['SUCCESS'], _this.mess['NEW_CONTACT']);
		$("#contact-list #"+data.group+" table tbody").append(
			'<tr id="'+data.id+'" groupId="'+data.group+'" contactLastName="'+data.lastname+'" contactName="'+data.name+'" contactPhone="'+data.telephone+'">' +
											'<td><input type="checkbox" /></td>'+
											'<td class="lastname">'+data.lastname+'</td>'+
											'<td class="name">'+data.name+'</td>'+
											'<td class="phone">'+data.telephone+'</td>'+
											'<td><div class="edit-contact ui-icon-wrench"></div></td>'+
											'<td><div class="delete-contact ui-icon-close"></div></td>'+
											'<td><div class="add-to-phone-list ui-icon-arrowstop-1-e"></div></td>'+
										'</tr>'
							);
		tableSort($("#contact-list #"+data.group+" table tbody"));					
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
		//this.ShowNote(_this.mess['SUCCESS'], _this.mess['NEW_GROUP']);
		this.groupList.append('<div id = "'+data.id+'"> \
									<p class = "group-header ui-widget-header"> \
										<span class = "toggle-group ui-icon-circle-arrow-e"></span><a>'+data.name+'</a> \
										<span class = "edit-group ui-icon-wrench" title="Редактировать название группы"></span> \
										<span class = "add-all-group-numbers ui-icon-arrowstop-1-e" title="Добавить все контакты из группы"></span> \
										<span class = "delete-group ui-icon-close" title="Удалить группу"></span> \
									</p>\
									<div class="group-body"> \
										<table><tbody></tbody></table>\
									</div>\
		                      </div>');
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
		//this.ShowNote(_this.mess['SUCCESS'], _this.mess['GROUP_EDITED']);
		$("#contact-list #"+data.id+" p a").text(data.groupname);
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
	if (data.state == 'good')
	{
		//this.ShowNote(_this.mess['SUCCESS'], _this.mess['CONTACT_EDITED']);
		
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
			objTrContact = $("#"+data.oldGroup+" table tbody").find("tr[id="+data.contactId+"]");
			
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
		//this.ShowNote(_this.mess['SUCCESS'], _this.mess['CONTACT_DELETED']);
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
		this.ShowNote(_this.mess['SUCCESS'], data.groupId==0?_this.mess['DEL_CONTACTS_FROM_GROUP']:_this.mess['GROUP_DELETED']);
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
											'<td><div class="edit-contact ui-icon-wrench"></div></td>'+
											'<td><div class="delete-contact ui-icon-close"></div></td>'+
											'<td><div class="add-to-phone-list ui-icon-arrowstop-1-e"></div></td>'+
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
	
	$.post(url, postData, handler, "json");
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