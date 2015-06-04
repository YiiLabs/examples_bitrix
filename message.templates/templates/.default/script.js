function clientSide(params)
{
	this.urlForAjaxRequests = params.urlForAjaxRequests;
	this.session = params.session;
	
	//�����������
	this.movingHeader = $('.moveElements-header');
	this.movingHeaderText = $('.moveElements-header span');
	this.moveElementsBody = $('.moveElements-body');
	this.moveElementsBodyItem = $('.moveElements-body div');
	//���������� � ������ ��������
	this.addingHeader = $('.addElements-header');
	this.addingHeaderText = $('.addElements-header span');
	this.addElementsBody = $('.addElements-body');
	this.addElementsBodyItem = $('.addElements-body div');
	//���.��������
	this.actionHeader = $('.actionElements-header');
	this.actionHeaderText = $('.actionElements-header span');
	this.actionElementsBody = $('.actionElements-body');
	this.actionElementsBodyItem = $('.actionElements-body div');
	//excel
	this.excelHeader = $('.excelElements-header');
	this.excelHeaderText = $('.excelElements-header span');
	this.excelElementsBody = $('.excelElements-body');
	this.excelElementsBodyItem = $('.excelElements-body div');
	//�����
	this.searchInput = $('#templates-search');
	this.searchResult = $('#search-result');
	lastNamesFieldContent = "";
	
	this.ajaxLoading = $("#ajaxloading");
	this.ajaxDialog = $("#ajaxdialog");
	this.ajaxDialogText = $("#ajaxdialog p");
	this.textareaPhoneList = $("#numbers-list");
	this.groupList = $(".grouplist");
	this.templateList = $(".groupcontent");
	this.templateEditDialog = $("#template-edit");
	//��� ���� � ������! ����������, ����� �������� sms
	this.destination_number = $("textarea[name=numbers]");
	//���� ��� �������������� ��������
	this.editName = $("#edit-name");
	this.editDetail = $("#edit-detail-text");
	this.editGroup = $("#edit-groups");
	this.templateId = $("#templateId");
	//���� ��� �������������� ������
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
	
	this.everyNotSearch = $("*").not('tr.one-search-result #templates-search'); // �������� ���, ����� ������ ������
	
	this.alreadyWasOpened = false;
	
	this.Init();
}
//�������������� ��������
clientSide.prototype.Init = function()
{
	this.InitAjaxLoadingDialog();
	this.InitTemplates();
	this.InitControls();
	this.InitUpload();
	this.InitUploadTemplatesFromExcel();
	this.InitGroupsList();
	this.InitAddingTemplateButton();
	this.InitAddingGroupButton();
	this.InitSearch();
	this.InitEditTemplate();
	this.InitEditGroup();
	this.InitAjaxMessageDialog();
}

//������������� ����� �������� ���������
clientSide.prototype.InitTemplates = function ()
{
	_this = this;
		
	$("#group-1 .group-body").fadeIn(); 
	
	// ��������� ������� �� ����� ��������� ������ ������
	$("#templates p").live('click', function(event)
	{
		if($(this).children("a").hasClass('group-current')==false)
		{
			$(".group-number").hide();
			$(".grouplist a").removeClass('group-current');
			$(this).children("a:first").addClass('group-current');
			$("#templates p").css("cursor","pointer");
			$(this).css("cursor","default");
			$(this).children("span").css("cursor","pointer");
			$("#group-"+$(this).parent().attr("id")+' .group-body').show();
			$("#group-"+$(this).parent().attr("id")).fadeIn();
		}	
	});
	
	// ������ "��� ������"
	$(".get-more-groups").mouseover(function()
	{
		$(this).next(".more-groups").fadeIn();
		$(this).next(".more-groups").mouseleave(function()
		{
			$(this).fadeOut();
		});
	});
	
	// ������ ������� ��� ������� �� ������
	$(".group-item").live('click', function(event)
	{
		var group = $(this).attr("groupid");
		//console.log(group);
		var groupParagraph = $(".grouplist #" + group + " p");
		//console.log(groupParagraph);

		if(groupParagraph.children("a").hasClass('group-current')==false)
		{
			$(".more-groups").slideUp('slow');
			$(".group-number").hide();
			$(".grouplist a").removeClass('group-current');
			groupParagraph.children("a:first").addClass('group-current');
			$("#templates p").css("cursor","pointer");
			groupParagraph.css("cursor","default");
			groupParagraph.children("span").css("cursor","pointer");
			$("#group-"+groupParagraph.parent().attr("id")+' .group-body').show();
			$("#group-"+groupParagraph.parent().attr("id")).fadeIn();
			
		}	
	});
	
	// ��������������� ������ � ��������� �� ��� ������� �� ������
	$(".grouplist .ui-icon-mail-closed").mouseenter(function()
	{
	    $(this).addClass("small-buttons-hover");
	}).mouseleave(function()
	{
	    $(this).removeClass("small-buttons-hover");
	});
	
	_this.templatesRecount(true, undefined); // ������������� ��� ������� � �������
	
	// ������ ��������
	$(".use-template").live('click',function(){
		var tr = $(this).parent().parent();
		detail = tr.attr('templateDetail');
		var encodedText = _this.CorrectEncode(detail);
		document.location.href="/office/index.php?text="+encodedText;	
	});
	
	// ������ �������� ��� ������
	$(".add-all-group-templates").live('click',function(){
		var groupid = $(this).attr("groupid");
		var pieces = new Array();
		var text = "";
		
		$("#template-list #group-"+groupid+" table tbody tr").each(function()
			{
				pieces.push($(this).attr("templateDetail"));
			}
		);
		text = pieces.join(" ");
		var encodedText = _this.CorrectEncode(text);
		document.location.href="/office/index.php?text="+encodedText;	
	});
	
	
	_this.actionHeaderText.addClass('moveElements-header-text-enabled');
	_this.actionHeader.addClass('dashed');
	
	// �������� ��� ����, ����� ��� ����� �� ������ ������ �� �������� ���� � ������������ (����� �� ��������� ������)
	_this.searchInput.click(function(e)
	{
	    e.stopImmediatePropagation();
	});
	// ���� �������� �� ���, ����� ����� � ������������ ������, �� ������� ���� ����
	_this.everyNotSearch.each(function(index)
	{
		$(this).live('click', function(event){
			_this.searchResult.hide();
		});
	});
	
	// ���� � ������� �������
	$("#template-add textarea.new-template-text").resizable({
			maxWidth: 415,
			minWidth: 415,
			minHeight: 70,
	});
	$("#template-edit textarea.edit-template-text").resizable({
		maxWidth: 366,
		minWidth: 366,
		minHeight: 70,
	});
	
	
}
	
//�������� �� excel � csv ����� ��������
clientSide.prototype.InitUpload = function()
{
	_this = this;
	//����� �������� ���������� excel �����
	
}

//�������� �� excel � csv ����� ��������
clientSide.prototype.InitUploadTemplatesFromExcel = function()
{
	_this = this;
	//����� �������� ���������� excel �����
	new AjaxUpload('fromExcel',
	{
		action: '/office/excelupload/uploadTemplates.php',
		//file upload name
		name: 'userfile',
		title: '������ ����� - xls ��� csv. �� ������ �������� � 1� ������� - �������� �������, �� 2� - ����� �������, � 3� - ������. ��������������, ��� ������ ������ �������� ����������, ������� ����� ���������������.',
		responseType: 'json',
		onSubmit: function(file, ext)
		{
			if (!(ext && /^(xls|csv)$/i.test(ext)))
			{
                //������������ ���������� � �����
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
					_this.Request('AddTemplatesFromExcel', { 'templates[]': response}, function(data) { _this.AfterTemplateAddFromExcel(data); _this.ajaxLoading.dialog('close'); });
				}			
			}
			else
			{
				_this.ShowError(_this.mess['ERROR'], response.text);
			}
			
		}
	 });
}

//�����
clientSide.prototype.InitSearch = function()
{
	_this = this;
	_this.searchInput.keyup(function(event){
		newNamesFieldContent = $(this).val();
		if(newNamesFieldContent!=lastNamesFieldContent)
		{			
			lastNamesFieldContent = newNamesFieldContent;
			value = newNamesFieldContent.trim();
			
			if(value.length>0)
			{		
				_this.searchResult.html("");
				trs = $("div#template-list table tr.searchable:Contains('"+value+"')");
				count = trs.length;
				i=0;
				max=12;
				addedNames = {};
				trs.each(function(index){
					element = $(this); 
					if(typeof addedNames[element.attr("templateName")] === 'undefined')
					{
						_this.searchResult.append('<tr class="one-search-result" groupid="'+element.attr("groupid")+'"><td class="search-result-name">'+element.attr("templateName")+'</td><td class="search-result-detail">'+element.attr("templateName")+' '+element.attr("templateDetail")+'</td><td class="search-result-group" width="20%">'+($("#"+element.attr("groupid")+" a").text())+'</td><tr>');
						addedNames[element.attr("templateName")] = '1';
					}					
					i++;
					//���������� ����� ������ ���������� ��������					
					if (!--count || i==max)
					{
						$("tr.one-search-result").on("click", function(event){
							event.stopImmediatePropagation();							
							$("#"+$(this).attr('groupid')+" a:first").click();
							name = $(this).children("td.search-result-name").text();
							$("tr[templateName='"+name+"'] td:first").click();
							$('#search-result').hide();						
						});
						return false;
					}					
				});								
				_this.searchResult.show();
			}
		}
	}).focus(function(event) // ��������� ����������� ������, ���� ��� ���� ������ � ������ ������
	{
		_this.searchResult.show();
	});
}

