function clientSide(params)
{
	this.urlForAjaxRequests = params.urlForAjaxRequests;
	this.session = params.session;
	
	//перемещение
	this.movingHeader = $('.moveElements-header');
	this.movingHeaderText = $('.moveElements-header span');
	this.moveElementsBody = $('.moveElements-body');
	this.moveElementsBodyItem = $('.moveElements-body div');
	//добавление в группу массовое
	this.addingHeader = $('.addElements-header');
	this.addingHeaderText = $('.addElements-header span');
	this.addElementsBody = $('.addElements-body');
	this.addElementsBodyItem = $('.addElements-body div');
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
	this.InitCelebrateContact();
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
		
	$("#group-1 .group-body").fadeIn(); 
	
	// назначаем событие по клику открывать нужную группу
	$("#phonebook .grouplist p").live('click', function(event)
	{
		if($(this).children("a:first").hasClass('group-current')==false)
		{
			$(".group-number").hide();
			$(".grouplist a").removeClass('group-current');
			$(this).children("a:first").addClass('group-current');
			$("#phonebook .grouplist p").css("cursor","pointer");
			$(this).css("cursor","default");
			$(this).children("span").css("cursor","pointer");
			$("#group-"+$(this).parent().attr("id")+' .group-body').show();
			$("#group-"+$(this).parent().attr("id")).fadeIn();
		}	
	});
	
	// ссылка "Ещё группы"
	$(".get-more-groups").mouseover(function()
	{
		$(this).next(".more-groups").fadeIn();
		$(this).next(".more-groups").mouseleave(function()
		{
			$(this).fadeOut();
		});
	});
	
	// вешаем события при нажатии на группы
	$(".group-item").live('click', function(event)
	{
		var group = $(this).attr("groupid");
		var groupParagraph = $(".grouplist #" + group + " p");

		if(groupParagraph.children("a").hasClass('group-current')==false)
		{
			$(".more-groups").slideUp('slow');
			$(".group-number").hide();
			$(".grouplist a").removeClass('group-current');
			groupParagraph.children("a:first").addClass('group-current');
			$("#phonebook p").css("cursor","pointer");
			groupParagraph.css("cursor","default");
			groupParagraph.children("span").css("cursor","pointer");
			$("#group-"+groupParagraph.parent().attr("id")+' .group-body').show();
			$("#group-"+groupParagraph.parent().attr("id")).fadeIn();
			
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
	
	_this.contactsRecount(true, undefined); // пересчитываем все шаблоны в группах
	
}

//инициализация самой телефонной книги
clientSide.prototype.InitCelebrateContact = function ()
{
//	_this = this;
//	
//	$(".groupcontent tbody tr").on(
//		"hover",
//		function()
//		{
//		    $(this).find(".congrat-notify").slideToggle('fast');
//		}
//	);
//	
//	$(".celebrate-tabs").tabs({ fx: { opacity: 'toggle' } });
//	
//	$(".birth-date").datetimepicker({minDate: 0/*, maxDate: startLimit*/});
		//$.datepicker.regional[ "ru" ],;
//	
//	_this.InitCelebrateDialog();
//	
//	$(".groupcontent tbody tr .congrat-notify a").on(
//		"click",
//		function()
//		{
//			$('#celebrate-dialog').dialog('open');
//		}
//	);
//	
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
		title: 'Формат файла - xls или csv. На первой странице в 1й колонке - номер, во 2й - фамилия, в 3й - имя, в 4й - группа. Колонки 2, 3 и 4 необязательные. Предполагается, что первая строка является заголовком, поэтому будет проигнорирована.',
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
					_this.ajaxLoading.dialog('close'); 
					_this.Request('AddContactsFromExcel', { 'contacts[]': response}, function(data) { _this.AfterContactAddFromExcel(data); _this.ajaxLoading.dialog('close'); });
				}			
			}
			else
			{
				_this.ShowError(_this.mess['ERROR'], response.text);
			}
			
		}
	 });
	 
	 //мастер импорта gmail
	 this.InitGmailImport();
	 this.InitOutlookImport();
	 this.InitAddressbookImport();
}
//поиск
clientSide.prototype.InitGmailImport = function()
{
	gmailContainer = [];
	$("#gmail-master").dialog({
		autoOpen: false,
		resizable: false,
		modal: false,
		width: 650,
		buttons: {
			'Добавить контакты': function(){	        	
				$(this).dialog('close');
				_this.Request('AddContactsFromExcel', gmailContainer, function(data) { _this.AfterContactAddFromExcel(data); _this.ajaxLoading.dialog('close'); });				
			}
		},
		close: function() {
			$('#gmail-master .in').hide();
			$('#gmail-master .post').hide();
			$('#gmail-master .pre').show();
			$("#gmail-master .example-list tbody tr").remove();
		}
	});	
	$("#fromGmail").click(function(){
		$(".action-menu").hide();
		$("#gmail-master").dialog('open');
	});	
	var dataLoad = new AjaxUpload('gmail_load',
	{
		action: '/bitrix/components/sms4b/phonebook/import.php',
		//file upload name
		name: 'datafile',
		data: {
			from: 'gmail',
		},
		responseType: 'json',
		onSubmit: function(file, ext)
		{
			if (!(ext && /^(csv)$/i.test(ext)))
			{
				alert('Расширение файла должно быть .csv');
				return false;
			}
			this.disable();
			$('#gmail-master .pre').hide();		
			$('#gmail-master .in').show();		
		},
		onComplete: function(file, response)
		{				
			this.enable();		
			if (response.state != 'error')
			{
				gmailContainer = [];
				jQuery.each(response, function(i, val){
					i = i.trim();
					if(i!='')
					{						
						row = '<tr><td>'+val['last']+'</td>'; //фамилия
						row += '<td>'+val['first']+'</td>'; //имя
						row += '<td class="number">'+i+'</td>'; //номер
						row += '<td>'+val['groups']+'</td></tr>'; //группа
						$("#gmail-master .example-list tbody").append(row);
						gmailContainer.push([i, val['last'], val['first'], val['groups']]);
					}
				});
				gmailContainer = { 'contacts[]': gmailContainer};
				$('#gmail-master .in').hide();
				$('#gmail-master .post').show();			
			}
			else
			{
				alert('Ошибка:'+response.text);
				$('#gmail-master .in').hide();
				$('#gmail-master .pre').show();
			}	
		}
	});	
}
clientSide.prototype.InitOutlookImport = function()
{
	outlookContainer = [];
	$("#outlook-master").dialog({
		autoOpen: false,
		resizable: false,
		modal: false,
		width: 650,
		buttons: {
			'Добавить контакты': function(){	        	
				$(this).dialog('close');
				_this.Request('AddContactsFromExcel', outlookContainer, function(data) { _this.AfterContactAddFromExcel(data); _this.ajaxLoading.dialog('close'); });				
			}
		},
		close: function() {
			$('#outlook-master .in').hide();
			$('#outlook-master .post').hide();
			$('#outlook-master .pre').show();
			$("#outlook-master .example-list tbody tr").remove();
		}
	});
	$("#fromOutlook").click(function(){
		$(".action-menu").hide();
		$("#outlook-master").dialog('open');
	});	
	var dataLoad = new AjaxUpload('outlook_load',
	{
		action: '/bitrix/components/sms4b/phonebook/import.php',
		//file upload name
		name: 'datafile',
		data: {
			from: 'outlook',
		},
		responseType: 'json',
		onSubmit: function(file, ext)
		{
			if (!(ext && /^(csv)$/i.test(ext)))
			{
				alert('Расширение файла должно быть .csv');
				return false;
			}
			this.disable();
			$('#outlook-master .pre').hide();		
			$('#outlook-master .in').show();		
		},
		onComplete: function(file, response)
		{				
			this.enable();		
			if (response.state != 'error')
			{
				outlookContainer = [];
				jQuery.each(response, function(i, val){
					i = i.trim();
					if(i!='')
					{						
						row = '<tr><td>'+val['last']+'</td>'; //фамилия
						row += '<td>'+val['first']+'</td>'; //имя
						row += '<td class="number">'+i+'</td>'; //номер
						row += '<td>'+val['groups']+'</td></tr>'; //группа
						$("#outlook-master .example-list tbody").append(row);
						outlookContainer.push([i, val['last'], val['first'], val['groups']]);
					}
				});
				outlookContainer = { 'contacts[]': outlookContainer};
				$('#outlook-master .in').hide();
				$('#outlook-master .post').show();			
			}
			else
			{
				alert('Ошибка:'+response.text);
				$('#outlook-master .in').hide();
				$('#outlook-master .pre').show();
			}	
		}
	});
}
clientSide.prototype.InitAddressbookImport = function()
{
	addressbookContainer = [];
	$("#addressbook-master").dialog({
		autoOpen: false,
		resizable: false,
		modal: false,
		width: 650,
		buttons: {
			'Добавить контакты': function(){	        	
				$(this).dialog('close');
				_this.Request('AddContactsFromExcel', addressbookContainer, function(data) { _this.AfterContactAddFromExcel(data); _this.ajaxLoading.dialog('close'); });				
			}
		},
		close: function() {
			$('#addressbook-master .in').hide();
			$('#addressbook-master .post').hide();
			$('#addressbook-master .pre').show();
			$("#addressbook-master .example-list tbody tr").remove();
		}
	});	
	$("#fromAddressbook").click(function(){
		$(".action-menu").hide();
		$("#addressbook-master").dialog('open');
	});	
	var dataLoad = new AjaxUpload('addressbook_load',
	{
		action: '/bitrix/components/sms4b/phonebook/import.php',
		//file upload name
		name: 'datafile',
		data: {
			from: 'addressbook',
		},
		responseType: 'json',
		onSubmit: function(file, ext)
		{
			if (!(ext && /^(vcf)$/i.test(ext)))
			{
				alert('Расширение файла должно быть .vcf');
				return false;
			}
			this.disable();
			$('#addressbook-master .pre').hide();		
			$('#addressbook-master .in').show();		
		},
		onComplete: function(file, response)
		{				
			this.enable();		
			if (response.state != 'error')
			{
				addressbookContainer = [];
				jQuery.each(response, function(i, val){
					i = i.trim();
					if(i!='')
					{						
						row = '<tr><td>'+val['last']+'</td>'; //фамилия
						row += '<td>'+val['first']+'</td>'; //имя
						row += '<td class="number">'+i+'</td>'; //номер
						row += '<td>'+val['groups']+'</td></tr>'; //группа
						$("#addressbook-master .example-list tbody").append(row);
						addressbookContainer.push([i, val['last'], val['first'], val['groups']]);
					}
				});
				addressbookContainer = { 'contacts[]': addressbookContainer};
				$('#addressbook-master .in').hide();
				$('#addressbook-master .post').show();			
			}
			else
			{
				alert('Ошибка:'+response.text);
				$('#addressbook-master .in').hide();
				$('#addressbook-master .pre').show();
			}	
		}
	});
}

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
	$('.actionElements-body [action=del]').hide(); // удаление записей
	//нажатие на перемещение
	_this.movingHeader.click(function(event){
		$(".action-menu").hide();
		event.stopImmediatePropagation();
		if (_this.movingHeaderText.hasClass('moveElements-header-text-enabled'))
		{
			_this.moveElementsBody.fadeIn();
		} 
	});
	_this.addingHeader.click(function(event){
		$(".action-menu").hide();
		event.stopImmediatePropagation();
		if (_this.addingHeaderText.hasClass('addElements-header-text-enabled'))
		{
			_this.addElementsBody.fadeIn();
		} 
	});
	_this.actionHeader.click(function(event){
		$(".action-menu").hide();
		event.stopImmediatePropagation();
		_this.actionElementsBody.fadeIn(); 
	});
	$("body").click(function(){
		$(".action-menu").hide();
	});
	_this.moveElementsBody.click(function(event) {
		event.stopImmediatePropagation();
		target = $(event.target);
		toGroup = target.attr('groupid');
		if (toGroup != 'undefined')
		{
			_this.OpenMoveConfirmDialog("Внимание!", _this.mess['GROUP']+ ' «' + target.text() + '»' + "?");
		}
	});	
	
	this.addElementsBody.click(function(event) {
		event.stopImmediatePropagation();
		target = $(event.target);
		toGroup = target.attr('groupid');
		if (toGroup != 'undefined')
		{
			_this.OpenAddConfirmDialog("Внимание!", _this.mess['ADD_GROUP']+ ' «' + target.text() + '»' + "?");
		}
	});
	
	$("#delSelected").click(function(){
		_this.OpenDelConfirmDialog("Внимание!", _this.mess['CONTACTS_DELETE_MULTY']);
	});
	$("#sendto").click(function(){
		var telephones = '';
		_this.contactList.find('tr:has(input:checked)').each(function() {
			telephones += $(this).attr('contactPhone')+'<'+$(this).attr('contactLastName')+' '+$(this).attr('contactName')+'>'+'---';
		});			
		document.location.href="index.php?numberlist="+telephones;
	});
	
	_this.excelHeader.add(this.excelHeaderText).click(function(event) {
			event.stopImmediatePropagation();
			var target = $(event.target);
			_this.excelElementsBody.css('display', _this.excelElementsBody.css('display') == 'block' ? 'none' : 'block');
			_this.actionElementsBody.css('display', 'none');
			_this.moveElementsBody.css('display', 'none');
			_this.addElementsBody.css('display', 'none');
	});
	//выгрузка в excel
	$('#toExcel').click(function(event){
		//alert(_this.urlForAjaxRequests+'/loadToExcel.php');
		event.stopImmediatePropagation();	
		$('<iframe class="loadExcel" name="excel" src="'+_this.urlForAjaxRequests+'?ToExcel=1"></iframe>').appendTo('body'); 
	});
	
	_this.hoverForControls();
}