//������������� ����������� ���������
clientSide.prototype.InitControls = function()
{
	var _this = this;
	$("#useto").button();
	$("#useto").button( "option", "disabled", true );
	$('.actionElements-body [action=del]').hide(); // �������� �������
	//������� �� �����������
	this.movingHeader.click(function(event){
		$(".action-menu").hide();
		event.stopImmediatePropagation();
		if (_this.movingHeaderText.hasClass('moveElements-header-text-enabled'))
		{
			_this.moveElementsBody.fadeIn();
		} 
	});
	this.addingHeader.click(function(event){
		$(".action-menu").hide();
		event.stopImmediatePropagation();
		if (_this.addingHeaderText.hasClass('addElements-header-text-enabled'))
		{
			_this.addElementsBody.fadeIn();
		} 
	});
	this.actionHeader.click(function(event){
		$(".action-menu").hide();
		event.stopImmediatePropagation();
		_this.actionElementsBody.fadeIn(); 
	});
	$("body").click(function(){
		$(".action-menu").hide();
	});
	this.moveElementsBody.click(function(event) {
		event.stopImmediatePropagation();
		target = $(event.target);
		toGroup = target.attr('groupid');
		if (toGroup != 'undefined')
		{
			_this.OpenMoveConfirmDialog("��������!", _this.mess['GROUP']+ ' �' + target.text() + '�' + "?");
		}
	});	
	
	this.addElementsBody.click(function(event) {
		event.stopImmediatePropagation();
		target = $(event.target);
		toGroup = target.attr('groupid');
		if (toGroup != 'undefined')
		{
			_this.OpenAddConfirmDialog("��������!", _this.mess['ADD_GROUP']+ ' �' + target.text() + '�' + "?");
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
				_this.OpenDelConfirmDialog("��������!", _this.mess['TEMPLATES_DELETE']);
			}
		}
	});
	// ��������� �� ��������� �������
	$("#useto").click(function(){
		var pieces = new Array();
		var text = "";
		
		_this.templateList.find('tr:has(input:checked)').each(function() {
			pieces.push($(this).attr("templateDetail"));
		});	
		
		text = pieces.join(" ");
		var encodedText = _this.CorrectEncode(text);
		document.location.href="/office/index.php?text="+encodedText;
	});
	
	this.excelHeader.add(this.excelHeaderText).click(function(event) {
			event.stopImmediatePropagation();
			var target = $(event.target);
			_this.excelElementsBody.css('display', _this.excelElementsBody.css('display') == 'block' ? 'none' : 'block');
			_this.actionElementsBody.css('display', 'none');
			_this.moveElementsBody.css('display', 'none');
			_this.addElementsBody.css('display', 'none');
	});
	//�������� � excel
	$('#toExcel').click(function(event){
		//alert(_this.urlForAjaxRequests+'/loadToExcel.php');
		event.stopImmediatePropagation();	
		$('<iframe class="loadExcel" name="excel" src="'+_this.urlForAjaxRequests+'?ToExcel=1"></iframe>').appendTo('body'); 
	});
	
	this.hoverForControls();
}