//функция диалога подтверждения перемещения элементов
clientSide.prototype.OpenMoveConfirmDialog = function (title, text)
{
	_this = this; 
	if (_this.lang == 'ru')
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				'Да': function() {
					_this.moveElementsBody.css('display', 'none');
					var contactsArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.contactList.find('tr:has(input:checked)').each(
						function() {
							contactsArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.phone").attr("title").split(" ")[0]);
						}
					);
					
					_this.Request('ChangeGroupForSelectedContacts', {'toGroup': toGroup, 'contactsId[]': contactsArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.contactsId = contactsArray, data.groupsId = groupsArray, _this.AfterGroupChangeSelectedContacts(data);});
							
					$( this ).dialog( "close" );
				},
				'Нет': function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	else
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				Yes: function() {
					_this.moveElementsBody.css('display', 'none');
					var contactsArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.contactList.find('tr:has(input:checked)').each(
						function() {
							contactsArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.phone").attr("title").split(" ")[0]);
						}
					);
					
					_this.Request('ChangeGroupForSelectedContacts', {'toGroup': toGroup, 'contactsId[]': contactsArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.contactsId = contactsArray, data.groupsId = groupsArray, _this.AfterGroupChangeSelectedContacts(data);});
					
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	
	$("#dialog-confirm").dialog('option', 'title', title);
	$("#dialog-confirm p").html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + text);
	$("#dialog-confirm").dialog('open');
}

//функция диалога подтверждения добавления элементов
clientSide.prototype.OpenAddConfirmDialog = function (title, text)
{
	_this = this; 
	if (_this.lang == 'ru')
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				'Да': function() {
					
                    _this.addElementsBody.css('display', 'none');
					var contactsArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.contactList.find('tr:has(input:checked)').each(
						function() {
							contactsArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.phone").attr("title").split(" ")[0]);
						}
					);
					
					_this.Request('AddGroupForSelectedContacts', {'toGroup': toGroup, 'contactsId[]': contactsArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.contactsId = contactsArray, data.groupsId = groupsArray, _this.AfterAddGroupForSelectedContacts(data);});
						
					$( this ).dialog( "close" );
				},
				'Нет': function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	else
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				Yes: function() {
					
					_this.addElementsBody.css('display', 'none');
					var contactsArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.contactList.find('tr:has(input:checked)').each(
						function() {
							contactsArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.phone").attr("title").split(" ")[0]);
						}
					);
					
					_this.Request('AddGroupForSelectedContacts', {'toGroup': toGroup, 'contactsId[]': contactsArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.contactsId = contactsArray, data.groupsId = groupsArray, _this.AfterAddGroupForSelectedContacts(data);});
					
										
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	
	$("#dialog-confirm").dialog('option', 'title', title);
	$("#dialog-confirm p").html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + text);
	$("#dialog-confirm").dialog('open');
}


//функция диалога подтверждения удаления элементов
clientSide.prototype.OpenDelConfirmDialog = function (title, text)
{
	_this = this; 
	if (_this.lang == 'ru')
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				'Да': function() {
					
                    _this.actionElementsBody.hide();
					var contactsForDeleteArray = new Array();
					var groupsForDeleteArray = new Array();
					_this.contactList.find('tr:has(input:checked)').each(
						function() {
							contactsForDeleteArray.push($(this).attr('id'));
							groupsForDeleteArray.push($(this).attr('groupid'));
						});
					
					_this.Request('DeleteSelectedContacts', {'contactsId[]': contactsForDeleteArray, 'groupsId[]': groupsForDeleteArray},function(data) {data.contactsId = contactsForDeleteArray, data.groupsId = groupsForDeleteArray, _this.AfterDeleteSelectedContacts(data); });
			
					$( this ).dialog( "close" );
				},
				'Нет': function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	else
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				Yes: function() {
					
					_this.actionElementsBody.hide();
					var contactsForDeleteArray = new Array();
					var groupsForDeleteArray = new Array();
					_this.contactList.find('tr:has(input:checked)').each(
						function() {
							contactsForDeleteArray.push($(this).attr('id'));
							groupsForDeleteArray.push($(this).attr('groupid'));
						});
					
					_this.Request('DeleteSelectedContacts', {'contactsId[]': contactsForDeleteArray, 'groupsId[]': groupsForDeleteArray},function(data) {data.contactsId = contactsForDeleteArray, data.groupsId = groupsForDeleteArray, _this.AfterDeleteSelectedContacts(data); });
			
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	
	$("#dialog-confirm").dialog('option', 'title', title);
	$("#dialog-confirm p").html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + text);
	$("#dialog-confirm").dialog('open');
}

//функция диалога подтверждения удаления группы
clientSide.prototype.OpenDelGroupConfirmDialog = function (title, text, groupToDeleteId)
{
	_this = this; 
	if (_this.lang == 'ru')
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				'Да': function() {
					
					// если очищаем группу "Не в группе", а там уже ничего нет
					if(groupToDeleteId == 0)
					{             
						if($("#contact-list #group-0 table tr td").hasClass("dataTables_empty"))
						{
							$( this ).dialog( "close" );
							_this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_NO_GROUP_EMPTY']);
							return false;
						}
					}
					
					_this.Request("DeleteGroup", 
							{id: groupToDeleteId},
								function(data) 
								{
									data.groupId = groupToDeleteId; 
									_this.AfterGroupDelete(data);
								}										
							);
					
					$( this ).dialog( "close" );
				},
				'Нет': function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	else
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				Yes: function() {

					// если очищаем группу "Не в группе", а там уже ничего нет
					if(groupToDeleteId == 0)
					{
						if($("#contact-list #group-0 table tr td").hasClass("dataTables_empty"))
						{
							$( this ).dialog( "close" );
							_this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_NO_GROUP_EMPTY']);
							return false;
						}
					}
					
					_this.Request("DeleteGroup", 
							{id: groupToDeleteId},
								function(data) 
								{
									data.groupId = groupToDeleteId; 
									_this.AfterGroupDelete(data);
								}										
							);
					
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	
	$("#dialog-confirm").dialog('option', 'title', title);
	$("#dialog-confirm p").html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + text);
	$("#dialog-confirm").dialog('open');
}

//функция диалога подтверждения удаления группы
clientSide.prototype.OpenDelContConfirmDialog = function (title, text, target)
{
	_this = this; 
	if (_this.lang == 'ru')
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				'Да': function() {
					
					_this.Request("ContactDelete", {contactId: target.closest('tr').attr('id'), groupId: target.closest('tr').attr('groupid')}, function(data) { _this.AfterContactDelete(data)});
					
					$( this ).dialog( "close" );
				},
				'Нет': function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	else
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				Yes: function() {
					
					_this.Request("ContactDelete", {contactId: target.closest('tr').attr('id'), groupId: target.closest('tr').attr('groupid')}, function(data) { _this.AfterContactDelete(data)});
					
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	}
	
	$("#dialog-confirm").dialog('option', 'title', title);
	$("#dialog-confirm p").html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + text);
	$("#dialog-confirm").dialog('open');
}