//������� ������� ������������� ����������� ���������
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
				'��': function() {
					_this.moveElementsBody.css('display', 'none');
					var templatesArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.templateList.find('tr:has(input:checked)').each(
						function() {
							templatesArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.detail-text").attr("title").split(" ")[1]);
						}
					);
					
					_this.Request('ChangeGroupForSelectedTemplates', {'toGroup': toGroup, 'templatesId[]': templatesArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.templatesId = templatesArray, data.groupsId = groupsArray, _this.AfterGroupChangeSelectedTemplates(data);});
					
					$( this ).dialog( "close" );
				},
				'���': function() {
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
					var templatesArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.templateList.find('tr:has(input:checked)').each(
						function() {
							templatesArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.detail-text").attr("title").split(" ")[1]);
						}
					);
					
					_this.Request('ChangeGroupForSelectedTemplates', {'toGroup': toGroup, 'templatesId[]': templatesArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.templatesId = templatesArray, data.groupsId = groupsArray, _this.AfterGroupChangeSelectedTemplates(data);});
					
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

//������� ������� ������������� ���������� ���������
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
				'��': function() {
					
					_this.addElementsBody.css('display', 'none');
					var templatesArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.templateList.find('tr:has(input:checked)').each(
						function() {
							templatesArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.detail-text").attr("title").split(" ")[1]);
						}
					);
					
					_this.Request('AddGroupForSelectedTemplates', {'toGroup': toGroup, 'templatesId[]': templatesArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.templatesId = templatesArray, data.groupsId = groupsArray, _this.AfterAddGroupForSelectedTemplates(data);});
					
					$( this ).dialog( "close" );
				},
				'���': function() {
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
					var templatesArray = new Array();
					var groupsArray = new Array();
					var recentlyArray = new Array();
					_this.templateList.find('tr:has(input:checked)').each(
						function() {
							templatesArray.push($(this).attr('id'));
							groupsArray.push($(this).attr('groupid'));
							recentlyArray.push($(this).children("td.detail-text").attr("title").split(" ")[1]);
						}
					);
					
					_this.Request('AddGroupForSelectedTemplates', {'toGroup': toGroup, 'templatesId[]': templatesArray, 'groupsId[]': groupsArray, 'recently_used[]' : recentlyArray}, 
							function(data) {data.newGroup = toGroup, data.templatesId = templatesArray, data.groupsId = groupsArray, _this.AfterAddGroupForSelectedTemplates(data);});
					
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


//������� ������� ������������� �������� ���������
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
				'��': function() {
					
					_this.actionElementsBody.css('display', 'none');
					var templatesForDeleteArray = new Array();
					var groupsForDeleteArray = new Array();
					_this.templateList.find('tr:has(input:checked)').each(
						function() {
							templatesForDeleteArray.push($(this).attr('id'));
							groupsForDeleteArray.push($(this).attr('groupid'));
						});
					
					_this.Request('DeleteSelectedTemplates', {'templatesId[]': templatesForDeleteArray, 'groupsId[]': groupsForDeleteArray}, 
							function(data) {data.templatesId = templatesForDeleteArray, data.groupsId = groupsForDeleteArray, _this.AfterDeleteSelectedTemplates(data); });		
					
					$( this ).dialog( "close" );
				},
				'���': function() {
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
					
					_this.actionElementsBody.css('display', 'none');
					var templatesForDeleteArray = new Array();
					var groupsForDeleteArray = new Array();
					_this.templateList.find('tr:has(input:checked)').each(
						function() {
							templatesForDeleteArray.push($(this).attr('id'));
							groupsForDeleteArray.push($(this).attr('groupid'));
						});
					
					_this.Request('DeleteSelectedTemplates', {'templatesId[]': templatesForDeleteArray, 'groupsId[]': groupsForDeleteArray}, 
							function(data) {data.templatesId = templatesForDeleteArray, data.groupsId = groupsForDeleteArray, _this.AfterDeleteSelectedTemplates(data); });		
					
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

//������� ������� ������������� �������� ������
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
				'��': function() {
					// ���� ������� ������ "�� � ������", � ��� ��� ������ ���
					if(groupToDeleteId == 0)
					{
						if($("#template-list #group-0 table tr td").hasClass("dataTables_empty"))
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
				'���': function() {
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
					// ���� ������� ������ "�� � ������", � ��� ��� ������ ���
					if(groupToDeleteId == 0)
					{
						if($("#template-list #group-0 table tr td").hasClass("dataTables_empty"))
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

//������� ������� ������������� �������� ������
clientSide.prototype.OpenDelTemplConfirmDialog = function (title, text, target)
{
	_this = this; 
	if (_this.lang == 'ru')
	{
		$("#dialog-confirm").dialog({
			resizable: false,
			height:170,
			modal: true,
			buttons: {
				'��': function() {
					
					_this.Request("TemplateDelete", {templateId: target.closest('tr').attr('id'), groupId: target.closest('tr').attr('groupid')}, function(data) { _this.AfterTemplateDelete(data)});
					
					$( this ).dialog( "close" );
				},
				'���': function() {
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
					
					_this.Request("TemplateDelete", {templateId: target.closest('tr').attr('id'), groupId: target.closest('tr').attr('groupid')}, function(data) { _this.AfterTemplateDelete(data)});
					
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


//����� ��������� ������ � ��������� ���������
clientSide.prototype.AfterGroupChangeSelectedTemplates = function(data)
{
	_this = this;
	if (data.state == 'good')
	{
		// ���� ���������� ������. ��� ������ ������ � ����� ���������:
		// ������� ���� �� � ������, ���� ��������� ����� �� ��������. ���� ����, �� ������ ������� ������.
		// ����� ���������� �������, ������� ������� � ��������� � ����� ������.
		
		var templateGroupid = data.newGroup; // ����� ������ ��� ���� ���������
		
		var newGroupName = $(".grouplist #"+templateGroupid).children().children("a:first").text();
	    var len = $("#template-list #group-"+templateGroupid+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
		lenlen = lenlen.length;
		newGroupName = newGroupName.substr(0,newGroupName.length-lenlen-3);
		
		var templatesSelected = $("#template-list tr.ui-selecting");
		//console.log(templatesSelected);
		
		var newGroupIds = new Array();
		$("#template-list #group-"+data.newGroup+" table tr").each(function()
		{
			newGroupIds.push($(this).attr("id"));	
		});
		
		
		// ���� ���������� � "�� � ������", �� ����� ���������� �� ������ �����
		if(templateGroupid == 0)
		{
			templatesSelected.each(function(id)
			{
	            // ���� ������� ��� � "�� � ������", �� ��������� � ���������� 
	            if($(this).attr("groupid") == templateGroupid)
	                return true;
	            
				var templateId = $(this).attr("id"); // �������� �������� 
				var templateName = $(this).attr("templateName");
				var templateDetail = $(this).attr("templateDetail");
				var templateRecently = $(this).children("td.detail-text").attr("title").split(" ")[1]; // ����� �������������
				
				// �������...
				$("#template-list tr[id="+templateId+"]").not($("#template-list #group-1 tr[id="+templateId+"]")).each(function()
				{
					var cont = $(this);

					var row = cont.get(0); // �������� ������ �������� �� ����

					var oTable = cont.closest("table").dataTable();

					var index = oTable.fnGetPosition(row); 	// �������� ������� ������
					oTable.fnDeleteRow(index);	// �������
				});
				//console.log("ID = " + this);
				
				if(in_array(templateId,newGroupIds))
					return true;
				else
					newGroupIds.push(templateId); // �������� ������� � ������ ���������� ���������
				
				_this.turnOnTables(0);
				
				
				// ������� �� ������� � �����������
		        $("#template-list #group-"+templateGroupid+" table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								templateName,
								templateDetail,
								"<div class='group-list'></div>",
								"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
								"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
								"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
				);
				var added = $("#template-list #group-"+templateGroupid+" table tbody").find("td:contains('" + templateName + "')").parent().attr("id",templateId).attr("groupId",templateGroupid).attr("templateName",templateName).attr("templateDetail",templateDetail).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("name");
				added.find("td:eq(2)").addClass("detail-text").attr("title","������������� " + templateRecently + " ���");
				added.find("td:eq(3)").addClass("template-groups");

	      		_this.giveTableCorrectWidth(0);
			});
		}
		else
		{			
			templatesSelected.each(function(id)
			{
	            // ���� ������� ��� � ����� ������, �� ��������� � ���������� 
	            if($(this).attr("groupid") == data.newGroup)
	                return true;
	            
				var templateId = $(this).attr("id"); // �������� ��������
	            // ���� �������������� ������ �������� ��������� ����� ������, �� ������ ������� ��� �� ������
				if(in_array(templateId,newGroupIds))
				{
					var cont = $("#template-list tr[id="+templateId+"][groupid="+$(this).attr("groupid")+"]").not($("#template-list #group-1 tr[id="+templateId+"]"));

					var row = cont.get(0); // �������� ������ �������� �� ����

					var oTable = cont.closest("table").dataTable();

					var index = oTable.fnGetPosition(row); 	// �������� ������� ������
					oTable.fnDeleteRow(index);	// �������
				} // ����� ���������� ������ ��������, ������� ��� �� ������ ������ � ��������� � �����
				else
				{
					newGroupIds.push(templateId); // �������� ������� � ������ ���������� ���������
					
					var templateId = $(this).attr("id"); // �������� �������� 
					var templateName = $(this).attr("templateName");
					var templateDetail = $(this).attr("templateDetail");
					var templateRecently = $(this).children("td.detail-text").attr("title").split(" ")[1]; // ����� �������������
					
					var cont = $("#template-list tr[id="+templateId+"][groupid="+$(this).attr("groupid")+"]").not($("#template-list #group-1 tr[id="+templateId+"]"));

					var row = cont.get(0); // �������� ������ �������� �� ����

					var oTable = cont.closest("table").dataTable();

					var index = oTable.fnGetPosition(row); 	// �������� ������� ������
					oTable.fnDeleteRow(index);	// �������
					
					_this.turnOnTables(templateGroupid);
					
					// ����� ������ ��� ������ ��� ��������� � ������� � ��������
					var groupsColumnBody = "";
					var i = 0;
					$(".groupcontent table tbody tr[id=" + templateId + "]").not($("#template-list #group-1 tr[id="+templateId+"]")).each(function(index)
					{
						if(i == 3)
							return false;

					    var groupId = $(this).attr("groupid");
					    var groupName = $(".grouplist #"+groupId).children().children("a:first").text();
					    var len = $("#template-list #group-"+groupId+" table tbody tr.searchable").length;
					    var lenlen = "" + len;
						lenlen = lenlen.length;
						groupName = groupName.substr(0,groupName.length-lenlen-3);
						groupsColumnBody += "<div title=\"������� � ������ '" + groupName + "'\" groupId='" + groupId + "' class='group-item'><a>" + groupName + "</a></div>";
						i++;
					}
					);
					
					if(i < 3)
						groupsColumnBody += "<div title=\"������� � ������ '" + newGroupName + "'\" groupId='" + templateGroupid + "' class='group-item'><a>" + newGroupName + "</a></div>";
				    
					// ������� �� ������� � �����������
			        $("#template-list #group-"+templateGroupid+" table").dataTable().fnAddData( [
									"<input type='checkbox' />",
									templateName,
									templateDetail,
									"<div class='group-list'>" + groupsColumnBody + "</div>",
									"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
									"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
									"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
					);
					var added = $("#template-list #group-"+templateGroupid+" table tbody").find("td:contains('" + templateName + "')").parent().attr("id",templateId).attr("groupId",templateGroupid).attr("templateName",templateName).attr("templateDetail",templateDetail).addClass("searchable");
					added.find("td:eq(0)").addClass("chkbox");
					added.find("td:eq(1)").addClass("name");
					added.find("td:eq(2)").addClass("detail-text").attr("title","������������� " + templateRecently + " ���");
					added.find("td:eq(3)").addClass("template-groups");
	      			
	      			_this.giveTableCorrectWidth(templateGroupid);
				}
			});
		}
		
		// ������� ��������, ���� ������ �� ��������
		if(_this.templateList.find('tr:has(input:checked)').length < 1)
		{
			$("#useto").button( "option", "disabled", true );
			//�����������
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			// ����������
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');	
			
			// ��������
			$('.actionElements-body [action=del]').hide();
		}
		
		$("#"+templateGroupid+" p a").first().click();
		
		_this.checkTableEmptiness();
		_this.templatesRecount(false, undefined);
		_this.ClearBoxesAfterAction();
		_this.CheckIfCanAddMoveRemove();
		
		_this.ShowNote(_this.mess['SUCCESS'],  _this.mess['TEMPLATES_MOVED']);
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['TEMPLATES_ADD_ERR']);
	}
}
//����� ���������� ������ � ��������� ���������
clientSide.prototype.AfterAddGroupForSelectedTemplates = function(data)
{
	_this = this;
	if (data.state == 'good')
	{
		// ���� ���������� ������. ��� ������ ������ � ����� ���������:
		// ������� ���� �� � ������, ���� ��������� ����� �� ��������. ���� ����, �� ������ ���������� ������.
		// ����� ���������� �������, ������� ������� � ��������� � ����� ������.
		
		var templateGroupid = data.newGroup; // ����� ������ ��� ���� ���������
		
		var newGroupName = $(".grouplist #"+templateGroupid).children().children("a:first").text();
	    var len = $("#template-list #group-"+templateGroupid+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
		lenlen = lenlen.length;
		newGroupName = newGroupName.substr(0,newGroupName.length-lenlen-3);
		
		var templatesSelected = $("#template-list tr.ui-selecting");
		//console.log(templatesSelected);
		
		var newGroupIds = new Array();
		$("#template-list #group-"+data.newGroup+" table tr").each(function()
		{
			newGroupIds.push($(this).attr("id"));	
		});
					
		templatesSelected.each(function(id)
		{
            // ���� ������� ��� � ����� ������, �� ��������� � ���������� 
            if($(this).attr("groupid") == data.newGroup)
                return true;
            
			var templateId = $(this).attr("id"); // �������� ��������
            // ���� �������������� ������ �������� ��������� ����� ������, �� ������ ����������
			if(in_array(templateId,newGroupIds))
				return true;
			else// ����� ���������� ������ ��������, ������� ��� �� ������ ������ � ��������� � �����
			{
				newGroupIds.push(templateId); // �������� ������� � ������ ���������� ���������
				
				var templateId = $(this).attr("id"); // �������� �������� 
				var templateName = $(this).attr("templateName");
				var templateDetail = $(this).attr("templateDetail");
				var templateRecently = $(this).children("td.detail-text").attr("title").split(" ")[1]; // ����� �������������
				
				_this.turnOnTables(templateGroupid);
				
				// ����� ������ ��� ������ ��� ��������� � ������� � ��������
				var groupsColumnBody = "";
				var i = 0;
				$(".groupcontent table tbody tr[id=" + templateId + "]").not($("#template-list #group-1 tr[id="+templateId+"]")).each(function(index)
				{
					if(i == 3)
						return false;

				    var groupId = $(this).attr("groupid");
				    var groupName = $(".grouplist #"+groupId).children().children("a:first").text();
				    var len = $("#template-list #group-"+groupId+" table tbody tr.searchable").length;
				    var lenlen = "" + len;
					lenlen = lenlen.length;
					groupName = groupName.substr(0,groupName.length-lenlen-3);
					groupsColumnBody += "<div title=\"������� � ������ '" + groupName + "'\" groupId='" + groupId + "' class='group-item'><a>" + groupName + "</a></div>";
					i++;
				}
				);
				
				if(i < 3)
					groupsColumnBody += "<div title=\"������� � ������ '" + newGroupName + "'\" groupId='" + templateGroupid + "' class='group-item'><a>" + newGroupName + "</a></div>";
			    
				
				// ������� �� ������� � �����������
		        $("#template-list #group-"+templateGroupid+" table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								templateName,
								templateDetail,
								"<div class='group-list'>" + groupsColumnBody + "</div>",
								"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
								"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
								"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
				);
				var added = $("#template-list #group-"+templateGroupid+" table tbody").find("td:contains('" + templateName + "')").parent().attr("id",templateId).attr("groupId",templateGroupid).attr("templateName",templateName).attr("templateDetail",templateDetail).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("name");
				added.find("td:eq(2)").addClass("detail-text").attr("title","������������� " + templateRecently + " ���");
				added.find("td:eq(3)").addClass("template-groups");
      			
      			_this.giveTableCorrectWidth(templateGroupid);
			}
			//console.log(this);
		});
		
		// ������� ��������, ���� ������ �� ��������
		if(_this.templateList.find('tr:has(input:checked)').length < 1)
		{
			$("#useto").button( "option", "disabled", true );
			//�����������
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			// ����������
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');	
			
			// ��������
			$('.actionElements-body [action=del]').hide();
		}
		
		$("#"+templateGroupid+" p a").first().click();
		
		_this.checkTableEmptiness();
		_this.templatesRecount(false, undefined);
		_this.ClearBoxesAfterAction();
		_this.CheckIfCanAddMoveRemove();
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['TEMPLATES_GROUP_ADDED'] + " �" + newGroupName + "�");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['TEMPLATES_ADD_ERR']);
	}
}
//����� �������� ���������
clientSide.prototype.AfterDeleteSelectedTemplates = function(data)
{
	_this = this;
	if (data.state == 'good')
	{
		var counter = 0;
		data.templatesId.forEach(function(id)
		{
			var cont = $("#template-list tr[id="+id+"][groupid="+data.groupsId[counter]+"]");

			var row = cont.get(0); // �������� ������ �������� �� ����

			var oTable = cont.closest("table").dataTable();

			var index = oTable.fnGetPosition(row); 	// �������� ������� ������
			oTable.fnDeleteRow(index);	// �������
			
			// ���� ������� � ����� ������������ - ���� �������
			if($("#template-list #group-1 tr[id="+id+"]").length > 0 && $("#template-list tr[id="+id+"]").not($("#template-list #group-1 tr[id="+id+"]")).length < 1)
			{
				var cont = $("#template-list #group-1 tr[id="+id+"]");

				var row = cont.get(0); // �������� ������ �������� �� ����

				var oTable = cont.closest("table").dataTable();

				var index = oTable.fnGetPosition(row); 	// �������� ������� ������
				oTable.fnDeleteRow(index);	// �������
			}
			
			$("#template-list tr[id="+id+"] .group-item[groupId="+data.groupsId[counter]+"]").remove(); // ������� ������ � ������� �������������� �����
			
			counter++;
		});
		
		// ������� ��������, ���� ������ �� ��������
		if(_this.templateList.find('tr:has(input:checked)').length < 1)
		{
			$("#useto").button( "option", "disabled", true );
			//�����������
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			// ����������
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');
			
			// ��������
			$('.actionElements-body [action=del]').hide();
		}
		
		_this.checkTableEmptiness();
		_this.templatesRecount(false, undefined);
		_this.ClearBoxesAfterAction();
		_this.CheckIfCanAddMoveRemove();
			
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['TEMPLATES_DELETED']);
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['DELETE_ERR']);
	}
}
//������������� ������ ������
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
	$("#template-list").click(function(event) {
		
//		event.stopImmediatePropagation();
		
		var target = $(event.target);


		//�������������� ������
		if (target.hasClass("edit-group"))
		{
			event.stopImmediatePropagation();	
			groupEdit = $("#group-edit");
			//groupName = target.parent().find('a:eq(0)').text(); // ����� ������ �� ������ ������
			
			groupId = target.parent().parent().attr('id');
			var len = $("#template-list #group-"+groupId+" table tbody tr.searchable").length;
		    var lenlen = "" + len;
		    lenlen = lenlen.length;
		    var groupName = target.parent().find('a:eq(0)').text();
		    groupName = groupName.substr(0,groupName.length-lenlen-3);
		    
			_this.editGroupId.val(groupId);
			_this.editGroupName.val(groupName);
			groupEdit.dialog('option', 'title', _this.mess['GROUP_EDIT']+groupName);
			groupEdit.dialog('open');		
		}
		//��������� �������� ������
		if (target.hasClass("delete-group"))
		{
			event.stopImmediatePropagation();	
			//������� id ��������� ������
			groupToDeleteId = target.closest('div').attr('id');
			var question = '';
			if (groupToDeleteId == 0)
			{
				question = _this.mess['GROUP_DELETE_NOTGROUP'];
			}
			else
			{
				question = _this.mess['GROUP_DELETE'];
			}
			
			_this.OpenDelGroupConfirmDialog("��������!", question, groupToDeleteId);
		}
		if (target.is("div.edit-template")) 
		{
			TemplateEdit = $("#template-edit");
			
			tr = target.closest('tr');
			TemplateEdit.dialog('option', 'title', _this.mess['TEMPLATE_EDIT']+tr.attr('templateName'));
			_this.editName.val(tr.attr('templateName'));
			_this.editDetail.val(tr.attr('templateDetail'));
			_this.editGroup.val(tr.attr('groupid'));
			
			// ���� �������������� ������
			additionalGroups = new Array();
			$(".groupcontent tr[id="+tr.attr('id')+"]").not($("#template-list #group-1 tr[id="+tr.attr('id')+"]")).each(function()
			{
				if($(this).attr("groupid") != tr.attr('groupid'))
					additionalGroups.push($(this).attr("groupid"));
			});
			
			var i;
			//console.log(additionalGroups);
			for( i = 0; i<additionalGroups.length; i++)
			{
				var currAddGroupId = additionalGroups[i];
				//console.log(currAddGroupId);
				$("table#edit-groups-table td.groupsSelectEdit").append($("#template-edit select:first").clone());
				var currSelect = $("table#edit-groups-table td.groupsSelectEdit select:last"); // ���� ������� ������
				currSelect.children("option[value=0]").remove(); // ���� ���� �������������� ������, �� ������� ��� �� ����� ���� �� � ������
				currSelect.attr("name","groupAddEdit"+i); // ��� �������� ��������, �������� ��� �������
				currSelect.addClass("additionalGroupEdit");
				
				$("table#edit-groups-table td.groupsSelectEdit select:last").val(currAddGroupId);
				
				$("table#edit-groups-table td.groupsButtonEdit:last").append("<input type='button' name='groupAddEdit" + i + "' id='removeGroup' value='������ ��������'>"); // ������ ��� ��������
				$("table#edit-groups-table td.groupsButtonEdit input:last").button().click(function() // �� ����� ����� ������� ��� ������
				{
					// ������� ��� ���� ������, ��� � ����� ������
					$("table#edit-groups-table td.groupsSelectEdit select[name=" + $(this).attr("name") + "]").remove(); 
					$(this).remove();
					
					$("#template-edit select:first").change(); // � ����� ��� ������ ����� "�� � ������"

				});
			} 
			
			// ������ ���������� �������������� �����
			$("#template-edit #moreGroup").button().click(function()
			{
				$("table#edit-groups-table td.groupsSelectEdit").append($("#template-edit select:first").clone());
				var currSelect = $("table#edit-groups-table td.groupsSelectEdit select:last"); // ���� ������� ������
				currSelect.children("option[value=0]").remove(); // ���� ���� �������������� ������, �� ������� ��� �� ����� ���� �� � ������
				currSelect.attr("name","groupAddEdit"+i); // ��� �������� ��������, �������� ��� �������
				currSelect.addClass("additionalGroupEdit");
				
				//$("table#edit-groups-table td.groupsSelectEdit select:last").val(currAddGroupId);
				
				$("table#edit-groups-table td.groupsButtonEdit:last").append("<input type='button' name='groupAddEdit" + i++ + "' id='removeGroup' value='������ ��������'>"); // ������ ��� ��������
				$("table#edit-groups-table td.groupsButtonEdit input:last").button().click(function() // �� ����� ����� ������� ��� ������
				{
					// ������� ��� ���� ������, ��� � ����� ������
					$("table#edit-groups-table td.groupsSelectEdit select[name=" + $(this).attr("name") + "]").remove(); 
					$(this).remove();
					
					$("#template-edit select:first").change(); // � ����� ��� ������ ����� "�� � ������"

				});
				
			});
			
			$("#template-edit select:first").change(function()
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
					$("#template-edit #moreGroup").attr("disabled","disabled").css("cursor","default").css("opacity","0.5");
					
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
					$("#template-edit #moreGroup").removeAttr("disabled").css("cursor","pointer").css("opacity","1.0");;
				}
			});
			//console.log(additionalGroups);
			$("#template-edit select:first").change();
			
			_this.templateId.val(tr.attr('id'));
			TemplateEdit.dialog('open');		
		}
		else if (target.is("div.delete-template"))
		{
			// ���� ������� ������� � ���������� �������, �� ������ ��������������� ���������
			if($(".groupcontent tr[id="+target.closest('tr').attr('id')+"]").length > 1)
				_this.mess['ARE_YOU_SURE'] = _this.mess['ARE_YOU_SURE_MULTIPLE'];
			
			_this.OpenDelTemplConfirmDialog("��������!", _this.mess['ARE_YOU_SURE'], target);
		}
		else if (target.is("td input[type=checkbox]"))
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
	
	_this.AddHoverEffectForTemplateList();
}
clientSide.prototype.LoadtemplatesToGroup = function(data, groupIdent) {
	if (data != '')
	{
		$groupElement = $('#template-list div#'+groupIdent+' table tbody');
		$groupElement.html('');
		$(data).each(function() {
			$groupElement.append(
			'<tr id="'+this.id+'" groupId="'+groupIdent+'" templateLastName="'+this.lastname+'" templateName="'+this.name+'" templatePhone="'+this.phone+'">' +
												'<td><input type="checkbox" /></td>'+
												'<td class="lastname">'+this.lastname+'</td>'+
												'<td class="name" '+(this.name==''?'style="width:0px"':"")+'>'+this.name+'</td>'+
												'<td class="phone" '+(this.name==''?'"style="width:180px"':"")+'>'+this.phone+'</td>'+
												'<td><div class="edit-template ui-icon-wrench"></div></td>'+
												'<td><div class="delete-template ui-icon-close"></div></td>'+
												'<td><div class="add-to-phone-list ui-icon-arrowstop-1-e"></div></td></tr>');
		})
	}		
}
//��������� ����� ������� ��� ����� �����
/*clientSide.prototype.AddHoverEffectForGroupList = function()
{
	$(this.groupList).find('li')
	.hover(
		function () { $(this).addClass("group-hover")},       
		function () { $(this).removeClass("group-hover")}
	);	
}*/
//����� ������ ��� �������� �����������
clientSide.prototype.hoverForControls = function(){
}
//��������� ����� ������ ��� ������� �����
clientSide.prototype.AddHoverEffectForTemplateList = function()
{
	$("#templates table tbody").find('tr')
	.hover(
		function () { $(this).addClass("ui-selected")},       
		function () { $(this).removeClass("ui-selected")}
	);
	
	this.AddHoverEffectForGroupIcons();
	this.AddHoverEffectForTemplateIcons();	
}
//��������� hover effect ��� �������� ������
clientSide.prototype.AddHoverEffectForGroupIcons = function(mainObject)
{
	var _this = this;
	$("#template-list p.group-header > span").hover(
		function () { $(this).addClass('small-buttons-hover')},       
		function () { $(this).removeClass('small-buttons-hover')}	
	);
	$(".groupcontent td > .edit-template, .groupcontent td > .delete-template, .groupcontent td > .use-template").hover(
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
//��������� hover effect ��� �������� ��������
clientSide.prototype.AddHoverEffectForTemplateIcons = function() 
{
	var _this = this;
	$("#template-list div.group-body td.edit-template, td.delete-template, td.add-to-phone-list").hover(
		function () { $(this).addClass('hover')},       
		function () { $(this).removeClass('hover')}	
	);	
}
//������� ���������� ���������� ������ �������, ��� ������ ��������
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
//������� ������� �����-������ ������� �������
clientSide.prototype.deletePhoneNumber =  function(phoneNumberForDelete)
{
	var numbersList = this.textareaPhoneList.val();
	
	this.textareaPhoneList.val(numbersList.replace(phoneNumberForDelete+'\r\n', ""));
}
//������� ��� ������ ������
function updateTips(container, updatedText) 
{
	container.text(updatedText).css("color", "red");
}
//������� �������� ����� ����
function checkLength(o, n, min, max, container) 
{
		if ( o.val().length > max || o.val().length < min ) 
		{
			//o.addClass('ui-state-error');
			updateTips(container, _this.mess['FIELD_LENGTH'] + "�" + n + "�" + _this.mess['MUST_BE']+min+_this.mess['AND']+max);
			return false;
		} 
		else 
		{
			return true;
		}
}

//������� ������ � �������
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
//���������� ���������� ����� �������
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
//���������� ���������� ����� ������� ������ �������
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


//�������������� ������� escape() ��� ���������� ��������� ��������
clientSide.prototype.CorrectEncode = function (str)
{
	// �������������� ������� ��������
	var trans = [];
	for (var i = 0x410; i <= 0x44F; i++)
		trans[i] = i - 0x350; // �-��-�
	trans[0x401] = 0xA8;    // �
	trans[0x451] = 0xB8;    // �
	
	var ret = [];
	// ���������� ������ ����� ��������, ������� ��������� ���������
	for (var i = 0; i < str.length; i++)
	{
		var n = str.charCodeAt(i);
		if (typeof trans[n] != 'undefined')
			n = trans[n];
		if (n <= 0xFF)
			ret.push(n);
		}
	
	return escape(String.fromCharCode.apply(null, ret));
}




	//������������� ������ ���������� ������ ��������
	clientSide.prototype.InitAddingTemplateButton = function ()
	{
		_this = this;
		if (_this.lang == 'ru')
		{				
			var name = $("#name"), detail = $("#detail-text"), group = $("#groups"), allFields = $([]).add(name), tips = $("#templateTip");
			
			$("#template-add").dialog({
					bgiframe: true,
					resizable: false,
					autoOpen: false,
					width: 450,
					modal: false,
					buttons: {
						'��������� ������': function() {
							var bValid = true;
							//allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(name, _this.mess['HEAD_NAME'], 2, 30, tips);
							bValid = bValid && checkLength(detail, _this.mess['HEAD_DETAIL'], 0, 250, tips);
							
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
								_this.Request("AddNewTemplate", 
												{'name': $.trim(name.val()), 'detail': $.trim(detail.val()), 'group': group.val(), 'addGroups': stringAddGroups},
												function(data) 
												{
													data.name = name.val();
													data.detail = detail.val();
													data.group = group.val();
													data.addGroups = stringAddGroups;
													_this.AfterTemplateAdd(data);
													$("#template-add").dialog('close'); 
												}										
												);
							} 
						},
						'������� ������': function() {
							$("#group").dialog('open');	
						},
						'�������': function() {
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
				var name = $("#name"), detail = $("#detail-text"), group = $("#groups"), allFields = $([]).add(name), tips = $("#templateTip");
				
				$("#template-add").dialog({
						bgiframe: true,
						resizable: false,
						autoOpen: false,
						width: 450,
						modal: false,
						buttons: {
							'Create template': function() {
								var bValid = true;
								//allFields.removeClass('ui-state-error');

								bValid = bValid && checkLength(name, _this.mess['HEAD_NAME'], 2, 30, tips);
								bValid = bValid && checkLength(detail, _this.mess['HEAD_DETAIL'], 0, 250, tips);
								
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
									_this.Request("AddNewTemplate", 
													{'name': $.trim(name.val()), 'detail': $.trim(detail.val()), 'group': group.val(), 'addGroups': stringAddGroups},
													function(data) 
													{
														data.name = name.val();
														data.detail = detail.val();
														data.group = group.val();
														data.addGroups = stringAddGroups;
														_this.AfterTemplateAdd(data);
														$("#template-add").dialog('close'); 
													}										
													);
								} 
							},
							'Create a group': function() {
								$("#group").dialog('open');	
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

		
		$('#create-template').click(function() {
				var currId = $('.grouplist').find("a.group-current:first").parent().parent("div").attr("id");
				$("#template-add select:first").val(currId);
				$("#template-add select:first").change();
				$('#template-add').dialog('open');
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
		
		// ������ � ����������� ��������
		var i = 1;
		$("#template-add select:first").change(function()
		{
			if($(this).attr("value") == 0)
			{
				$("table#add-groups-table td.groupsSelect select").not($("#template-add select:first")).each(function()
				{
					$(this).attr("disabled","disabled");
                    $(this).css("opacity","0.5");
				});
				$("table#add-groups-table td.groupsButton input").each(function()
				{
					$(this).attr("disabled","disabled").css("cursor","default");
                    $(this).css("opacity","0.5");
				});
				$("#template-add #moreGroup").attr("disabled","disabled").css("cursor","default");
                $("#template-add #moreGroup").css("opacity","0.5");
			} else
			{
				$("table#add-groups-table td.groupsSelect select").not($("#template-add select:first")).each(function()
				{
					$(this).removeAttr("disabled");
                    $(this).css("opacity","1.0");
				});
				$("table#add-groups-table td.groupsButton input").each(function()
				{
					$(this).removeAttr("disabled").css("cursor","pointer");
                    $(this).css("opacity","1.0");
				});
				$("#template-add #moreGroup").removeAttr("disabled").css("cursor","pointer");
                $("#template-add #moreGroup").css("opacity","1.0");
			}
		});
		// ������ ���������� �������������� �����
		$("#template-add #moreGroup").button().click(function()
		{
			if($("table#add-groups-table .groupsSelect select:last").length < 1)
				$("table#add-groups-table td.groupsSelect").append($("#template-add select:first").clone());
			else
				$("table#add-groups-table td.groupsSelect").append($("table#add-groups-table .groupsSelect select:last").clone()); // ��������� ��� ��������
			var currSelect = $("table#add-groups-table .groupsSelect select:last"); // ���� ������� ������
			currSelect.children("option[value=0]").remove(); // ���� ���� �������������� ������, �� ������� ��� �� ����� ���� �� � ������
			currSelect.attr("name","groupAdd"+i); // ��� �������� ��������, �������� ��� �������
			currSelect.addClass("additionalGroup");
			
			//$(".groupsSelect select:last").attr("id","groupAdd"+i++);
			$("table#add-groups-table td.groupsButton").append("<input type='button' name='groupAdd" + i++ + "' id='removeGroup' value='������ ��������'>"); // ������ ��� ��������
			$("table#add-groups-table td.groupsButton input:last").button().click(function() // �� ����� ����� ������� ��� ������
			{
				// ������� ��� ���� ������, ��� � ����� ������
				$("table#add-groups-table td.groupsSelect select[name=" + $(this).attr("name") + "]").remove(); 
				$(this).remove();
				$("#template-add select:first").change(); // � ����� ��� ������ ����� "�� � ������"
			});
			
			$("#template-add select:first").change(); // � ����� ��� ������ ����� "�� � ������"
		});
		
		$("#template-add select:first").change();
		
	}
	
	//������������� ���� �������������� ��������
	clientSide.prototype.InitEditTemplate = function()
	{
		var _this = this;
		if (_this.lang == 'ru')
		{
			var allFields = $([]).add(_this.editName, _this.editName), tips = $("#templateEditTip");
			
			$('#template-edit').dialog({
					bgiframe: true,
					autoOpen: false,
					resizable: false,
					width: 400,
					modal: false,
					buttons: {
						'���������': function(){
							var bValid = true;
							//allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editName, _this.mess['HEAD_NAME'], 2, 30, tips);
							bValid = bValid && checkLength(_this.editDetail, _this.mess['HEAD_DETAIL'], 0, 250, tips);
							
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
							
							var rec_used = $("#template-list tr[id=" + _this.templateId.val() + "]:first td.detail-text").attr("title").split(" ")[1];
							
							if (bValid) 
							{
								_this.Request("TemplateEdit", 
												{
													name: _this.editName.val(),
													detail: _this.editDetail.val(),
													group: _this.editGroup.val(),
													addGroups: stringAddGroups,
													templateId: _this.templateId.val(),
													recently_used: rec_used
												},
													function(data) 
													{
														_this.AfterTemplateEdit(data);
														_this.templateEditDialog.dialog('close');
													}										
												);
							}
						},
						'�������': function() {
							$(this).dialog('close');
							
						}
					},
					close: function() {
						//allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
						$("#template-edit #moreGroup").button().unbind("click");
						$("table#edit-groups-table tr:eq(0) td").children().remove();
					} 
			});
		}
		else
		{
			var allFields = $([]).add(_this.editName), tips = $("#templateEditTip");
			
			$('#template-edit').dialog({
					bgiframe: true,
					autoOpen: false,
					resizable: false,
					width: 400,
					modal: false,
					buttons: {
						'Save': function(){
							var bValid = true;
							//allFields.removeClass('ui-state-error');

							bValid = bValid && checkLength(_this.editName, _this.mess['HEAD_NAME'], 2, 30, tips);
							bValid = bValid && checkLength(_this.editDetail, _this.mess['HEAD_DETAIL'], 0, 250, tips);
							
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
							
							var rec_used = $("#template-list tr[id=" + _this.templateId.val() + "]:first td.detail-text").attr("title").split(" ")[1];
							
							if (bValid) 
							{
								_this.Request("TemplateEdit", 
												{
													name: _this.editName.val(),
													detail: _this.editDetail.val(),
													group: _this.editGroup.val(),
													addGroups: stringAddGroups,
													templateId: _this.templateId.val(),
													recently_used: rec_used
												},
													function(data) 
													{
														_this.AfterTemplateEdit(data);
														_this.templateEditDialog.dialog('close');
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
						$("#template-edit #moreGroup").button().unbind("click");
						$("table#edit-groups-table tr:eq(0) td").children().remove();
					} 
			});
		}		
	}
	//�������������� ������ ���������� ������
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
						'���������': function() {
							var bValid = true;
							//allFields.removeClass('ui-state-error');

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
						'�������': function() {
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
							'���������': function() {
								var bValid = true;
								//allFields.removeClass('ui-state-error');

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
							'�������': function() {
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
	
	//������������� �������������� ������
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
						'���������': function(){
							var bValid = true;
							//allFields.removeClass('ui-state-error');

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
						'�������': function() {
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
			tips = $('#groupEditTip');
			allFields = $([]).add(_this.editGroupName);
			
			$('#group-edit').dialog({
					bgiframe: true,
					autoOpen: false,
					width: 450,
					resizable: false,
					modal: false,
					buttons: {
						'���������': function(){
							var bValid = true;
							//allFields.removeClass('ui-state-error');

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
						'�������': function() {
							$(this).dialog('close');
						}
					},
					close: function() {
						//allFields.val('').removeClass('ui-state-error');
						tips.text(_this.mess['ALL_FIELDS']).css("color", "");
					} 
			});	
		}		
	}
	
	
	
	
	
	//������������� ������� ��� ��������� ajax ��������
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
	//������������� ������ ��� ���������
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
						'�������': function() {
							clearTimeout($("#dialog-id").html())
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
						clearTimeout($("#dialog-id").html())
						$(this).dialog('close');
					}
				}
			});	
		}	
	}

	


//������� ���������� ����� ���������� ������
clientSide.prototype.AfterGroupAdd = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		this.groupList.append('<div id = "'+data.id+'"> \
									<p class = "group-header"> \
										<a class="">'+data.name+'</a>\
										<span class = "edit-group ui-icon-pencil" title="������������� �������� ������"></span> \
										<span class = "delete-group ui-icon-close" title="������� ������"></span> \
										<span class="add-all-group-templates ui-icon-mail-closed" title="�������� ��� ������� �� ������"></span> \
									</p></div>');
									
		$(".groupcontent").append('<div id="group-'+data.id+'" class="group-number">' +
									'<div class="group-body">' + 
									'<div class="group-select-all"><input class="selectall" type="checkbox" title="�������� ���"></div>' +
										'<h3>������ &laquo;'+data.name+'&raquo;</h3> </div></div>'); // <table><tbody></tbody></table>
		
		// ������ ������� ��� ����������
		
		//var clone = $("#template-list #group-0 table").clone(); // ��������� ������� �� ������ "�� � ������"
		
		
		//clone.find("tbody").children().remove(); // ������� ����������
		//$("#template-list #group-"+data.id+" .group-body").append(clone); // ��������� � ������ ��� ��������� ������
		// ��������� � ������ ��� ��������� ������ ����� �������
		$("#template-list #group-"+data.id+" .group-body").append(
		"<table class='group-tbl-containerv templates-table'>" + 
		                        "<thead>" +
									"<tr>" +
										"<th class='not-sort-col'></th>" +            
										"<th class='sort-col'>" + _this.mess['HEAD_NAME'] + "</th>" +
										"<th class='sort-col'>" + _this.mess['HEAD_DETAIL'] + "</th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
										"<th class='not-sort-col'></th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>" +
								"</tbody>" +
							"</table>"
		); 
		// ��������� ������� ��� ����������
		$("#template-list #group-"+data.id+" table").dataTable({
	        "bPaginate": false,
	        "bLengthChange": false,
	        "bFilter": false,
	        "bSort": true,
	        "bInfo": false,
	        "bAutoWidth": false,
			"oLanguage": {
				"sEmptyTable": "<span class='notify'>� ���� ������ �������� �����������</span>"
			}
	    }); 
		
		
		$("#groups").append("<option value="+data.id+" selected>"+data.name+"</option>");
        $("#edit-groups").append("<option value="+data.id+">"+data.name+"</option>");
		$(".additionalGroup").append("<option value="+data.id+">"+data.name+"</option>");
		
		$("template-add select:first").change();
		
		this.AddHoverEffectForGroupIcons();
		
		this.moveElementsBody.append("<div groupid="+data.id+">"+data.name+"</div>");
		this.addElementsBody.append("<div groupid="+data.id+">"+data.name+"</div>");
		this.hoverForControls();
		
		// ��������������� ������ � ��������� �� ��� �������� �� ������
		$(".grouplist .ui-icon-mail-closed").mouseenter(function()
		{
		    $(this).addClass("small-buttons-hover");
		}).mouseleave(function()
		{
		    $(this).removeClass("small-buttons-hover");
		});
		
		_this.tablesSort(data.id);
		
		_this.checkTableEmptiness();
		_this.templatesRecount(true, data.id); // ���������� ����������� ��� � ������ ���, ����� ��� ����� �� ������
		
		$("#" + data.id + " p a").first().click(); // ��������� � ������ ��� ��������� ������
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['NEW_GROUP'] + " �" + data.name + "�");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['NEW_GROUP_ERR']);	
	}	
}

//������� ����� �������������� ������
clientSide.prototype.AfterGroupEdit = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var groupNameOld = $("#"+data.id).find("a:first").text();
		
		var len = $("#template-list #group-"+data.id+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
	    lenlen = lenlen.length;
	    groupNameOld = groupNameOld.substr(0,groupNameOld.length-lenlen-3);
	    
		$("#template-list #"+data.id+" p a:eq(0)").text(data.groupname);
		$("#group-"+data.id+" h3").html("������ &laquo;"+data.groupname+"&raquo;");
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
		
		_this.templatesRecount(true, data.id);
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['GROUP_EDITED'] + ". ������ ��� ������ - �" + groupNameOld + "�" + ". ����� ��� ������ - " + "�" + groupNameNew + "�");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_EDIT_ERR']); 
	}	
}

//����� �������� ������
clientSide.prototype.AfterGroupDelete = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var groupName = $("#"+data.groupId).find("a:first").text();
		var len = $("#template-list #group-"+data.groupId+" table tbody tr.searchable").length;
	    var lenlen = "" + len;
	    lenlen = lenlen.length;
	    groupName = groupName.substr(0,groupName.length-lenlen-3);
		
		$("#template-list #group-" + data.groupId + " tbody tr").each(function()
		{
			var currId = $(this).attr("id");
			// ���� ������� � ����� ������������ - ���� �������
			if($("#template-list #group-1 tr[id="+currId+"]").length > 0)
			{
				var cont = $("#template-list #group-1 tr[id="+currId+"]").closest("table");

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
			$("#template-list tr[groupid=0]").closest("table").dataTable().fnClearTable();
		else
		{
			$("#"+data.groupId).remove();
			$("#groups option[value="+data.groupId+"]").remove();
			$("#edit-groups option[value="+data.groupId+"]").remove();
			$(".moveElements-body div[groupid="+data.groupId+"]").remove();
			$(".addElements-body div[groupid="+data.id+"]").text(data.groupname);
		}
		
		// ������� ������ � ������� � ������� � ��������
		$(".group-item[groupid="+data.groupId+"]").each(function()
		{
			$(this).remove();
		});
		
		_this.templatesRecount(false, undefined);
		
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


//console.log($(this).parent().children(".more-groups").children().length == 0);
//console.log($(this).parent().children(".more-groups").children(".group-item:last"));


});*/		
		$("#1 p a").first().click(); // ��������� � ����� ������������ ����� ��������
		
		if(data.groupId == 0)
			_this.ShowNote(_this.mess['SUCCESS'], _this.mess['GROUP_NO_GROUP_DELETED']);
		else
			_this.ShowNote(_this.mess['SUCCESS'], _this.mess['GROUP_DELETED'] + " �" + groupName + "�");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['GROUP_DELETE_ERR']);
	}
}

//������� ���������� ����� ���������� ��������
clientSide.prototype.AfterTemplateAdd = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		_this.turnOnTables(data.group);
		
		var groupsColumnBody = "";
		
		if(data.group != 0)
		{
			// ����� ������ ��� ������ ��� ��������� � ������� � ��������
			var groupName = $(".grouplist #"+data.group).children().children("a:first").text();
			var len = $("#template-list #group-"+data.group+" table tbody tr.searchable").length;
			var lenlen = "" + len;
			lenlen = lenlen.length;
			groupName = groupName.substr(0,groupName.length-lenlen-3);
			groupsColumnBody += "<div title=\"������� � ������ '" + groupName + "'\" groupId='" + data.group + "' class='group-item'><a>" + groupName + "</a></div>";
			
			var i = 0;
			if(data.addGroups.length > 0)
			{
				var arrGroups = data.addGroups.split(',');
				
				arrGroups.forEach(function(addGroupId)
				{
					if(i++ == 1)
						return false;
						
					var groupName = $(".grouplist #"+addGroupId).children().children("a:first").text();
					var len = $("#template-list #group-"+addGroupId+" table tbody tr.searchable").length;
					var lenlen = "" + len;
					lenlen = lenlen.length;
					groupName = groupName.substr(0,groupName.length-lenlen-3);
					groupsColumnBody += "<div title=\"������� � ������ '" + groupName + "'\" groupId='" + addGroupId + "' class='group-item'><a>" + groupName + "</a></div>";
				});
			}
		}
			    
        // ������� �� ������� � �����������
        $("#template-list #group-"+data.group+" table").dataTable().fnAddData( [
						"<input type='checkbox' />",
						data.name,
						data.detail,
						"<div class='group-list'>" + groupsColumnBody + "</div>",
						"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
						"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
						"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
		);
		var added = $("#template-list #group-"+data.group+" table tbody").find("td:contains('" + data.name + "')").parent().attr("id",data.id).attr("groupId",data.group).attr("templateName",data.name).attr("templateDetail",data.detail).addClass("searchable");
		added.find("td:eq(0)").addClass("chkbox");
		added.find("td:eq(1)").addClass("name");
		added.find("td:eq(2)").addClass("detail-text").attr("title","������������� 0 ���");;
		added.find("td:eq(3)").addClass("template-groups");

		_this.giveTableCorrectWidth(data.group);
		
		if(data.addGroups.length > 0)
		{
			var arrGroups = data.addGroups.split(',');
			
			arrGroups.forEach(function(addGroupId)
			{
				_this.turnOnTables(addGroupId);
				
				// ������� �� ������� � �����������
		        $("#template-list #group-"+addGroupId+" table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								data.name,
								data.detail,
								"<div class='group-list'>" + groupsColumnBody + "</div>",
								"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
								"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
								"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
				);
				var added = $("#template-list #group-"+addGroupId+" table tbody").find("td:contains('" + data.name + "')").parent().attr("id",data.id).attr("groupId",addGroupId).attr("templateName",data.name).attr("templateDetail",data.detail).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("name");
				added.find("td:eq(2)").addClass("detail-text").attr("title","������������� 0 ���");;
				added.find("td:eq(3)").addClass("template-groups");
				
				_this.giveTableCorrectWidth(addGroupId);
			});
			
		}
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['NEW_TEMPLATE'] + ". �������� ������� - �" + data.name + "�");
		
		_this.checkTableEmptiness();
		_this.templatesRecount(false, undefined); // ������ �������� ���������
							
		//this.AddHoverEffectForTemplateList();
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], data.text);
	}
}

//������� ����� �������������� ��������
clientSide.prototype.AfterTemplateEdit = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var newName = data.newName;
		
		// ����� ������ ��� ������ ��� ��������� � ������� � ��������
		var groupsColumnBody = "";
		var i = 0;
		for (var i in data.newGroups)
		{
			var templateGroup = data.newGroups;
			
			if(i++ == 3)
				break;
				
			var groupName = $(".grouplist #"+templateGroup[i]).children().children("a:first").text();
			var len = $("#template-list #group-"+templateGroup[i]+" table tbody tr.searchable").length;
			var lenlen = "" + len;
			lenlen = lenlen.length;
			groupName = groupName.substr(0,groupName.length-lenlen-3);
			groupsColumnBody += "<div title=\"������� � ������ '" + groupName + "'\" groupId='" + templateGroup[i] + "' class='group-item'><a>" + groupName + "</a></div>";
		}
		
		//���� ���������� ������, �� ����� ����� ������� ���� � ����������� ��� � ������ �����
		if (data.groupChange == "Y")
		{
			var flagRecent = false;
			
			if($("#template-list #group-1 tr[id="+data.templateId+"]").length != 0)
				flagRecent = true;
			
			// ������� ������ ��� ������ ������ � ���������
			var trtemplate = $("#template-list tr[id="+data.templateId+"]");
			trtemplate.each(function(index)
			{
				var _this = $(this);

				var row = _this.get(0); // �������� ������ �������� �� ����

				var oTable = _this.closest("table").dataTable();

				var index = oTable.fnGetPosition(row); 	// �������� ������� ������
				oTable.fnDeleteRow(index);	// �������
				
			});
			
			// ���� ������� ����������� � "�� � ������"
			if(data.newGroups == 0)
			{
				_this.turnOnTables(0);
				
				
				// ������� �� ������� � �����������
		        $("#template-list #group-0 table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								data.newName,
								data.newDetail,
								"",
								"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
								"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
								"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
				);
				var added = $("#template-list #group-0 table tbody").find("td:contains('" + data.newName + "')").parent().attr("id",data.templateId).attr("groupId",0).attr("templateName",data.newName).attr("templateDetail",data.newDetail).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("name");
				added.find("td:eq(2)").addClass("detail-text").attr("title","������������� " + data.recentlyUsed + " ���");;
				added.find("td:eq(3)").addClass("template-groups");
				
				
				_this.giveTableCorrectWidth(0);
			}
			else
			{
				// ����� ��������� ������� � ��� ����� ������
				for (var i in data.newGroups)
				{
					var templateGroup = data.newGroups;
					
					_this.turnOnTables(templateGroup[i]);
					
					
					// ������� �� ������� � �����������
			        $("#template-list #group-"+templateGroup[i]+" table").dataTable().fnAddData( [
									"<input type='checkbox' />",
									data.newName,
									data.newDetail,
									"<div class='group-list'>" + groupsColumnBody + "</div>",
									"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
									"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
									"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
					);
					var added = $("#template-list #group-"+templateGroup[i]+" table tbody").find("td:contains('" + data.newName + "')").parent().attr("id",data.templateId).attr("groupId",templateGroup[i]).attr("templateName",data.newName).attr("templateDetail",data.newDetail).addClass("searchable");
					added.find("td:eq(0)").addClass("chkbox");
					added.find("td:eq(1)").addClass("name");
					added.find("td:eq(2)").addClass("detail-text").attr("title","������������� " + data.recentlyUsed + " ���");;
					added.find("td:eq(3)").addClass("template-groups");
					
					_this.giveTableCorrectWidth(templateGroup[i]);
				}	
			}
			
			if(flagRecent)
			{
				_this.turnOnTables(1);
				
				
				// ������� �� ������� � �����������
		        $("#template-list #group-1 table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								data.newName,
								data.newDetail,
								"<div class='group-list'>" + groupsColumnBody + "</div>",
								"",
								"",
								"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
				);
				var added = $("#template-list #group-1 table tbody").find("td:contains('" + data.newName + "')").parent().attr("id",data.templateId).attr("groupId",templateGroup[i]).attr("templateName",data.newName).attr("templateDetail",data.newDetail).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("name");
				added.find("td:eq(2)").addClass("detail-text").attr("title","������������� " + data.recentlyUsed + " ���");;
				added.find("td:eq(3)").addClass("template-groups");
				
				_this.giveTableCorrectWidth(1);
			}
		}
		//����� ������ ������ ������ � ��������
		else
		{			
			// �������� �������������� ��� ������� � �����������
			var trtemplate = $("#template-list tr[id="+data.templateId+"]");
			trtemplate.each(function(index)
			{
				var _this = $(this);
				
				var group = _this.attr("groupId");

				var row = _this.get(0); // �������� ������ �������� �� ����

				var oTable = _this.closest("table").dataTable();

				var index = oTable.fnGetPosition(row); 	// �������� ������� ������
				
				oTable.fnUpdate( [
					"<input type='checkbox' />",
					data.newName,
					data.newDetail,
					"<div class='group-list'>" + groupsColumnBody + "</div>",
					"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
					"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
					"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ], index, 0
				);

				_this.attr("id",data.templateId).attr("groupId",group).attr("templateName",data.newName).attr("templateDetail",data.newDetail).addClass("searchable");
				
				_this.find("td:eq(0)").addClass("chkbox");
				_this.find("td:eq(1)").addClass("name");
				_this.find("td:eq(2)").addClass("detail-text").attr("title","������������� " + data.recentlyUsed + " ���");;
				_this.find("td:eq(3)").addClass("template-groups");
			});
		}
		
		_this.checkTableEmptiness();
		_this.templatesRecount(false, undefined);
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['TEMPLATE_EDITED'] + ". �������� ������� - �" + newName + "�");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['TEMPLATE_EDIT_ERR']);
	}		
}

//����� �������� ��������
clientSide.prototype.AfterTemplateDelete = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		var templateName = $("#template-list tr[id="+data.templateId+"][groupid="+data.groupId+"]").attr("templateName");
		
		// �������� �������� ��� ������� � �����������
		var cont = $("#template-list tr[id="+data.templateId+"][groupid="+data.groupId+"]");

		var row = cont.get(0); // �������� ������ �������� �� ����

		var oTable = cont.closest("table").dataTable();

		var index = oTable.fnGetPosition(row); 	// �������� ������� ������
		oTable.fnDeleteRow(index);	// �������

		// ���� ������� � ����� ������������ - ���� �������
		if($("#template-list #group-1 tr[id="+data.templateId+"]").length > 0 && $("#template-list tr[id="+data.templateId+"]").not($("#template-list #group-1 tr[id="+data.templateId+"]")).length < 1)
		{
			// �������� �������� ��� ������� � �����������
			var cont = $("#template-list #group-1 tr[id="+data.templateId+"]");

			var row = cont.get(0); // �������� ������ �������� �� ����

			var oTable = cont.closest("table").dataTable();

			var index = oTable.fnGetPosition(row); 	// �������� ������� ������
			oTable.fnDeleteRow(index);	// �������
		}
		
		$("#template-list tr[id="+data.templateId+"] .group-item[groupId="+data.groupId+"]").remove(); // ������� ������ � ������� �������������
		
		_this.checkTableEmptiness();
		_this.templatesRecount(false, undefined);
		
		_this.ShowNote(_this.mess['SUCCESS'], _this.mess['TEMPLATE_DELETED'] + ". �������� ���������� ������� - �" + templateName + "�");
	}
	else
	{
		_this.ShowError(_this.mess['ERROR'], _this.mess['TEMPLATE_DELETE_ERR']);
	}	
}

//����� ���������� ���������
clientSide.prototype.AfterTemplateAddFromExcel = function(data)
{
	var _this = this;
	if (data.state == 'good')
	{
		$(".grouplist div#1").children().children("a:first").text("����� ������������");
		$(".grouplist div#0").children().children("a:first").text("�� � ������");
		_this.resetTablesContentCount(); // ���������� ����������� ���������� �������� � �������
		
		//������� ������� ����� ������, ���� ��� ����
		if (data.newGroups.length > 0)
		{
			for(var index in data.newGroups)
			{
                if(data.newGroups[index].id == 0)
                    continue;
                    
				this.groupList.append('<div id = "'+data.newGroups[index].id+'"> \
						<p class = "group-header"> \
							<a class="">'+data.newGroups[index].name+'</a>\
							<span class = "edit-group ui-icon-pencil" title="������������� �������� ������"></span> \
							<span class = "delete-group ui-icon-close" title="������� ������"></span> \
							<span class="add-all-group-templates ui-icon-mail-closed" title="�������� ��� ������� �� ������"></span> \
						</p></div>');
						
				$(".groupcontent").append('<div id="group-'+data.newGroups[index].id+'" class="group-number"><div class="group-body"><h3>������ &laquo;'+data.newGroups[index].name+'&raquo;</h3> </div></div>'); // <table><tbody></tbody></table>
				
				// ��������� � ������ ��� ��������� ������ ����� �������
				$("#template-list #group-"+data.newGroups[index].id+" .group-body").append(
				"<table class='group-tbl-containerv templates-table'>" + 
				                        "<thead>" +
											"<tr>" +
												"<th class='not-sort-col'></th>" +            
												"<th class='sort-col'>" + _this.mess['HEAD_NAME'] + "</th>" +
												"<th class='sort-col'>" + _this.mess['HEAD_DETAIL'] + "</th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
												"<th class='not-sort-col'></th>" +
											"</tr>" +
										"</thead>" +
										"<tbody>" +
										"</tbody>" +
									"</table>"
				); 
				// ��������� ������� ��� ����������
				$("#template-list #group-"+data.newGroups[index].id+" table").dataTable({
					"bPaginate": false,
					"bLengthChange": false,
					"bFilter": false,
					"bSort": true,
					"bInfo": false,
					"bAutoWidth": false,
					"oLanguage": {
						"sEmptyTable": "<span class='notify'>� ���� ������ ������� �����������</span>"
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
			for (var i in data.addedTemplates)
			{
				var addedTemplates = data.addedTemplates;
				
				_this.turnOnTables(addedTemplates[i].GROUPS);
				
				var groupsColumnBody = "";
				if(addedTemplates[i].GROUPS != 0)
				{
					var groupName = $(".grouplist #"+addedTemplates[i].GROUPS).children().children("a:first").text();
					groupsColumnBody += "<div title=\"������� � ������ '" + groupName + "'\" groupId='" + addedTemplates[i].GROUPS + "' class='group-item'><a>" + groupName + "</a></div>";
				}

				// ������� �� ������� � �����������
		        $("#template-list #group-"+addedTemplates[i].GROUPS+" table").dataTable().fnAddData( [
								"<input type='checkbox' />",
								addedTemplates[i].NAME,
								addedTemplates[i].DETAIL,
								"<div class='group-list'>" + groupsColumnBody + "</div>",
								"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
								"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
								"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
				);
				var added = $("#template-list #group-"+addedTemplates[i].GROUPS+" table tbody").find("td:contains('" + addedTemplates[i].NAME + "')").parent().attr("id",addedTemplates[i].id).attr("groupId",addedTemplates[i].GROUPS).attr("templateName",addedTemplates[i].NAME).attr("templateDetail",addedTemplates[i].DETAIL).addClass("searchable");
				added.find("td:eq(0)").addClass("chkbox");
				added.find("td:eq(1)").addClass("name");
				added.find("td:eq(2)").addClass("detail-text").attr("title","������������� 0 ���");;
				added.find("td:eq(3)").addClass("template-groups");
				
				_this.giveTableCorrectWidth(addedTemplates[i].GROUPS);
				
				// ���� �� ������� �������������� ������, �� ����������
				if (addedTemplates[i].GROUPS2 == undefined)
				    continue;
				// ��������� �������� � ���. ������
				for (var j in addedTemplates[i].GROUPS2)
				{
					var addedtemplaTesAddGroups = addedTemplates[i].GROUPS2;
					
					_this.turnOnTables(addedtemplaTesAddGroups[j]);
					
					var groupsColumnBody = "";
					var groupName = $(".grouplist #"+addedtemplaTesAddGroups[j]).children().children("a:first").text();
					groupsColumnBody += "<div title=\"������� � ������ '" + groupName + "'\" groupId='" + addedTemplates[i].GROUPS2 + "' class='group-item'><a>" + groupName + "</a></div>";
			
					// ������� �� ������� � �����������
			        $("#template-list #group-"+addedtemplaTesAddGroups[j]+" table").dataTable().fnAddData( [
									"<input type='checkbox' />",
									addedTemplates[i].NAME,
									addedTemplates[i].DETAIL,
									"<div class='group-list'>" + groupsColumnBody + "</div>",
									"<div class='edit-template ui-icon ui-icon-pencil' title='�������� ������'></div>",
									"<div class='delete-template ui-icon ui-icon-close' title='������� ������'></div>",
									"<div class='use-template ui-icon ui-icon-mail-closed' title='�������� ���� ������ � ���������'></div>" ] 
					);
					var added = $("#template-list #group-"+addedtemplaTesAddGroups[j]+" table tbody").find("td:contains('" + addedTemplates[i].NAME + "')").parent().attr("id",addedTemplates[i].id).attr("groupId",addedtemplaTesAddGroups[j]).attr("templateName",addedTemplates[i].NAME).attr("templateDetail",addedTemplates[i].DETAIL).addClass("searchable");
					added.find("td:eq(0)").addClass("chkbox");
					added.find("td:eq(1)").addClass("name");
					added.find("td:eq(2)").addClass("detail-text").attr("title","������������� 0 ���");;
					added.find("td:eq(3)").addClass("template-groups");
					
					_this.giveTableCorrectWidth(addedtemplaTesAddGroups[j]);
				}
				
			}
			
			_this.AddHoverEffectForTemplateList();
		}
		
		// ��������������� ������ � ��������� �� ��� �������� �� ������
		$(".grouplist .ui-icon-mail-closed").mouseenter(function()
		{
		    $(this).addClass("small-buttons-hover");
		}).mouseleave(function()
		{
		    $(this).removeClass("small-buttons-hover");
		});
		
		_this.checkTableEmptiness();
		_this.templatesRecount(true, undefined);
		
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
	var tempDialog = this.ajaxDialog;
	var id = setTimeout(function(){tempDialog.dialog("close"); clearTimeout($("#dialog-id").html())},5000);
	$("#dialog-id").html(id);
}
clientSide.prototype.ShowError = function(title, text)
{
	this.ajaxDialog.dialog('option', 'title', title);
	this.ajaxDialogText.html('<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' + '<span style="color:red">'+text+'</span>');
	this.ajaxDialog.dialog('open');
	var tempDialog = this.ajaxDialog;
	var id = setTimeout(function(){tempDialog.dialog("close"); clearTimeout($("#dialog-id").html())},5000);
	$("#dialog-id").html(id);
}
//������� ���������� ���������
clientSide.prototype.Recount = function()
{
	var text = this.message.val();
	/*����������� ���
	* \n - � FF - ��� ���� ������, � IE - ���, ������� ��������� ������ ���  
	*/
	//����������, IE ��� ��� ���
	if (text.match(/\r/g) == null)
	{
		//������� ���������� ��������
		var newLinesymbols = text.match(/\n/g);
		newLinesymbolsCount = (newLinesymbols != null)? newLinesymbols.length : 0;					
	}
	
	//������ �� ���� ������� ���������� ��������
	textLength = text.length + newLinesymbolsCount;
	//���������� ����� �����
	messLenPart = (isRus(text)) ? ((textLength) > 70 ? 66 : 70) : ((textLength) > 160 ? 153 : 160);
	
	var parts = Math.ceil(textLength / messLenPart);
	
	this.messageLength.text(textLength);
	this.partSize.text(messLenPart);
	this.parts.text(parts);
	this.needSms.text(parts * this.correctNums.text());
}
 
clientSide.prototype.tablesSort = function(newGroupID)
{	
	// �������� ������ ��� ����������� ������
	var addedGroup = $(".grouplist #"+newGroupID).children().children("a:first").text();
	var firstLetter = addedGroup.toLowerCase().charAt(0); // �������� ������ ������ � �������� ������
	// �������� ��� ������, ����� "����� ������������"
	var groupsHeaders = $(".grouplist div").not($(".grouplist div#newgroup, div#1"));
	var lengthGroups = groupsHeaders.length; // �������� ���������� �����

	var i=0; // �������
	var currChar = ""; // ������� ������
	var currDiv = groupsHeaders; // ������� ��� � �������
	var flagAdd = false; // ���� ����������
	// ���� �� ���� �������
	for(var i = 0; i < lengthGroups-1; i++)
	{
		currDiv = currDiv.next("div:first"); // ������� ���
	    currChar = currDiv.children().children("a:first").text().toLowerCase().charAt(0); //  ������ ������ �������� ������
	    // ���� ������� �� ������, ������� ������, ��� � ����������� ������, �� ��������� ��� � ������� �� ���������� �� ��������
	    if(currChar > firstLetter)
	    {
	        $(".grouplist #"+newGroupID).insertAfter(currDiv.prev("div:first"));
	        flagAdd = true;
	        break;
	    }
	}
	// ���� ������ �� ���� ��������� � ������ �����
	if(!flagAdd)
	{
		$(".grouplist #"+newGroupID).insertAfter($(".grouplist #0"));
	}
	
}

//�������� �� ���������� ��������� � �������
clientSide.prototype.checkTableEmptiness = function()
{
	$("#template-list table").each(function()
	{
		if($(this).find("tr td").hasClass("dataTables_empty"))
		{
			$(this).dataTable().fnSetColumnVis( 1, false );
			$(this).dataTable().fnSetColumnVis( 2, false ); 
		}
	});
}

//����������� ������
clientSide.prototype.turnOnTables = function(groupNumber)
{
	if($("#template-list #group-"+groupNumber+" table tr td").hasClass("dataTables_empty"))
	{
		$("#template-list #group-"+groupNumber+" table").dataTable().fnSetColumnVis( 1, true);
		$("#template-list #group-"+groupNumber+" table").dataTable().fnSetColumnVis( 2, true);
	}
}

//������������� �������� � �������
clientSide.prototype.giveTableCorrectWidth = function(groupNumber)
{
	$("#template-list #group-"+groupNumber+" table tr td.name").css("width","120px");
	$("#template-list #group-"+groupNumber+" table tr td.detail-text").css("width","300px");
}

//������� ��������� � ������ �������
clientSide.prototype.templatesRecount = function(first, tableID)
{
	var groupsHeaders;
	if(tableID == undefined)
		groupsHeaders = $(".grouplist div").not($(".grouplist div#newgroup"));
	else
		groupsHeaders = $(".grouplist div#" + tableID);
	groupsHeaders.each(function()
	{
	    var groupId = $(this).attr("id");
	    var len = $("#template-list #group-" + groupId + " table tbody tr[groupid=" + groupId + "]").length;
	    var lenlen = "" + len;
	    lenlen = lenlen.length;
	    var text = $(this).children().children("a:first").text();
	    if(!first)
	    	text = text.substr(0,text.length-lenlen-3);
	     
	    $(this).children().children("a:first").text(text + " (" + len + ")");  
	});
	
}

// �������� - ����� �� ������������ �������� ��� ��������� ��������, ����������� � ���������� ���������
clientSide.prototype.CheckIfCanAddMoveRemove = function()
{
	var _this = this;
	//���� ������ ���� �� ���� �������, ����� ������������ ��������
	if ($("input[type=checkbox]:not(.selectall)").parent().parent().parent().find('input[type=checkbox]:checked').length > 0)
	{
		$("#useto").button( "option", "disabled", false );
		
		var canMove = true;
		var canAdd = true;
		var templatesSelected = $("#template-list tr.ui-selecting");
		templatesSelected.each(function(id)
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
			//����������
			_this.addingHeaderText.addClass('addElements-header-text-enabled');
			_this.addingHeader.addClass('dashed');
		}
		else
		{
			// ����������
			_this.addElementsBody.css('display','none');
			_this.addingHeaderText.removeClass('addElements-header-text-enabled');
			_this.addingHeader.removeClass('dashed');
		}
		
		if(canMove)
		{
			//�����������
			_this.movingHeaderText.addClass('moveElements-header-text-enabled');
			_this.movingHeader.addClass('dashed');
			
			// ��������
			$('.actionElements-body [action=del]').show();
		}
		else
		{
			//�����������
			_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
			_this.movingHeader.removeClass('dashed');	
			_this.moveElementsBody.css('display','none');
			
			// ��������
			$('.actionElements-body [action=del]').hide();
		}
		 
	}
	else
	{
		$("#useto").button( "option", "disabled", true );
		
		//�����������
		_this.movingHeaderText.removeClass('moveElements-header-text-enabled');
		_this.movingHeader.removeClass('dashed');	
		_this.moveElementsBody.css('display','none');
		
		// ����������
		_this.addElementsBody.css('display','none');
		_this.addingHeaderText.removeClass('addElements-header-text-enabled');
		_this.addingHeader.removeClass('dashed');
		
		// ��������
		$('.actionElements-body [action=del]').hide();
	}
}

//������� ��������� � ������ �������
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

//�������� - ���� ��� ������ � �������� � ������ �����������, �� ������ ������ � ����� � ���������� ��� ����, ����� - �������
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


clientSide.prototype.ClearBoxesAfterAction = function()
{
	$("#template-list input[type=checkbox]").each(function()
	{
	    $(this).removeAttr("checked");
	    $($(this).parent().parent().removeClass("ui-selecting"));
	});
}

//�������� - ����� �� ������������ �������� ��� ��������� ��������, ����������� � ���������� ���������
//clientSide.prototype.CheckMemeoryNeeded = function(id)
//{
	//var resultArray = new Array();
	
	//var targets = $(".groupcontent .group-number");
	
	//var selectAll = $(target.parent().parent().parent().parent().parent().parent().find(".selectall"));
	//var targets = $(target.parent().parent().parent().children("tr"));
	
	//var flagAllChecked = true;
	
	/*
	targets.each(function()
	{
		var t = $(this);
		var currCheckBoxes = t.find("tbody tr td input[type=checkbox:checked]");
		
		currCheckBoxes.each(function()
		{
			
		}
		resultArray.push("");
	});
	
	if(flagAllChecked)
	{
		selectAll.attr("checked","checked");
	}
	else
	{
		selectAll.removeAttr("checked");
	}*/
//}