//после изменения группы у выбранных контактов
clientSide.prototype.AfterGroupChangeSelectedContacts = function(data)
{
	_this = this;
	if (data.state == 'good')
	{
		// ищем отмеченные записи. Для каждой записи в цикле выполняем:
		// смотрим есть ли в группе, куда добавляем такой же айдишник. Если есть, то просто убиваем запись.
		// Иначе запоминаем контакт, удаляем контакт и вставляем в новую группу.
		
		var contactGroupid = data.newGroup; // новая группа для всех контактов
		
		var newGroupName = $(".grouplist #"+contactGroupid).children().children("a:first").text();
	    var len = $("#contact-list #group-"+contactGroupid+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
		lenlen = lenlen.length;
		newGroupName = newGroupName.substr(0,newGroupName.length-lenlen-3);
		
		var contactsSelected = $("#contact-list tr.ui-selecting");
		
		var newGroupIds = new Array();
		$("#contact-list #group-"+data.newGroup+" table tr").each(function()
		{
			newGroupIds.push($(this).attr("id"));	
		});
		
		
		// если перемещаем в "Не в группе", то нужно избавиться от старых групп
		if(contactGroupid == 0)
		{
			contactsSelected.each(function(id)
			{
	            // если контакт уже в "Не в группе", то переходим к следующему 
	            if($(this).attr("groupid") == contactGroupid)
	                return true;
	            
				var contactId = $(this).attr("id"); // айдишник контакта 
				var contactName = $(this).attr("contactname");
				var contactLastName = $(this).attr("contactlastname");
				var contactPhone = $(this).attr("contactphone");
				var contactRecently = $(this).children("td.phone").attr("title").split(" ")[0]; // часто используемыми
				
				// удаляем...
				$("#contact-list tr[id="+contactId+"]").not($("#contact-list #group-1 tr[id="+contactId+"]")).each(function()
				{
					var cont = $(this);

					var row = cont.get(0); // получаем объект элемента из ДОМа

					var oTable = cont.closest("table").dataTable();

					var index = oTable.fnGetPosition(row); 	// получаем позицию строки
					oTable.fnDeleteRow(index);	// удаляем
				});
				
				if(in_array(contactId,newGroupIds))
					return true;
				else
					newGroupIds.push(contactId); // помещаем контакт в массив уникальных контактов
				
				_this.turnOnTables(0); 
				
				$("#contact-list #group-"+contactGroupid+" table").dataTable().fnAddData( [
	      						"<input type='checkbox' />",
	      						contactLastName,
	      						contactName,
	      						contactPhone,
	      						"",
	      						"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
	      						"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
	      						"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
	      		);
	      		var added = $("#contact-list #group-"+contactGroupid+" table tbody").find("td:contains('" + contactPhone + "')").parent().attr("id",contactId).attr("groupId",contactGroupid).
	      					attr("contactLastName",contactLastName).attr("contactName",contactName).attr("contactPhone",contactPhone).addClass("searchable");
	      		added.find("td:eq(0)").addClass("chkbox");
	      		added.find("td:eq(1)").addClass("lastname");
	      		added.find("td:eq(2)").addClass("name");
	      		added.find("td:eq(3)").addClass("phone").attr("title",contactRecently + " смс");
	      		added.find("td:eq(4)").addClass("contact-groups");

	      		_this.giveTableCorrectWidth(0);
			});
		}
		else
		{			
			contactsSelected.each(function(id)
			{
	            // если контакт уже в новой группе, то переходим к следующему 
	            if($(this).attr("groupid") == data.newGroup)
	                return true;
	            
				var contactId = $(this).attr("id"); // айдишник контакта
	            // если дополнительная группа контакта содержала новую группу, то просто удаляем его из старой
				if(in_array(contactId,newGroupIds))
				{
					var cont = $("#contact-list tr[id="+contactId+"][groupid="+$(this).attr("groupid")+"]").not($("#contact-list #group-1 tr[id="+contactId+"]"));

					var row = cont.get(0); // получаем объект элемента из ДОМа

					var oTable = cont.closest("table").dataTable();

					var index = oTable.fnGetPosition(row); 	// получаем позицию строки
					oTable.fnDeleteRow(index);	// удаляем
				} // иначе запоминаем данные контакта, удаляем его из старой группы и добавляем в новую
				else
				{
					newGroupIds.push(contactId); // помещаем контакт в массив уникальных контактов
					
					var contactName = $(this).attr("contactname");
					var contactLastName = $(this).attr("contactlastname");
					var contactPhone = $(this).attr("contactphone");
					var contactRecently = $(this).children("td.phone").attr("title").split(" ")[0]; // часто используемыми
					
					var cont = $("#contact-list tr[id="+contactId+"][groupid="+$(this).attr("groupid")+"]").not($("#contact-list #group-1 tr[id="+contactId+"]"));

					var row = cont.get(0); // получаем объект элемента из ДОМа

					var oTable = cont.closest("table").dataTable();

					var index = oTable.fnGetPosition(row); 	// получаем позицию строки
					oTable.fnDeleteRow(index);	// удаляем
					
					_this.turnOnTables(contactGroupid);
					
					// берем только три группы для помещения в колонку с группами
					var groupsColumnBody = "";
					var i = 0;
					$(".groupcontent table tbody tr[id=" + contactId + "]").not($("#contact-list #group-1 tr[id="+contactId+"]")).each(function(index)
					{
						if(i == 3)
							return false;

					    var groupId = $(this).attr("groupid");
					    var groupName = $(".grouplist #"+groupId).children().children("a:first").text();
					    var len = $("#contact-list #group-"+groupId+" table tbody tr.searchable").length;
					    var lenlen = "" + len;
						lenlen = lenlen.length;
						groupName = groupName.substr(0,groupName.length-lenlen-3);
						groupsColumnBody += "<div title=\"Перейти в группу '" + groupName + "'\" groupId='" + groupId + "' class='group-item'><a>" + groupName + "</a></div>";
						i++;
					}
					);
					
					if(i < 3)
						groupsColumnBody += "<div title=\"Перейти в группу '" + newGroupName + "'\" groupId='" + contactGroupid + "' class='group-item'><a>" + newGroupName + "</a></div>";
				    
					
					$("#contact-list #group-"+contactGroupid+" table").dataTable().fnAddData( [
	      							"<input type='checkbox' />",
	      							contactLastName,
	      							contactName,
	      							contactPhone,
	      							"<div class='group-list'>" + groupsColumnBody + "</div>",
	      							"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
	      							"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
	      							"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
	      			);
	      			var added = $("#contact-list #group-"+contactGroupid+" table tbody").find("td:contains('" + contactPhone + "')").parent().attr("id",contactId).attr("groupId",contactGroupid).
	      						attr("contactLastName",contactLastName).attr("contactName",contactName).attr("contactPhone",contactPhone).addClass("searchable");
	      			added.find("td:eq(0)").addClass("chkbox");
	      			added.find("td:eq(1)").addClass("lastname");
	      			added.find("td:eq(2)").addClass("name");
	      			added.find("td:eq(3)").addClass("phone").attr("title",contactRecently + " смс");
	      			added.find("td:eq(4)").addClass("contact-groups");
	      			
	      			_this.giveTableCorrectWidth(contactGroupid);
				}
			});
		}
		
		// убираем контролы, если ничего не выделено
		if(_this.contactList.find('tr:has(input:checked)').length < 1)
		{
			$("#sendto").button( "option", "disabled", true );
			//перемещения
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			// добавления
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');	
			
			// удаления
			$('.actionElements-body [action=del]').hide();
		}
		
		$("#"+contactGroupid+" p a").first().click();
		
		_this.checkTableEmptiness();
		_this.contactsRecount(false, undefined);
		_this.ClearBoxesAfterAction();
		_this.CheckIfCanAddMoveRemove();
		
		_this.ShowNote(_this.mess['SUCCESS'],  _this.mess['CONTACTS_MOVED']);
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['CONTACT_ADD_ERR']);
	}
}
//после добавления группы у выбранных контактов
clientSide.prototype.AfterAddGroupForSelectedContacts = function(data)
{
	_this = this;
	if (data.state == 'good')
	{
		// ищем отмеченные записи. Для каждой записи в цикле выполняем:
		// смотрим есть ли в группе, куда добавляем такой же айдишник. Если есть, то просто пропускаем запись.
		// Иначе запоминаем контакт, удаляем контакт и вставляем в новую группу.
		
		var contactGroupid = data.newGroup; // новая группа для всех контактов
		
		var newGroupName = $(".grouplist #"+contactGroupid).children().children("a:first").text();
	    var len = $("#contact-list #group-"+contactGroupid+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
		lenlen = lenlen.length;
		newGroupName = newGroupName.substr(0,newGroupName.length-lenlen-3);
		
		var contactsSelected = $("#contact-list tr.ui-selecting");
		
		var newGroupIds = new Array();
		$("#contact-list #group-"+data.newGroup+" table tr").each(function()
		{
			newGroupIds.push($(this).attr("id"));	
		});
					
		contactsSelected.each(function(id)
		{
            // если контакт уже в новой группе, то переходим к следующему 
            if($(this).attr("groupid") == data.newGroup)
                return true;
            
			var contactId = $(this).attr("id"); // айдишник контакта
            // если дополнительная группа контакта содержала новую группу, то просто пропускаем
			if(in_array(contactId,newGroupIds))
				return true;
			else// иначе запоминаем данные контакта, удаляем его из старой группы и добавляем в новую
			{
				newGroupIds.push(contactId); // помещаем контакт в массив уникальных контактов
				
				var contactName = $(this).attr("contactname");
				var contactLastName = $(this).attr("contactlastname");
				var contactPhone = $(this).attr("contactphone");
				var contactRecently = $(this).children("td.phone").attr("title").split(" ")[0]; // часто используемыми
				
				_this.turnOnTables(contactGroupid);
				
				// берем только три группы для помещения в колонку с группами
				var groupsColumnBody = "";
				var i = 0;
				$(".groupcontent table tbody tr[id=" + contactId + "]").not($("#contact-list #group-1 tr[id="+contactId+"]")).each(function(index)
				{
					if(i == 3)
						return false;

				    var groupId = $(this).attr("groupid");
				    var groupName = $(".grouplist #"+groupId).children().children("a:first").text();
				    var len = $("#contact-list #group-"+groupId+" table tbody tr.searchable").length;
				    var lenlen = "" + len;
					lenlen = lenlen.length;
					groupName = groupName.substr(0,groupName.length-lenlen-3);
					groupsColumnBody += "<div title=\"Перейти в группу '" + groupName + "'\" groupId='" + groupId + "' class='group-item'><a>" + groupName + "</a></div>";
					i++;
				}
				);
				
				if(i < 3)
					groupsColumnBody += "<div title=\"Перейти в группу '" + newGroupName + "'\" groupId='" + contactGroupid + "' class='group-item'><a>" + newGroupName + "</a></div>";
			    
				$("#contact-list #group-"+contactGroupid+" table").dataTable().fnAddData( [
      							"<input type='checkbox' />",
      							contactLastName,
      							contactName,
      							contactPhone,
      							"<div class='group-list'>" + groupsColumnBody + "</div>",
      							"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
      							"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
      							"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
      			);
      			var added = $("#contact-list #group-"+contactGroupid+" table tbody").find("td:contains('" + contactPhone + "')").parent().attr("id",contactId).attr("groupId",contactGroupid).
      						attr("contactLastName",contactLastName).attr("contactName",contactName).attr("contactPhone",contactPhone).addClass("searchable");
      			added.find("td:eq(0)").addClass("chkbox");
      			added.find("td:eq(1)").addClass("lastname");
      			added.find("td:eq(2)").addClass("name");
      			added.find("td:eq(3)").addClass("phone").attr("title",contactRecently + " смс");
      			added.find("td:eq(4)").addClass("contact-groups");
      			
      			_this.giveTableCorrectWidth(contactGroupid);
			}
		});
		
		// убираем контролы, если ничего не выделено
		if(_this.contactList.find('tr:has(input:checked)').length < 1)
		{
			$("#sendto").button( "option", "disabled", true );
			//перемещения
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			// добавления
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');	
			
			// удаления
			$('.actionElements-body [action=del]').hide();
		}
		
		$("#"+contactGroupid+" p a").first().click();
		
		_this.checkTableEmptiness();
		_this.contactsRecount(false, undefined);
		_this.ClearBoxesAfterAction();
		_this.CheckIfCanAddMoveRemove();
		                                                                      
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['CONTACTS_GROUP_ADDED'] + " «" + newGroupName + "»");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['CONTACT_ADD_ERR']);
	}
}
//после удаления элементов
clientSide.prototype.AfterDeleteSelectedContacts = function(data)
{
	_this = this;
	if (data.state == 'good')
	{
		var counter = 0;
		data.contactsId.forEach(function(id)
		{
			var cont = $("#contact-list tr[id="+id+"][groupid="+data.groupsId[counter]+"]");

			var row = cont.get(0); // получаем объект элемента из ДОМа

			var oTable = cont.closest("table").dataTable();

			var index = oTable.fnGetPosition(row); 	// получаем позицию строки
			oTable.fnDeleteRow(index);	// удаляем
			
			// если имеется в часто используемых - тоже удаляем
			if($("#contact-list #group-1 tr[id="+id+"]").length > 0 && $("#contact-list tr[id="+id+"]").not($("#contact-list #group-1 tr[id="+id+"]")).length < 1)
			{
				var cont = $("#contact-list #group-1 tr[id="+id+"]");

				var row = cont.get(0); // получаем объект элемента из ДОМа

				var oTable = cont.closest("table").dataTable();

				var index = oTable.fnGetPosition(row); 	// получаем позицию строки
				oTable.fnDeleteRow(index);	// удаляем
			}
			
			// удаляем группу в блочках у колонки с группами
			$(".group-item[groupid="+data.groupsId[counter]+"]").remove();
			
			counter++;
		});
		
		// убираем контролы, если ничего не выделено
		if(_this.contactList.find('tr:has(input:checked)').length < 1)
		{
			$("#sendto").button( "option", "disabled", true );
			//перемещения
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			// добавления
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');
			
			// удаления
			$('.actionElements-body [action=del]').hide();
		}
		
		_this.checkTableEmptiness();
		_this.contactsRecount(false, undefined);
		_this.ClearBoxesAfterAction();
		_this.CheckIfCanAddMoveRemove();
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['CONTACTS_DELETED']);
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['DELETE_ERR']);
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
				box.parent().parent().addClass('ui-selecting');
			}
			else
			{
				box.attr("checked",false);
				box.parent().parent().removeClass('ui-selecting');
			}
		});
		
		_this.CheckIfCanAddMoveRemove();
	});
	$("#contact-list").click(function(event) {
		
//		event.stopImmediatePropagation();
		
		var target = $(event.target);


		//редактирование группы
		if (target.hasClass("edit-group"))
		{
			event.stopImmediatePropagation();	
			groupEdit = $("#group-edit");
			//groupName = target.parent().find('a:eq(0)').text(); // берем только из первой ссылки
			
			groupId = target.parent().parent().attr('id');
			var len = $("#contact-list #group-"+groupId+" table tbody tr.searchable").length;
		    var lenlen = "" + len;
		    lenlen = lenlen.length;
		    var groupName = target.parent().find('a:eq(0)').text();
		    groupName = groupName.substr(0,groupName.length-lenlen-3);
		    
			_this.editGroupId.val(groupId);
			_this.editGroupName.val(groupName);
			groupEdit.dialog('option', 'title', _this.mess['GROUP_EDIT']+groupName);
			groupEdit.dialog('open');
			
			// фокус в конец инпута
			var phone = document.getElementById('edit-group-name');
			$(phone).focus();
			phone.setSelectionRange(phone.value.length,phone.value.length);
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
			
			_this.OpenDelGroupConfirmDialog("Внимание!", question, groupToDeleteId); // интересуемся - нужно ли удалять
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
			
			

			
			// ищем дополнительные группы
			additionalGroups = new Array();
			$(".groupcontent tr[id="+tr.attr('id')+"]").not($("#contact-list #group-1 tr[id="+tr.attr('id')+"]")).each(function()
			{
				if($(this).attr("groupid") != tr.attr('groupid'))
					additionalGroups.push($(this).attr("groupid"));
			});
			
			var i;
			for( i = 0; i<additionalGroups.length; i++)
			{
				var currAddGroupId = additionalGroups[i];
				$("table#edit-groups-table td.groupsSelectEdit").append($("#contact-edit select:first").clone());
				var currSelect = $("table#edit-groups-table td.groupsSelectEdit select:last"); // ищем текущий селект
				currSelect.children("option[value=0]").remove(); // если есть дополнительные группы, то контакт уже не может быть не в группе
				currSelect.attr("name","groupAddEdit"+i); // для удобства удаления, изменяем имя селекта
				currSelect.addClass("additionalGroupEdit");
				
				$("table#edit-groups-table td.groupsSelectEdit select:last").val(currAddGroupId);
				
				$("table#edit-groups-table td.groupsButtonEdit:last").append("<input type='button' name='groupAddEdit" + i + "' id='removeGroup' value='Убрать привязку'>"); // кнопка для удаления
				$("table#edit-groups-table td.groupsButtonEdit input:last").button().click(function() // по клику будем удалять доп группу
				{
					// удаляем как саму кнопку, так и выбор группы
					$("table#edit-groups-table td.groupsSelectEdit select[name=" + $(this).attr("name") + "]").remove(); 
					$(this).remove();
					
					$("#contact-edit select:first").change(); // а вдруг был выбран пункт "Не в группе"

				});
			} 
			
			// кнопка добавления дополнительных групп
			$("#contact-edit #moreGroup").button().click(function()
			{
				$("table#edit-groups-table td.groupsSelectEdit").append($("#contact-edit select:first").clone());
				var currSelect = $("table#edit-groups-table td.groupsSelectEdit select:last"); // ищем текущий селект
				currSelect.children("option[value=0]").remove(); // если есть дополнительные группы, то контакт уже не может быть не в группе
				currSelect.attr("name","groupAddEdit"+i); // для удобства удаления, изменяем имя селекта
				currSelect.addClass("additionalGroupEdit");
				
				//$("table#edit-groups-table td.groupsSelectEdit select:last").val(currAddGroupId);
				
				$("table#edit-groups-table td.groupsButtonEdit:last").append("<input type='button' name='groupAddEdit" + i++ + "' id='removeGroup' value='Убрать привязку'>"); // кнопка для удаления
				$("table#edit-groups-table td.groupsButtonEdit input:last").button().click(function() // по клику будем удалять доп группу
				{
					// удаляем как саму кнопку, так и выбор группы
					$("table#edit-groups-table td.groupsSelectEdit select[name=" + $(this).attr("name") + "]").remove(); 
					$(this).remove();
					
					$("#contact-edit select:first").change(); // а вдруг был выбран пункт "Не в группе"

				});
				
			});
			
			$("#contact-edit select:first").change(function()
			{
				if($(this).attr("value") == 0)
				{
					$("table#edit-groups-table td.groupsSelectEdit select").each(function()
					{
						$(this).attr("disabled","disabled");
		                $(this).css("opacity","0.5");
					});
					$("table#edit-groups-table td.groupsButtonEdit input").each(function()
					{
						$(this).attr("disabled","disabled").css("cursor","default");
		                $(this).css("opacity","0.5");
					});
					$("#contact-edit #moreGroup").attr("disabled","disabled").css("cursor","default").css("opacity","0.5");
					
				} else
				{
					$("table#edit-groups-table td.groupsSelectEdit select").each(function()
					{
						$(this).removeAttr("disabled");
		                $(this).css("opacity","1.0");
					});
					$("table#edit-groups-table td.groupsButtonEdit input").each(function()
					{
						$(this).removeAttr("disabled").css("cursor","pointer");
		                $(this).css("opacity","1.0");
					});
					$("#contact-edit #moreGroup").removeAttr("disabled").css("cursor","pointer").css("opacity","1.0");;
				}
			});
			$("#contact-edit select:first").change();
			
			_this.contactId.val(tr.attr('id'));
			contactEdit.dialog('open');
			
			// фокус в конец инпута
			var phone = document.getElementById('edit-phone');
			$(phone).focus();
			phone.setSelectionRange(phone.value.length,phone.value.length);		
		}
		else if (target.is("div.delete-contact"))
		{
			// если контакт состоит в нескольких группах, то выдаем соовтетствующее сообщение
			if($(".groupcontent tr[id="+target.closest('tr').attr('id')+"]").length > 1)
				_this.mess['ARE_YOU_SURE'] = _this.mess['ARE_YOU_SURE_MULTIPLE'];
			
			 _this.OpenDelContConfirmDialog("Внимание!", _this.mess['ARE_YOU_SURE'], target);
		}
		else if (target.is("input[type=checkbox][class!=selectall]"))
		{
			event.stopImmediatePropagation();
			var clickedTr = $(target.parent().parent());
			
			var checkbox = target;
			
			if(checkbox.attr("checked")==undefined || checkbox.attr("checked")==false)
			{
				clickedTr.removeClass('ui-selecting');
				checkbox.attr("checked",false);
			}
			else
			{
				clickedTr.addClass('ui-selecting');
				checkbox.attr("checked","checked");
			}
			
			_this.CheckFullCheckedBoxes(target);
			_this.CheckIfCanAddMoveRemove();
		}
		else if (target.is("td"))
		{
			event.stopImmediatePropagation();
			var clickedTr = $(target.parent());			
			var checkbox = clickedTr.find("input[type=checkbox]");
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
			
			_this.CheckFullCheckedBoxes(checkbox);
			_this.CheckIfCanAddMoveRemove();
		}
	});
	
	_this.AddHoverEffectForContactList();
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
	$(".grouplist .group-header > span, .grouplist .group-header > .add-all-group-numbers").hover(
		function () { $(this).addClass('small-buttons-hover')},       
		function () { $(this).removeClass('small-buttons-hover')}	
	);
	$(".groupcontent td > .edit-contact, .groupcontent td > .delete-contact, .groupcontent td > .send-contact").hover(
			function () { $(this).addClass('small-buttons-hover')},       
			function () { $(this).removeClass('small-buttons-hover')}	
		);
	
	var groupsHeaders = $(".grouplist div").not($(".grouplist div#newgroup"));
	groupsHeaders.each(function()
	{
		_this = $(this).find("p:first");
		_this.mouseenter(function()
	{
		$(this).css("background-color","#F5F5F5");  
	}).mouseleave(function()
	{
		$(this).css("background-color","#EFEFEF"); 
	});  
	});
}
//добавляем hover effect для кнопочег контакта
clientSide.prototype.AddHoverEffectForContactIcons = function() 
{
	var _this = this;
	$("#contact-list div.group-body td.edit-template, td.delete-template, td.add-to-phone-list").hover(
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
		//o.addClass('ui-state-error');
		updateTips(container, _this.mess['FIELD_LENGTH'] + "«" + n + "»" + _this.mess['MUST_BE']+min+_this.mess['AND']+max);
		return false;
	} 
	else 
	{
		return true;
	}
}
//функция проверки длины поля
function checkPhone(o, n, container) 
{
	var pattern = /^(8|7|\+7)9\d{9}$/m;
	var phone = o.val();
	phone = phone.replace(/\D+/ig, '');
	if(!pattern.test(phone))
	{
		updateTips(container, _this.mess['FIELD_WORD'] + "«" + n + "»" + _this.mess['FIELD_NUMBER']);
		return false;
	}
	else
		return true;
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
//возвращает уникальные ключи массива просто массива
function array_normal_unique(arr) 
{
	var tmp_arr = new Array();
	
	for (i = 0; i < arr.length; i++) 
	{		
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
					modal: false,
					buttons: {
						'Сохранить контакт': function() {
							var bValid = true;
							allFields.removeClass('ui-state-error');
							
							bValid = bValid && checkLength(lastname, _this.mess['SECOND_NAME'], 0, 30, tips);
							bValid = bValid && checkLength(name, _this.mess['NAME'], 0, 30, tips);
							bValid = bValid && checkLength(telephone, _this.mess['TELEPHONE'], 4, 30, tips);
							bValid = bValid && checkPhone(telephone, _this.mess['TELEPHONE'], tips);
							
							var additionalGroups = new Array();
							if(group.val() != 0)
							{
								var addGrArr = $(".additionalGroup");
								addGrArr.each(function()
								{
									if($(this).val() == group.val())
										return true;
									additionalGroups.push($(this).val());
								});
							}
							additionalGroups = array_normal_unique(additionalGroups); 
							var stringAddGroups = additionalGroups.join(',');
							
							if (bValid) 
							{
								_this.Request("AddNewContact", 
												{'lastname': lastname.val(), 'name': name.val(), 'phone': telephone.val(), 'group': group.val(), 'addGroups': stringAddGroups},
												function(data) 
												{ 
													data.lastname = lastname.val();
													data.name = name.val();
													data.telephone = telephone.val();
													data.group = group.val();
													data.addGroups = stringAddGroups;
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
					modal: false,
					buttons: {
						'Save contact': function() {
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(lastname, _this.mess['SECOND_NAME'], 0, 30, tips);
							bValid = bValid && checkLength(name, _this.mess['NAME'], 0, 30, tips);
							bValid = bValid && checkLength(telephone, _this.mess['TELEPHONE'], 4, 30, tips);
							bValid = bValid && checkPhone(telephone, _this.mess['TELEPHONE'], tips);
							
							var additionalGroups = new Array();
							if(group.val() != 0)
							{
								var addGrArr = $(".additionalGroup");
								addGrArr.each(function()
								{
									if($(this).val() == group.val())
										return true;
									additionalGroups.push($(this).val());
								});
							}
							additionalGroups = array_normal_unique(additionalGroups); 
							var stringAddGroups = additionalGroups.join(',');
							
							if (bValid) 
							{
								_this.Request("AddNewContact", 
												{'lastname': lastname.val(), 'name': name.val(), 'phone': telephone.val(), 'group': group.val(), 'addGroups': stringAddGroups},
												function(data) 
												{ 
													data.lastname = lastname.val();
													data.name = name.val();
													data.telephone = telephone.val();
													data.group = group.val();
													data.addGroups = stringAddGroups;
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
				var currId = $('.grouplist').find("a.group-current:first").parent().parent("div").attr("id");
				$("#dialog select:first").val(currId);
				$("#dialog select:first").change();
				$('#dialog').dialog('open');
				$("input[id=telephone]").focus();
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
		
		// работа с несколькими группами
		var i = 1;
		$("#dialog select:first").change(function()
		{
			if($(this).attr("value") == 0)
			{
				$("table#add-groups-table td.groupsSelect select").not($("#dialog select:first")).each(function()
				{
					$(this).attr("disabled","disabled");
                    $(this).css("opacity","0.5");
				});
				$("table#add-groups-table td.groupsButton input").each(function()
				{
					$(this).attr("disabled","disabled").css("cursor","default");
                    $(this).css("opacity","0.5");
				});
				$("#dialog #moreGroup").attr("disabled","disabled").css("cursor","default");
                $("#dialog #moreGroup").css("opacity","0.5");
			} else
			{
				$("table#add-groups-table td.groupsSelect select").not($("#dialog select:first")).each(function()
				{
					$(this).removeAttr("disabled");
                    $(this).css("opacity","1.0");
				});
				$("table#add-groups-table td.groupsButton input").each(function()
				{
					$(this).removeAttr("disabled").css("cursor","pointer");
                    $(this).css("opacity","1.0");
				});
				$("#dialog #moreGroup").removeAttr("disabled").css("cursor","pointer");
                $("#dialog #moreGroup").css("opacity","1.0");
			}
		});
		// кнопки добавления дополнительных групп
		$("#dialog #moreGroup").button().click(function()
		{
			if($("table#add-groups-table .groupsSelect select:last").length < 1)
				$("table#add-groups-table td.groupsSelect").append($("#dialog select:first").clone());
			else
				$("table#add-groups-table td.groupsSelect").append($("table#add-groups-table .groupsSelect select:last").clone()); // клонируем для удобства
			var currSelect = $("table#add-groups-table .groupsSelect select:last"); // ищем текущий селект
			currSelect.children("option[value=0]").remove(); // если есть дополнительные группы, то контакт уже не может быть не в группе
			currSelect.attr("name","groupAdd"+i); // для удобства удаления, изменяем имя селекта
			currSelect.addClass("additionalGroup");
			
			//$(".groupsSelect select:last").attr("id","groupAdd"+i++);
			$("table#add-groups-table td.groupsButton").append("<input type='button' name='groupAdd" + i++ + "' id='removeGroup' value='Убрать привязку'>"); // кнопка для удаления
			$("table#add-groups-table td.groupsButton input:last").button().click(function() // по клику будем удалять доп группу
			{
				// удаляем как саму кнопку, так и выбор группы
				$("table#add-groups-table td.groupsSelect select[name=" + $(this).attr("name") + "]").remove(); 
				$(this).remove();
				$("#dialog select:first").change(); // а вдруг был выбран пункт "Не в группе"
			});
			
			$("#dialog select:first").change(); // а вдруг был выбран пункт "Не в группе"
		});
		
		$("#dialog select:first").change();
		
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
					buttons: {
						'Сохранить': function(){
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editLastName, _this.mess['SECOND_NAME'], 0, 30, tips);
							bValid = bValid && checkLength(_this.editName, _this.mess['NAME'], 0, 30, tips);
							bValid = bValid && checkLength(_this.editPhone, _this.mess['TELEPHONE'], 4, 30, tips);
							bValid = bValid && checkPhone(_this.editPhone, _this.mess['TELEPHONE'], tips);
							
							var additionalGroups = new Array();
							if(_this.editGroup.val() != 0)
							{
								var addGrArr = $(".additionalGroupEdit");
								addGrArr.each(function()
								{
									if($(this).val() == _this.editGroup.val())
										return true;
									additionalGroups.push($(this).val());
								});
							}
							additionalGroups = array_normal_unique(additionalGroups); 
							var stringAddGroups = additionalGroups.join(',');
							
							var rec_used = $("#contact-list tr[id=" + _this.contactId.val() + "]:first td.phone").attr("title").split(" ")[0];
							
							if (bValid) 
							{
								_this.Request("ContactEdit", 
												{
													lastname: _this.editLastName.val(),
													name: _this.editName.val(),
													phone: _this.editPhone.val(),
													group: _this.editGroup.val(),
													addGroups: stringAddGroups,
													contactId: _this.contactId.val(),
													recently_used: rec_used
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
						$("#contact-edit #moreGroup").button().unbind("click");
						$("table#edit-groups-table tr:eq(0) td").children().remove();
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
					buttons: {
						'Save': function(){
							var bValid = true;
							allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editLastName, _this.mess['SECOND_NAME'], 0, 30, tips);
							bValid = bValid && checkLength(_this.editName, _this.mess['NAME'], 0, 30, tips);
							bValid = bValid && checkLength(_this.editPhone, _this.mess['TELEPHONE'], 4, 30, tips);
							bValid = bValid && checkPhone(_this.editPhone, _this.mess['TELEPHONE'], tips);
							
							var additionalGroups = new Array();
							if(_this.editGroup.val() != 0)
							{
								var addGrArr = $(".additionalGroupEdit");
								addGrArr.each(function()
								{
									if($(this).val() == _this.editGroup.val())
										return true;
									additionalGroups.push($(this).val());
								});
							}
							additionalGroups = array_normal_unique(additionalGroups); 
							var stringAddGroups = additionalGroups.join(',');
							
							var rec_used = $("#contact-list tr[id=" + _this.contactId.val() + "]:first td.phone").attr("title").split(" ")[0];

							if (bValid) 
							{
								_this.Request("ContactEdit", 
												{
													lastname: _this.editLastName.val(),
													name: _this.editName.val(),
													phone: _this.editPhone.val(),
													group: _this.editGroup.val(),
													addGroups: stringAddGroups,
													contactId: _this.contactId.val(),
													recently_used: rec_used
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
						$("#contact-edit #moreGroup").button().unbind("click");
						$("table#edit-groups-table tr:eq(0) td").children().remove();
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
						//allFields.val('').removeClass('ui-state-error');
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
							//allFields.val('').removeClass('ui-state-error');
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
					modal: false,
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
	
	
	//инициализация редактирования группы
	clientSide.prototype.InitCelebrateDialog = function()
	{
		var _this = this; 
				
		if (_this.lang == 'ru')
		{
			tips = $('#celebrateDialogTip');
			//allFields = $([]).add(_this.editGroupName);
			
			$('#celebrate-dialog').dialog({
					bgiframe: true,
					autoOpen: false,
					width: 480,
					resizable: false,
					modal: false,
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
						//allFields.val('').removeClass('ui-state-error');
						//tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					} 
			});
		}
		else
		{
			/*tips = $('#groupEditTip');
			allFields = $([]).add(_this.editGroupName);
			
			$('#group-edit').dialog({
			bgiframe: true,
			autoOpen: false,
			width: 450,
			resizable: false,
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
			});	*/
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

	


//функция вызывается после добавления группы
clientSide.prototype.AfterGroupAdd = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		this.groupList.append('<div id = "'+data.id+'"> \
									<p class = "group-header"> \
										<a class="">'+data.name+'</a>\
										<span class = "edit-group ui-icon ui-icon-pencil" title="Редактировать название группы"></span> \
										<span class = "delete-group ui-icon ui-icon-close" title="Удалить группу"></span> \
										<a href="index.php?addfromgroup='+data.id+'" class="add-all-group-numbers ui-icon ui-icon-mail-closed" title="Отправить на все контакты из группы"></a> \
									</p></div>');
									
		$(".groupcontent").append('<div id="group-'+data.id+'" class="group-number"><div class="group-body"><h3>Группа &laquo;'+data.name+'&raquo;</h3> </div></div>'); // <table><tbody></tbody></table>
		
		// делаем таблицу для сортировки
		
		//var clone = $("#contact-list #group-0 table").clone(); // клонируем таблицу из группы "не в группе"
		
		
		//clone.find("tbody").children().remove(); // удаляем содержимое
		//$("#contact-list #group-"+data.id+" .group-body").append(clone); // вставляем в только что созданную группу
		// вставляем в только что созданную группу новую таблицу
		$("#contact-list #group-"+data.id+" .group-body").append(
		"<table class='group-tbl-containerv contacts-table'>" + 
		                        "<thead>" +
									"<tr>" +
										"<th class='not-sort-col'></th>" +            
										"<th class='sort-col'>" + _this.mess['HEAD_LASTNAME'] + "</th>" +
										"<th class='sort-col'>" + _this.mess['HEAD_NAME'] + "</th>" +
										"<th class='sort-col'>" + _this.mess['HEAD_PHONE'] + "</th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>" +
								"</tbody>" +
								"<tfoot>" +
									"<tr>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'>" + _this.mess['HEAD_LASTNAME'] + "</th>" +
										"<th class='not-sort-col'>" + _this.mess['HEAD_NAME'] + "</th>" +
										"<th class='not-sort-col'>" + _this.mess['HEAD_PHONE'] + "</th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
									"</tr>" +
								"</tfoot>" +
							"</table>"
		); 
		// применяем таблицу для сортировки
		$("#contact-list #group-"+data.id+" table").dataTable({
	        "bPaginate": false,
	        "bLengthChange": false,
	        "bFilter": false,
	        "bSort": true,
	        "bInfo": false,
	        "bAutoWidth": false,
			"oLanguage": {
				"sEmptyTable": "<span class='notify'>В этой группе контакты отсутствуют</span>"
			}
	    }); 
		
		
		$("#groups").append("<option value="+data.id+" selected>"+data.name+"</option>");
        $("#edit-groups").append("<option value="+data.id+">"+data.name+"</option>");
		$(".additionalGroup").append("<option value="+data.id+">"+data.name+"</option>");
		
		$("#dialog select:first").change();
		
		this.AddHoverEffectForGroupIcons();
		
		this.moveElementsBody.append("<div groupid="+data.id+">"+data.name+"</div>");
		this.addElementsBody.append("<div groupid="+data.id+">"+data.name+"</div>");
		this.hoverForControls();
		
		// проваливающаяся иконка с отправкой на все контакты из группы
		$(".grouplist .ui-icon-mail-closed").mouseenter(function()
		{
		    $(this).addClass("small-buttons-hover");
		}).mouseleave(function()
		{
		    $(this).removeClass("small-buttons-hover");
		});
		
		_this.tablesSort(data.id);
		
		_this.checkTableEmptiness();
		_this.contactsRecount(true, data.id); // необходимо пересчитать как в первый раз, когда ещё никто не считал
		
		$("#" + data.id + " p a").first().click(); // переходим к только что созданной группе
		                                                                     
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['NEW_GROUP'] + " «" + data.name + "»");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['NEW_GROUP_ERR']);	
	}	
}

//функция после редактирования группы
clientSide.prototype.AfterGroupEdit = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var groupNameOld = $("#"+data.id).find("a:first").text();
		
		var len = $("#contact-list #group-"+data.id+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
	    lenlen = lenlen.length;
	    groupNameOld = groupNameOld.substr(0,groupNameOld.length-lenlen-3);
	    
		$("#contact-list #"+data.id+" p a:eq(0)").text(data.groupname);
		$("#group-"+data.id+" h3").html("Группа &laquo;"+data.groupname+"&raquo;");
		$('#edit-groups option[value='+data.id+']').text(data.groupname);
		$('#groups option[value='+data.id+']').text(data.groupname);
		$(".moveElements-body div[groupid="+data.id+"]").text(data.groupname);
		$(".addElements-body div[groupid="+data.id+"]").text(data.groupname);
		
		var groupNameNew = $("#"+data.id).find("a:first").text();
		
		if(len > 0)
		{
			var newTitle = $(".group-item[groupid=" + data.id + "]").attr("title").replace(groupNameOld,groupNameNew);
			$(".group-item[groupid=" + data.id + "]").attr("title",newTitle);
			$(".group-item[groupid=" + data.id + "]").text(groupNameNew);
		}
		
		//_this.tablesSort(data.id);
		
		_this.contactsRecount(true, data.id);
		                                                                                                                              
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['GROUP_EDITED'] + ". Старое имя группы - «" + groupNameOld + "»" + ". Новое имя группы - «" + groupNameNew + "»");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_EDIT_ERR']); 
	}	
}

//после удаления группы
clientSide.prototype.AfterGroupDelete = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var groupName = $("#"+data.groupId).find("a:first").text();
		var len = $("#contact-list #group-"+data.groupId+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
	    lenlen = lenlen.length;
	    groupName = groupName.substr(0,groupName.length-lenlen-3);
		
		$("#contact-list #group-" + data.groupId + " tbody tr").each(function()
		{
			var currId = $(this).attr("id");
			// если имеется в часто используемых - тоже удаляем
			if($("#contact-list #group-1 tr[id="+currId+"]").length > 0)
			{
				var cont = $("#contact-list #group-1 tr[id="+currId+"]").closest("table");

				cont.find("tbody tr").each(function(index)
				{
					if($(this).attr("id") == currId)
					{
						//alert(index);
					    cont.dataTable().fnDeleteRow(index);
					    return false;
					}
				});
			}
		});
		
		if (data.groupId==0)
			$("#contact-list tr[groupid=0]").closest("table").dataTable().fnClearTable();
		else
		{
			$("#"+data.groupId).remove();
			$("#groups option[value="+data.groupId+"]").remove();
			$("#edit-groups option[value="+data.groupId+"]").remove();
			$(".moveElements-body div[groupid="+data.groupId+"]").remove();
			$(".addElements-body div[groupid="+data.id+"]").text(data.groupname);
		}
		
		// удаляем группу в блочках у колонки с группами
		$(".group-item[groupid="+data.groupId+"]").each(function()
		{
			$(this).remove();
		});
		
		_this.contactsRecount(false, undefined);
		
		_this.checkTableEmptiness();
/*		
 $(".group-item[groupid=717937]").each(function()
{

if($(this).parent().children(".more-groups").length == 1)
{
if($(this).parent().children(".more-groups").children().length != 0)
{
//$(this).replaceWith($(this).parent().children(".more-groups").children(".group-item:last"));    
}
else
{
$(this).remove();
$(this).parent().children()[3].remove();
$(this).parent().children()[5].remove();
$(this).parent().children()[4].remove();

}

}
else
{
$(this).remove();
}

});*/
		
		$("#1 p a").first().click(); // переходим к часто используемым после удаления
		                                                                       
		if(data.groupId == 0)
			_this.ShowNote(_this.mess['SUCCESS'], _this.mess['GROUP_NO_GROUP_DELETED']);
		else
			_this.ShowNote(_this.mess['SUCCESS'], _this.mess['GROUP_DELETED'] + " «" + groupName + "»");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_DELETE_ERR']);
	}
}

//функция вызывается после добавления контакта
clientSide.prototype.AfterContactAdd = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		_this.turnOnTables(data.group);
		
		var groupsColumnBody = "";
		
		if(data.group != 0)
		{
			// берем только три группы для помещения в колонку с группами
			var groupName = $(".grouplist #"+data.group).children().children("a:first").text();
			var len = $("#contact-list #group-"+data.group+" table tbody tr.searchable").length;
			var lenlen = "" + len;
			lenlen = lenlen.length;
			groupName = groupName.substr(0,groupName.length-lenlen-3);
			groupsColumnBody += "<div title=\"Перейти в группу '" + groupName + "'\" groupId='" + data.group + "' class='group-item'><a>" + groupName + "</a></div>";
			
			var i = 0;
			if(data.addGroups.length > 0)
			{
				var arrGroups = data.addGroups.split(',');
				
				arrGroups.forEach(function(addGroupId)
				{
					if(i++ == 1)
						return false;
						
					var groupName = $(".grouplist #"+addGroupId).children().children("a:first").text();
					var len = $("#contact-list #group-"+addGroupId+" table tbody tr.searchable").length;
					var lenlen = "" + len;
					lenlen = lenlen.length;
					groupName = groupName.substr(0,groupName.length-lenlen-3);
					groupsColumnBody += "<div title=\"Перейти в группу '" + groupName + "'\" groupId='" + addGroupId + "' class='group-item'><a>" + groupName + "</a></div>";
				});
			}
		}
			    
        // заменяю на таблицу с сортировкой
        $("#contact-list #group-"+data.group+" table").dataTable().fnAddData( [
						"<input type='checkbox' />",
						data.lastname,
						data.name,
						data.telephone,
						"<div class='group-list'>" + groupsColumnBody + "</div>",
						"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
						"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
						"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
		);
		var added = $("#contact-list #group-"+data.group+" table tbody").find("td:contains('" + data.telephone + "')").parent().attr("id",data.id).attr("groupId",data.group).
					attr("contactLastName",data.lastname).attr("contactName",data.name).attr("contactPhone",data.telephone).addClass("searchable");
		added.find("td:eq(0)").addClass("chkbox");
		added.find("td:eq(1)").addClass("lastname");
		added.find("td:eq(2)").addClass("name");
		added.find("td:eq(3)").addClass("phone").attr("title","0 смс");
		added.find("td:eq(4)").addClass("contact-groups");

		_this.giveTableCorrectWidth(data.group);
		
		if(data.addGroups.length > 0)
		{
			var arrGroups = data.addGroups.split(',');
			
			arrGroups.forEach(function(addGroupId)
			{
				_this.turnOnTables(addGroupId);
				
				// заменяю на таблицу с сортировкой
		        $("#contact-list #group-"+addGroupId+" table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								data.lastname,
								data.name,
								data.telephone,
								"<div class='group-list'>" + groupsColumnBody + "</div>",
								"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
								"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
								"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
				);
				var added = $("#contact-list #group-"+addGroupId+" table tbody").find("td:contains('" + data.telephone + "')").parent().attr("id",data.id).attr("groupId",addGroupId).
							attr("contactLastName",data.lastname).attr("contactName",data.name).attr("contactPhone",data.telephone).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("lastname");
				added.find("td:eq(2)").addClass("name");
				added.find("td:eq(3)").addClass("phone").attr("title","0 смс");
				added.find("td:eq(4)").addClass("contact-groups");
				
				_this.giveTableCorrectWidth(addGroupId);
			});
			
		}
		                                                                                          
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['NEW_CONTACT'] + ". Телефон добавленного контакта - «" + data.telephone + "»");
		
		_this.checkTableEmptiness();
		_this.contactsRecount(false, undefined); // делаем пересчет контактов
							
		_this.AddHoverEffectForContactList();
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], data.text);
	}
}

//функция после реадктирования элемента
clientSide.prototype.AfterContactEdit = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var contPhone = $("#contact-list tr[id="+data.contactId+"]:first").attr("contactphone");
		
		// берем только три группы для помещения в колонку с группами
		var groupsColumnBody = "";
		var i = 0;
		for (var i in data.newGroups)
		{
			var contactGroup = data.newGroups;
			
			if(i++ == 3)
				break;
				
			var groupName = $(".grouplist #"+contactGroup[i]).children().children("a:first").text();
			var len = $("#contact-list #group-"+contactGroup[i]+" table tbody tr.searchable").length;
			var lenlen = "" + len;
			lenlen = lenlen.length;
			groupName = groupName.substr(0,groupName.length-lenlen-3);
			groupsColumnBody += "<div title=\"Перейти в группу '" + groupName + "'\" groupId='" + contactGroup[i] + "' class='group-item'><a>" + groupName + "</a></div>";
		}
		
		//если поменялась группа, то тогда нужно удалять узел и прикреплять его в другое место
		if (data.groupChange == "Y")
		{
			var flagRecent = false;
			
			if($("#contact-list #group-1 tr[id="+data.contactId+"]").length != 0)
				flagRecent = true;
			
			// сначала удалим все старые записи с контактом
			var trContact = $("#contact-list tr[id="+data.contactId+"]");
			trContact.each(function(index)
			{
				var _this = $(this);

				var row = _this.get(0); // получаем объект элемента из ДОМа

				var oTable = _this.closest("table").dataTable();

				var index = oTable.fnGetPosition(row); 	// получаем позицию строки
				oTable.fnDeleteRow(index);	// удаляем
				
			});
			
			// если контакт переместили в "Не в группе"
			if(data.newGroups == 0)
			{
				_this.turnOnTables(0);
				
				// заменяю на таблицу с сортировкой
			    $("#contact-list #group-0 table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								data.newLastName,
								data.newName,
								data.newPhone,
								"",
								"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
								"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
								"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
				);
				var addedAdditional = $("#contact-list #group-0 table tbody").find("td:contains('" + data.newPhone + "')").parent().attr("id",data.contactId).attr("groupId",0).
							attr("contactLastName",data.newLastName).attr("contactName",data.newName).attr("contactPhone",data.newPhone).addClass("searchable");
				addedAdditional.find("td:eq(0)").addClass("chkbox");
				addedAdditional.find("td:eq(1)").addClass("lastname");
				addedAdditional.find("td:eq(2)").addClass("name");
				addedAdditional.find("td:eq(3)").addClass("phone").attr("title",data.recentlyUsed + " смс");
				addedAdditional.find("td:eq(4)").addClass("contact-groups");
				
				_this.giveTableCorrectWidth(0);
			}
			else
			{
				// затем добавляем контакт в его новые группы
				for (var i in data.newGroups)
				{
					var contactGroup = data.newGroups;
					
					_this.turnOnTables(contactGroup[i]);
					
					// заменяю на таблицу с сортировкой
				    $("#contact-list #group-"+contactGroup[i]+" table").dataTable().fnAddData( [
									"<input type='checkbox' />",
									data.newLastName,
									data.newName,
									data.newPhone,
									"<div class='group-list'>" + groupsColumnBody + "</div>",
									"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
									"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
									"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
					);
					var addedAdditional = $("#contact-list #group-"+contactGroup[i]+" table tbody").find("td:contains('" + data.newPhone + "')").parent().attr("id",data.contactId).attr("groupId",contactGroup[i]).
								attr("contactLastName",data.newLastName).attr("contactName",data.newName).attr("contactPhone",data.newPhone).addClass("searchable");
					addedAdditional.find("td:eq(0)").addClass("chkbox");
					addedAdditional.find("td:eq(1)").addClass("lastname");
					addedAdditional.find("td:eq(2)").addClass("name");
					addedAdditional.find("td:eq(3)").addClass("phone").attr("title",data.recentlyUsed + " смс");
					addedAdditional.find("td:eq(4)").addClass("contact-groups");
					
					_this.giveTableCorrectWidth(contactGroup[i]);
				}	
			}
			
			if(flagRecent)
			{
				_this.turnOnTables(1);
				
				// заменяю на таблицу с сортировкой
			    $("#contact-list #group-1 table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								data.newLastName,
								data.newName,
								data.newPhone,
								"<div class='group-list'>" + groupsColumnBody + "</div>",
								"",
								"",
								"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
				);
				var addedAdditional = $("#contact-list #group-1 table tbody").find("td:contains('" + data.newPhone + "')").parent().attr("id",data.contactId).attr("groupId",1).
							attr("contactLastName",data.newLastName).attr("contactName",data.newName).attr("contactPhone",data.newPhone).addClass("searchable");
				addedAdditional.find("td:eq(0)").addClass("chkbox");
				addedAdditional.find("td:eq(1)").addClass("lastname");
				addedAdditional.find("td:eq(2)").addClass("name");
				addedAdditional.find("td:eq(3)").addClass("phone").attr("title",data.recentlyUsed + " смс");
				addedAdditional.find("td:eq(4)").addClass("contact-groups");
				
				_this.giveTableCorrectWidth(1);
			}
		}
		//иначе просто меняем данные о контакте
		else
		{			
			// заменяем редактирование для таблицы с сортировкой
			var trContact = $("#contact-list tr[id="+data.contactId+"]");
			trContact.each(function(index)
			{
				var _this = $(this);
				
				var group = _this.attr("groupId");

				var row = _this.get(0); // получаем объект элемента из ДОМа

				var oTable = _this.closest("table").dataTable();

				var index = oTable.fnGetPosition(row); 	// получаем позицию строки
				
				oTable.fnUpdate( [
					"<input type='checkbox' />",
					data.newLastName,
					data.newName,
					data.newPhone,
					"<div class='group-list'>" + groupsColumnBody + "</div>",
					"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
					"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
					"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ], index, 0
				);
				
				_this.attr("id",data.contactId).attr("groupId",group).attr("contactLastName",data.newLastName).attr("contactName",data.newName).attr("contactPhone",data.newPhone).addClass("searchable");
				
				_this.find("td:eq(0)").addClass("chkbox");
				_this.find("td:eq(1)").addClass("lastname");
				_this.find("td:eq(2)").addClass("name");
				_this.find("td:eq(3)").addClass("phone").attr("title","0 смс");
				_this.find("td:eq(4)").addClass("contact-groups");
				
			});
		}
		
		_this.checkTableEmptiness();
		_this.contactsRecount(false, undefined);
		
		_this.AddHoverEffectForContactList();
		                                                                                                       
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['CONTACT_EDITED'] + ". Телефон редактируемого контакта - «" + contPhone + "»");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['CONTACT_EDIT_ERR']);
	}		
}

//после удаления контакта
clientSide.prototype.AfterContactDelete = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var contPhone = $("#contact-list tr[id="+data.contactId+"][groupid="+data.groupId+"]").attr("contactphone");
		
		// заменяем удаление для таблицы с сортировкой
		var cont = $("#contact-list tr[id="+data.contactId+"][groupid="+data.groupId+"]");

		var row = cont.get(0); // получаем объект элемента из ДОМа

		var oTable = cont.closest("table").dataTable();

		var index = oTable.fnGetPosition(row); 	// получаем позицию строки
		oTable.fnDeleteRow(index);	// удаляем

		// если имеется в часто используемых - тоже удаляем
		if($("#contact-list #group-1 tr[id="+data.contactId+"]").length > 0 && $("#contact-list tr[id="+data.contactId+"]").not($("#contact-list #group-1 tr[id="+data.contactId+"]")).length < 1)
		{
			// заменяем удаление для таблицы с сортировкой
			var cont = $("#contact-list #group-1 tr[id="+data.contactId+"]");

			var row = cont.get(0); // получаем объект элемента из ДОМа

			var oTable = cont.closest("table").dataTable();

			var index = oTable.fnGetPosition(row); 	// получаем позицию строки
			oTable.fnDeleteRow(index);	// удаляем
		}
		
		_this.checkTableEmptiness();
		_this.contactsRecount(false, undefined);
		                                                                                                 
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['CONTACT_DELETED'] + ". Телефон удаленного контакта - «" + contPhone + "»");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['CONTACT_DELETE_ERR']);
	}	
}

//после добавления контактов
clientSide.prototype.AfterContactAddFromExcel = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		$(".grouplist div#1").children().children("a:first").text("Часто используемые");
		$(".grouplist div#0").children().children("a:first").text("Не в группе");
		_this.resetTablesContentCount(); // сбрасываем отображение количества шаблонов в группах
		
		//сначала добавим новые группы, если они есть
		if (data.newGroups.length > 0)
		{
			for(var index in data.newGroups)
			{
                if(data.newGroups[index].id == 0)
                    continue;
                    
				this.groupList.append('<div id = "'+data.newGroups[index].id+'"> \
						<p class = "group-header"> \
							<a class="">'+data.newGroups[index].name+'</a>\
							<span class = "edit-group ui-icon ui-icon-pencil" title="Редактировать название группы"></span> \
							<span class = "delete-group ui-icon ui-icon-close" title="Удалить группу"></span> \
							<a href="index.php?addfromgroup='+data.newGroups[index].id+'" class="add-all-group-numbers ui-icon ui-icon-mail-closed" title="Отправить на все контакты из группы"></a> \
						</p></div>');
						
				$(".groupcontent").append('<div id="group-'+data.newGroups[index].id+'" class="group-number"><div class="group-body"><h3>Группа &laquo;'+data.newGroups[index].name+'&raquo;</h3> </div></div>'); // <table><tbody></tbody></table>
				
				// вставляем в только что созданную группу новую таблицу
				$("#contact-list #group-"+data.newGroups[index].id+" .group-body").append(
				"<table class='group-tbl-containerv contacts-table'>" + 
				                        "<thead>" +
											"<tr>" +
												"<th class='not-sort-col'></th>" +            
												"<th class='sort-col'>" + _this.mess['HEAD_LASTNAME'] + "</th>" +
												"<th class='sort-col'>" + _this.mess['HEAD_NAME'] + "</th>" +
												"<th class='sort-col'>" + _this.mess['HEAD_PHONE'] + "</th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
											"</tr>" +
										"</thead>" +
										"<tbody>" +
										"</tbody>" +
										"<tfoot>" +
											"<tr>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'>" + _this.mess['HEAD_LASTNAME'] + "</th>" +
												"<th class='not-sort-col'>" + _this.mess['HEAD_NAME'] + "</th>" +
												"<th class='not-sort-col'>" + _this.mess['HEAD_PHONE'] + "</th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
											"</tr>" +
										"</tfoot>" +
									"</table>"
				); 
				// применяем таблицу для сортировки
				$("#contact-list #group-"+data.newGroups[index].id+" table").dataTable({
					"bPaginate": false,
					"bLengthChange": false,
					"bFilter": false,
					"bSort": true,
					"bInfo": false,
					"bAutoWidth": false,
					"oLanguage": {
						"sEmptyTable": "<span class='notify'>В этой группе контакты отсутствуют</span>"
					}
				}); 
				
				
				$("#groups").append("<option value="+data.newGroups[index].id+" selected>"+data.newGroups[index].name+"</option>");
				$("#edit-groups").append("<option value="+data.newGroups[index].id+">"+data.newGroups[index].name+"</option>");
				$(".additionalGroup").append("<option value="+data.newGroups[index].id+">"+data.newGroups[index].name+"</option>");
                
				this.AddHoverEffectForGroupIcons();
				
				this.moveElementsBody.append("<div groupid="+data.newGroups[index].id+">"+data.newGroups[index].name+"</div>");
				this.addElementsBody.append("<div groupid="+data.newGroups[index].id+">"+data.newGroups[index].name+"</div>");
				this.hoverForControls();
			}
		}
		
		if (data.success > 0)
		{
			for (var i in data.addedContacts)
			{
				var addedContacts = data.addedContacts;
				
				_this.turnOnTables(addedContacts[i].groups);
				
				var groupsColumnBody = "";
				
				// заменяю на таблицу с сортировкой
			    $("#contact-list #group-"+addedContacts[i].groups+" table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								addedContacts[i].lastname,
								addedContacts[i].firstname,
								addedContacts[i].phone,
								"<div class='group-list'>" + groupsColumnBody + "</div>",
								"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
								"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
								"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
				);
				var added = $("#contact-list #group-"+addedContacts[i].groups+" table tbody").find("td:contains('" + addedContacts[i].phone + "')").parent().attr("id",addedContacts[i].id).attr("groupId",addedContacts[i].groups).
							attr("contactLastName",addedContacts[i].lastname).attr("contactName",addedContacts[i].firstname).attr("contactPhone",addedContacts[i].phone).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("lastname");
				added.find("td:eq(2)").addClass("name");
				added.find("td:eq(3)").addClass("phone").attr("title","0 смс");
				added.find("td:eq(4)").addClass("contact-groups");
				
				_this.giveTableCorrectWidth(addedContacts[i].groups);
				
				// если не имеются дополнительные группы, то продолжаем
				if (addedContacts[i].groups2 == undefined)
				    continue;
				// добавляем контакты в доп. группы
				for (var j in addedContacts[i].groups2)
				{
					var addedContactsAddGroups = addedContacts[i].groups2;
					
					_this.turnOnTables(addedContactsAddGroups[j]);
					
					var groupsColumnBody = "";
					var groupName = $(".grouplist #"+addedContactsAddGroups[j]).children().children("a:first").text();
					groupsColumnBody += "<div title=\"Перейти в группу '" + groupName + "'\" groupId='" + addedContacts[i].groups + "' class='group-item'><a>" + groupName + "</a></div>";
			
					// заменяю на таблицу с сортировкой
				    $("#contact-list #group-"+addedContactsAddGroups[j]+" table").dataTable().fnAddData( [
									"<input type='checkbox' />",
									addedContacts[i].lastname,
									addedContacts[i].firstname,
									addedContacts[i].phone,
									"<div class='group-list'>" + groupsColumnBody + "</div>",
									"<div class='edit-contact ui-icon ui-icon-pencil' title='Изменить контакт'></div>",
									"<div class='delete-contact ui-icon ui-icon-close' title='Удалить контакт'></div>",
									"<div class='send-contact ui-icon ui-icon-mail-closed' title='Отправить на номер'></div>" ] 
					);
					var addedAdditional = $("#contact-list #group-"+addedContactsAddGroups[j]+" table tbody").find("td:contains('" + addedContacts[i].phone + "')").parent().attr("id",addedContacts[i].id).attr("groupId",addedContactsAddGroups[j]).
								attr("contactLastName",addedContacts[i].lastname).attr("contactName",addedContacts[i].firstname).attr("contactPhone",addedContacts[i].phone).addClass("searchable");
					addedAdditional.find("td:eq(0)").addClass("chkbox");
					addedAdditional.find("td:eq(1)").addClass("lastname");
					addedAdditional.find("td:eq(2)").addClass("name");
					addedAdditional.find("td:eq(3)").addClass("phone").attr("title","0 смс");
					addedAdditional.find("td:eq(4)").addClass("contact-groups");
					
					_this.giveTableCorrectWidth(addedContactsAddGroups[j]);
				}
				
			}
			
			_this.AddHoverEffectForContactList();
		}
		
		// проваливающаяся иконка с отправкой на все контакты из группы
		$(".grouplist .ui-icon-mail-closed").mouseenter(function()
		{
		    $(this).addClass("small-buttons-hover");
		}).mouseleave(function()
		{
		    $(this).removeClass("small-buttons-hover");
		});
		
		_this.checkTableEmptiness();
		_this.contactsRecount(true, undefined);
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['SUCCESS_DOWNLOAD']+data.success+_this.mess['UNSUCCESS_DOWNLOAD']+data.fail+'<br>Ошибки:<br>'+data.failText);
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
	var tempDialog = this.ajaxDialog;
	var id = setTimeout(function(){tempDialog.dialog("close"); clearTimeout($("#dialog-id").html())},5000);
	$("#dialog-id").html(id);			
}
clientSide.prototype.ShowError = function(title, text)
{
	this.ajaxDialog.dialog('option', 'title', title);
	this.ajaxDialogText.html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + text);
	this.ajaxDialog.dialog('open');
	var tempDialog = this.ajaxDialog;
	var id = setTimeout(function(){tempDialog.dialog("close"); clearTimeout($("#dialog-id").html())},5000);
	$("#dialog-id").html(id);			
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
 
clientSide.prototype.tablesSort = function(newGroupID)
{	
	// выбираем только что добавленную группу
	var addedGroup = $(".grouplist #"+newGroupID).children().children("a:first").text();
	var firstLetter = addedGroup.toLowerCase().charAt(0); // получаем первый символ в названии группы
	// получаем все группы, кроме "Часто используемые"
	var groupsHeaders = $(".grouplist div").not($(".grouplist div#newgroup, div#1"));
	var lengthGroups = groupsHeaders.length; // получаем количество групп

	var i=0; // счетчик
	var currChar = ""; // текущий символ
	var currDiv = groupsHeaders; // текущий див с группой
	var flagAdd = false; // флаг добавления
	// идем по всем группам
	for(var i = 0; i < lengthGroups-1; i++)
	{
		currDiv = currDiv.next("div:first"); // текущий див
	    currChar = currDiv.children().children("a:first").text().toLowerCase().charAt(0); //  первый символ текущией группы
	    // если перешли за символ, который больше, чем у добавляемой группы, то вставляем див с группой за предыдущий от текущего
	    if(currChar > firstLetter)
	    {
	        $(".grouplist #"+newGroupID).insertAfter(currDiv.prev("div:first"));
	        flagAdd = true;
	        break;
	    }
	}
	// если группа не была вставлена в нужное место
	if(!flagAdd)
	{
		$(".grouplist #"+newGroupID).insertAfter($(".grouplist #0"));
	}
	
}

//проверка на отсутствие контактов в таблице
clientSide.prototype.checkTableEmptiness = function()
{
	$("#contact-list table").each(function()
	{
		if($(this).find("tr td").hasClass("dataTables_empty"))
		{
			$(this).dataTable().fnSetColumnVis( 1, false );
			$(this).dataTable().fnSetColumnVis( 2, false );
			$(this).dataTable().fnSetColumnVis( 3, false ); 
		}
	});
}

//активизация таблиц
clientSide.prototype.turnOnTables = function(groupNumber)
{
	if($("#contact-list #group-"+groupNumber+" table tr td").hasClass("dataTables_empty"))
	{
		$("#contact-list #group-"+groupNumber+" table").dataTable().fnSetColumnVis( 1, true);
		$("#contact-list #group-"+groupNumber+" table").dataTable().fnSetColumnVis( 2, true);
		$("#contact-list #group-"+groupNumber+" table").dataTable().fnSetColumnVis( 3, true); 
	}
}

//корректировка столбцов в таблице
clientSide.prototype.giveTableCorrectWidth = function(groupNumber)
{
	$("#contact-list #group-"+groupNumber+" table tr td.lastname").css("width","90px");
	$("#contact-list #group-"+groupNumber+" table tr td.name").css("width","90px");
	$("#contact-list #group-"+groupNumber+" table tr td.phone").css("width","90px");
}

//подсчет контактов в каждой таблице
/*clientSide.prototype.contactsRecount = function(first, tableID)
{
	$(".group-header").each(function()
	{
	    var groupId = $(this).parent().attr("id");
	    var len = $("#group-"+groupId+" tbody tr").length;
		$(this).find(".group-count").text(len); 
	});
}*/

//подсчет контактов в каждой таблице
clientSide.prototype.contactsRecount = function(first, tableID)
{
	var groupsHeaders;
	if(tableID == undefined)
		groupsHeaders = $(".grouplist div").not($(".grouplist div#newgroup"));
	else
		groupsHeaders = $(".grouplist div#" + tableID);
	groupsHeaders.each(function()
	{
	    var groupId = $(this).attr("id");
	    var len = $(".groupcontent #group-" + groupId + " table tbody tr[groupid=" + groupId + "]").length;
	    var lenlen = "" + len;
	    lenlen = lenlen.length;
	    var text = $(this).children().children("a:first").text();
	    if(!first)
	    	text = text.substr(0,text.length-lenlen-3);
	     
	    $(this).children().children("a:first").text(text + " (" + len + ")");  
	});
	
}

// проверка - можно ли активировать контролы для массового удаления, перемещения и добавления контактов
clientSide.prototype.CheckIfCanAddMoveRemove = function()
{
	var _this = this;
	//если выбран хотя бы один чекбокс, тогда активизируем контролы
	if ($("input[type=checkbox]").parent().parent().parent().find('input[type=checkbox]:checked').length > 0)
	{
		$("#sendto").button( "option", "disabled", false );
		
		var canMove = true;
		var canAdd = true;
		var contactsSelected = $("#contact-list tr.ui-selecting");
		contactsSelected.each(function(id)
		{
			if($(this).attr("groupid") == 1 )
			{
				canMove = false;
				canAdd = false;
			}
			if($(this).attr("groupid") == 0 )
				canAdd = false;
		});
		
		if(canAdd)
		{
			//добавления
			_this.addingHeaderText.addClass('addElements-header-text-enabled');
			_this.addingHeader.addClass('dashed');
		}
		else
		{
			// добавления
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');
		}
		
		if(canMove)
		{
			//перемещения
			_this.movingHeaderText.addClass('moveElements-header-text-enabled');
			_this.movingHeader.addClass('dashed');
			
			// удаления
			$('.actionElements-body [action=del]').show();
		}
		else
		{
			//перемещения
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			
			// удаления
			$('.actionElements-body [action=del]').hide();
		}
		 
	}
	else
	{
		$("#sendto").button( "option", "disabled", true );
		
		//перемещения
		_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
		_this.movingHeader.removeClass('dashed');	
		_this.moveElementsBody.css('display','none');
		
		// добавления
		_this.addElementsBody.css('display','none');
		_this.addingHeaderText.removeClass('addElements-header-text-enabled');
		_this.addingHeader.removeClass('dashed');
		
		// удаления
		$('.actionElements-body [action=del]').hide();
	}
}

//подсчет контактов в каждой таблице
clientSide.prototype.resetTablesContentCount = function()
{
	var groupsHeaders;
	groupsHeaders = $(".grouplist div").not($(".grouplist div#newgroup, div#1, div#0"));
	
	groupsHeaders.each(function()
	{
	    var text = $(this).children().children("a:first").text();
	    text = text.substr(0,text.length-4);
	     
	    $(this).children().children("a:first").text(text);  
	});
}

//проверка - если все флажки у шаблонов в группе проставлены, то ставим флажок и рядом с выделением для всех, иначе - снимаем
clientSide.prototype.CheckFullCheckedBoxes = function(target)
{
	var selectAll = $(target.parent().parent().parent().parent().parent().parent().find(".selectall"));
	var targets = $(target.parent().parent().parent().children("tr"));
	
	var flagAllChecked = true;
	
	targets.each(function()
	{
		var curr = $(this).find("td input[type=checkbox]");
		if(curr.attr("checked")==undefined || curr.attr("checked")==false)
		{
			flagAllChecked = false;
			return false;
		}
	});
	
	if(flagAllChecked)
	{
		selectAll.attr("checked","checked");
	}
	else
	{
		selectAll.removeAttr("checked");
	}
}

// 
clientSide.prototype.ClearBoxesAfterAction = function()
{
	$("#contact-list input[type=checkbox]").each(function()
	{
	    $(this).removeAttr("checked");
	    $($(this).parent().parent().removeClass("ui-selecting"));
	});
}