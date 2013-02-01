/*Data saved when call callPrivateService is executed:
 In document.body:
 	csp_action : name of the action called.
 	csp_qs : querystring of parameters.
 	csp_async : true or false: determine if the ajax call was sync or async.
 	csp_param: optional fourth parameter.
 * */
var SERVER_TIMEZONE = 1;
var request;
$.extend({
// LOGGED ACCOUNT;
 getAccount: function() {return account;},
 getUsername: function() {return account.username;},
 getFullName: function() {return account.name+' '+account.surname;},
 getEamil: function() {return account.email;},
 getId: function() {return account.id;},
 getType: function() {return account.typeid;},
 getGMT: function() {return account.gmt;},
 getBalance: function(){
 	var balance_amount;
 	$('body').off('dataretrieved-gameaccount-getbalance').on('dataretrieved-gameaccount-getbalance',function(e,xml){
 		balance_amount=$('emaster',xml).attr('balanceamount');
 	});
 	callPrivateService('gameaccount-getbalance',"&onlyemaster=0&cached=0",false);
 	return balance_amount;
 },
 reload: function() {reloadSector();}, 
 
 callPreset: function(name){callPreset(name)},
 callPrivateService : function(action,qs,asynctrue, param){callPrivateService(action, qs,asynctrue,param)},
 callService: function(action,qs){callService(action, qs)}
});

function checkRequired(containerid){
	var complete = true;
	$('div#'+containerid+' div.required input[type=text]').each(function(){
		if(($(this).val()==undefined)||$(this).val()==''){
			complete = false;
			$(this).closest('.control-group').addClass('error');	
		}
	});
	return(complete);
}

//Date fields have an specific error message
function checkDateRequired(containerid){
	var complete = true;
	$('div#'+containerid+' div.required input.date[type=text]').each(function(){
		if(($(this).val()==undefined)||$(this).val()==''){
			complete = false;
			$(this).closest('.control-group').addClass('error');	
		}
	});
	return(complete);
}

function resetAlertsForm(containerid){
	$('div#'+containerid+' div.alert-messages').empty();
	$('div#'+containerid+' .error').removeClass('error');
}

function validationFilters(filter_name){
	switch(filter_name){
		case 'new-player-fast':
			var $currentModal = $('div.modal:visible');
			if(!validateField('username',$('div.modal-body input.username',$currentModal).val())){
				var error_message =		"<div class='alert alert-error'>"+
											"<a class='close' data-dismiss='alert' type='button'>&times;</a>"+
											"<strong>Error</strong>:  fields marked contains invalid values."+
    									"</div>";
					$('div.alert-messages',$currentModal).html(error_message);
					return false;
			}
			if(!validateField('password',$('div.modal-body input.password',$currentModal).val())){
				var error_message =		"<div class='alert alert-error'>"+
											"<a class='close' data-dismiss='alert' type='button'>&times;</a>"+
											"<strong>Error</strong>:  fields marked contains invalid values."+
    									"</div>";
					$('div.alert-messages',$currentModal).html(error_message);
					return false;
			}
			if($('input.password',$currentModal).val()!==$('input.repeat-password',$currentModal).val()){
				var error_message =		"<div class='alert alert-error'>"+
											"<a class='close' data-dismiss='alert' type='button'>&times;</a>"+
											"Il conto non e stato creato, i campi <strong>password</strong> e <strong>repeat-password</strong> non sono uguali. Inserisci di nuovo."+
    									"</div>";
				$('div.alert-messages',$currentModal).html(error_message);
				return false;
			}
		break;
	}
	return true;
}


function callPreset(name){
    data='you called callPreset with this name: '+name;
    $('body').trigger("dataretrieved", data);
};

function callPrivateService(action,qs,asynctrue,param){
    if(qs==undefined){
        qs='&noquery';
    }
    if(asynctrue==undefined){
        asynctrue=false;
    }
request = $.ajax({
        async: asynctrue,
        cache: false,
        type: "GET",
        url: 'ajax.xml.php?executeaction=1&action='+action+qs,
        dataType: "xml",
        success: function(xml) {
        	$.data(document.body,'cps_action',action);
        	$.data(document.body,'cps_qs',qs);
        	$.data(document.body,'cps_async',asynctrue);
        	$.data(document.body,'cps_param',param);
        	$('body').trigger("dataretrieved"+'-'+action, [xml,param]);
        },
        error: function(request, status, error){
        }
    });
};
function callService(action,qs){
    if(qs==undefined){
        qs='&noquery';
    }
    $.ajax({
        async: true,
        cache: false,
        type: "GET",
        url: 'ajax.xml.php?action='+action+qs,
        dataType: "xml",
        success: function(xml) {
            if($('response',xml).attr('status')==0){
                
            }else{
                $('body').trigger("dataretrieved", xml);
            }
        },
        error: function(request, status, error){
        }
    });
};

$('a[preset*="preset"]').live('click',function(){
    $.callPreset($(this).attr('preset'));
});

// ONLY FOR DEV VERSION.
$('.demodata').live('click',function(){
    switchHelpToResults();
});

$('.showthehelp').live('click',function(){
    switchHelpToResults();
});

function switchHelpToResults(){
  dspval1=$('.active .sector-help').css('display');
  dspval2=dspval1=='none'?'block':'none';
  
  $('.active .sector-help').css('display',dspval2);  
  $('.active .sector-result').css('display',dspval1);
  $('.active .showthehelp').css('display',dspval1);
};

last_account_selected=null;

$('div#modal-search-account').modal({
    show : false
});

$('div#modal-sp9').modal({
    show : false
});

$('div.modal .modal-footer a.cancel').live('click', function(event){
	event.preventDefault();
	$(this).closest('.modal').modal('hide');
});

/* ********************************************* *
 *                     Help Modal                
 * ********************************************* */

$('#modal-help').modal({
    show : false
});

$('#modal-help-open').live('click',function(event){
    event.preventDefault();
    var modalurlhelp=currenthelper;
	$('#modal-help').find('div.modal-body').load(modalurlhelp).end().modal('show');
});

/***************************************************/

//Interface
$('a.search-account').die('click').live('click', function(event){
    event.preventDefault();
    var $this = $(this);
    $('#modal-search-account').find('div.rel-content').load($(this).attr('href')).end()
    .modal('show');
    var wait = setInterval(function(){
    	if(($('#modal-search-account').is(':visible'))&&(!$('#modal-search-account').is(':animated'))){
    		clearInterval(wait);
    		$('#modal-search-account').find('input[type=text]:first').focus()
    		.end()
    		.find('#destination-id-account').val($this.attr('destination-id-account'))
    		.end()
    		.find('#destination-name-account').val($this.attr('destination-name-account'))
    		.end()
    		.find('#destination-balance-account').val($this.attr('destination-balance-account'));
    	}
    },200);
});

$('#modal-search-account .modal-footer a.cancel').live('click',function(event){
    event.preventDefault();
    $('#modal-search-account').modal('hide');
});

/*
$('#modal-search-account .modal-footer a.select').live('click',function(event){
    event.preventDefault();
    var account_select = new Array();
    account_select['id']=$('#modal-search-account form.search-account select#search-results').val();
    account_select['nickname']=$('#modal-search-account form.search-account select#search-results option:selected').text();
    account_seclect['type_id']="1";
    
    last_account_selected={id:account_select['id'],nickname:account_select['nickname'],typeid:account_seclect['type_id']};
    $('#modal-filter').modal('hide');
});
*/

           
(function($) { 
	/*Modal-filter*/
	//Default
	$('div#modal-filter').modal({
			show : false
	});

	//Interface
	$('a.modal-loader').live('click', function(event){
		event.preventDefault();
        modalurl=modalpath+$(this).attr('href');
	    $('#modal-filter').find('div.rel-content').load(modalurl).end()
	    .modal('show');
	});
	
	$('#modal-filter .modal-footer a.cancel').live('click',function(event){
		event.preventDefault();
		$('#modal-filter').modal('hide');
	});
	
	//Important: If modal-loader-create link is placed into a dropdown menu, there is a conflict
	//with bootstrap javascript, is necessary to bind click using off and on inmediatly before the view (as in topmenu)
	$('a.modal-loader-create').die('click').live('click', function(event){
		event.preventDefault();
        modalurl=modalpath+$(this).attr('href');
	    $('#modal-create').find('div.rel-content').load(modalurl).end()
	    .modal('show');
		$('#modal-filter').modal('hide');
	});
	$('#modal-create .modal-footer a.cancel').live('click',function(event){
		event.preventDefault();
		$('#modal-create').modal('hide');
	});
	
	$('#modal-create .modal-footer a.submit').live('click',function(event){
		event.preventDefault();
		if($(this).hasClass('disabled')){return;}
		$('#modal-create div.alert-messages').empty();
		$('#modal-create .error').removeClass('error');
		if(!checkRequired('modal-create')){
				$('#modal-create div.alert-messages').html('<div class="alert alert-error"><strong>Error with data!</strong> Marked field are required.</div>');
			return;	
		}
		
		if($('input.validation-name').length>0){//Specific validation
			if(!validationFilters($('input.validation-name').val())){
				return;
			}
		}
		var callnameprivateservice = ($('#modal-create:visible input.id-action-param').val()!=undefined)?$('#modal-create:visible input.id-action-param').val() : $('#modal-create:visible input[name=name]').val();
		$.callPrivateService($('#modal-create input#callfunction').val(),getCreateParams(),true,callnameprivateservice);
		$('#modal-form').modal('hide');
	});
	
	
	/*Accordion controls*/
	$('#collapseSearch:visible  .accordion-inner a.cancel').live('click',function(event){
		event.preventDefault();
		resetAlertsForm('collapseSearch');
		$('#collapseSearch:visible').collapse('hide');
	});
	
	$('#collapseSearch:visible  .accordion-inner a.submit').live('click',function(event){
		event.preventDefault();
		if($(this).hasClass('disabled')){return;}
		
		resetAlertsForm('collapseSearch');
		if(!checkDateRequired('collapseSearch')){
				$(this).closest('.accordion-inner').find('div.alert-messages').html('<div class="alert alert-error"><strong>Error</strong> '+tr('to_get_results')+'.</div>');
			return;	
		}
		if(!checkRequired('collapseSearch')){
				$(this).closest('.accordion-inner').find('div.alert-messages').html('<div class="alert alert-error"><strong>Error with data!</strong> Marked field are required.</div>');
			return;	
		}
		var callnameprivateservice = ($('#collapseSearch:visible input.id-action-param').val()!=undefined)?$('#collapseSearch:visible input.id-action-param').val() : $('#collapseSearch:visible input[name=name]').val();
		$.callPrivateService($('#collapseSearch:visible input#callfunction').val(),getSearchParams(),true,callnameprivateservice);
		$('#collapseSearch:visible').collapse('hide');
	});
	
	//control
	function getFilterParams(){
		var filterQueryString ="";
		var formated_value;
		$('#modal-filter .modal-body form input[type="text"],#modal-filter .modal-body form select,#modal-filter .modal-body form input[type=hidden]').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")){//los inputs sin name no se envian
				if(($('input#callfunction').val()=='callfunction')||($('#collapseSearch:visible input#callfunction,#modal-filter:visible .modal-body input#callfunction').val()=='callprocedure')){//Si es callfunction hay que poner parametros quey no existen a null
					if(($(this).val()!=undefined)&&($(this).val()!="")){
						formated_value = ($(this).hasClass('date'))? changeTimeZone(formatDate($(this).val()),SERVER_TIMEZONE) : $(this).val();
						filterQueryString+= "&"+$(this).attr('name')+"="+formated_value;	
					}else{
						filterQueryString+= "&"+$(this).attr('name')+"=null";
					}		
				}else{//Si no es callfunction, no se env�an los parametros que no existen.
					if(($(this).val()!=undefined)&&($(this).val()!="")){
						formated_value = ($(this).hasClass('date'))? formatDate($(this).val()) : $(this).val();
						filterQueryString+= "&"+$(this).attr('name')+"="+formated_value;
					}
				}	
			}
		});
		
		$('#modal-filter .modal-body form input:checked').each(function(){
			filterQueryString+= "&"+$(this).attr('name')+"="+$(this).val();
		});
		
		$('#modal-filter .modal-body form div[data-toggle=buttons-radio]').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")){
				filterQueryString+= "&"+$(this).attr('name')+"="+$(this).attr('value');	
			}
		});
		$.data(document.body,'params_pagination',filterQueryString);
		return(filterQueryString);
	}
	
	//#modal-filter .modal-body
	function getSearchParams(){
		var filterQueryString ="";
		var formated_value;
		$('#collapseSearch:visible form input[type="text"],#collapseSearch:visible form select,#collapseSearch:visible form input[type=hidden],#modal-filter:visible .modal-body form input[type="text"],#modal-filter:visible .modal-body form select,#modal-filter:visible .modal-body form input[type=hidden],#modal-filter:visible .modal-body form textarea').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")&&(!$(this).hasClass('no-filter'))){//los inputs sin name no se envian
				var $current_form = $('#collapseSearch:visible form');
				if(($('#collapseSearch:visible input#callfunction,#modal-filter:visible .modal-body input#callfunction').val()=='callfunction')||($current_form.hasClass('required-fields'))){//Si es callfunction hay que poner parametros quey no existen a null
					if(($(this).val()!=undefined)&&($(this).val()!="")){
						formated_value = ($(this).hasClass('date'))? changeTimeZone(formatDate($(this).val()),SERVER_TIMEZONE) : $(this).val();
						filterQueryString+= "&"+$(this).attr('name')+"="+formated_value;	
					}else{
						filterQueryString+= "&"+$(this).attr('name')+"=null";
					}		
				}else{//Si no es callfunction, no se envian los parametros que no existen.
					if(($(this).val()!=undefined)&&($(this).val()!="")){
						formated_value = ($(this).hasClass('date'))? formatDate($(this).val()) : $(this).val();
						filterQueryString+= "&"+$(this).attr('name')+"="+formated_value;
					}
				}	
			}
		});
		
		$('#collapseSearch:visible form input:checked,#modal-filter:visible .modal-body form input:checked').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")&&(!$(this).hasClass('no-filter'))){
				filterQueryString+= "&"+$(this).attr('name')+"="+$(this).val();
			}
		});
		
		$('#collapseSearch:visible form div[data-toggle=buttons-radio],#modal-filter:visible .modal-body form div[data-toggle=buttons-radio]').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")&&(!$(this).hasClass('no-filter'))){
				filterQueryString+= "&"+$(this).attr('name')+"="+$(this).attr('value');	
			}
		});
		$.data(document.body,'params_pagination',filterQueryString);
		return(filterQueryString);
	}
	
	/*Modal Search Account*/
	//Default
	$('div#modal-search-account').modal({
			show : false
	});
	
	//Interface
	$('a.modal-search-account-loader').live('click', function(event){
		event.preventDefault();
        modalurl=modalpath+$(this).attr('href');
	    $('#modal-search-account').find('div.rel-content').load(modalurl).end()
	    .modal('show');
	});
	
	$('div#modal-search-account input#username').typeahead();
	$('body').live("dataretrieved-gameaccount-fastsearch-forusername", function(e, xml){
		var list_registers = new Array();
		$('registers register',xml).each(function(k,v){
			list_registers.push($(this).attr('username'));
		});
		//$('div#modal-search-account input#username').attr('data-source',"list_registers");	
	});
	
	/*Modal-form*/
	//Default
	$('div#modal-form').modal({
			show : false
	});

	//Interface
	$('a.modal-form').live('click', function(event){
		event.preventDefault();
        alert(modalurl);
	    $('#modal-form').find('div.rel-content').load(modalurl).end()
	    .modal('show');
	});
	
	$('#modal-form .modal-footer a.cancel').live('click',function(event){
		event.preventDefault();
		$('#modal-form').modal('hide');
	});
	$('#modal-form .modal-footer a.submit, #modal-filter .modal-footer a.filter').live('click',function(event){
		event.preventDefault();
		if($(this).hasClass('disabled')){return;}
		if($('input.validation-name').length>0){//Specific validation
			if(!validationFilters($('input.validation-name').val())){
				return;
			}
		}
		var callnameprivateservice = $(this).closest('#modal-form').find('input#callprivateservice').val();
		$.callPrivateService($(this).closest('#modal-form').find('input#callfunction').val(),getFormParams(),true,callnameprivateservice);
		$('#modal-form').modal('hide');
	});
	
	
	//control
	function getFormParams(){
		var filterQueryString ="";
		var formated_value;
		$('.modal:visible .modal-body form input[type="text"],.modal:visible .modal-body form select,.modal:visible .modal-body form input[type=hidden],.modal:visible .modal-body form textarea').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")&&(!$(this).hasClass('no-filter'))){//los inputs sin name no se env�an
					if(($(this).val()!=undefined)&&($(this).val()!="")){
						formated_value = ($(this).hasClass('date'))? changeTimeZone(formatDate($(this).val()),SERVER_TIMEZONE) : $(this).val();
						filterQueryString+= "&"+$(this).attr('name')+"="+formated_value;	
					}else{
						filterQueryString+= "&"+$(this).attr('name')+"=";
					}		
			}
		});
		
		
		$('#modal-form .modal-body form input:checked').each(function(){
			if((!$(this).hasClass('no-filter'))&&($(this).attr('name')!=undefined)&&($(this).attr('name')!="")){
				filterQueryString+= "&"+$(this).attr('name')+"="+$(this).val();
			}
		});
		$('#modal-form .modal-body form div[data-toggle=buttons-radio]').each(function(){
			if((!$(this).hasClass('no-filter'))&&($(this).attr('name')!=undefined)&&($(this).attr('name')!="")){
				filterQueryString+= "&"+$(this).attr('name')+"="+$(this).attr('value');	
			}
		});
		$.data(document.body,'params_pagination',filterQueryString);
		return(filterQueryString);
	}
	
	
//Params create modal
	function getCreateParams(){
		var filterQueryString ="";
		var formated_value;
		$('#modal-create .modal-body form input[type="text"],#modal-create .modal-body form input[type="password"],#modal-create .modal-body form select,#modal-create .modal-body form input[type=hidden],#modal-create .modal-body form textarea').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")&&(!$(this).hasClass('no-filter'))){//los inputs sin name no se envian
				
					if(($(this).val()!=undefined)&&($(this).val()!="")){
						formated_value = ($(this).hasClass('date'))? changeTimeZone(formatDate($(this).val()),SERVER_TIMEZONE) : $(this).val();
						filterQueryString+= "&"+$(this).attr('name')+"="+formated_value;	
					}else{
						filterQueryString+= "&"+$(this).attr('name')+"=";
					}		
			}
		});
		
		$('#modal-create .modal-body form input:checked').each(function(){
			filterQueryString+= "&"+$(this).attr('name')+"="+$(this).val();
		});
		
		$('#modal-create .modal-body form div[data-toggle=buttons-radio]').each(function(){
			if(($(this).attr('name')!=undefined)&&($(this).attr('name')!="")){
				filterQueryString+= "&"+$(this).attr('name')+"="+$(this).attr('value');	
			}
		});
		$.data(document.body,'params_pagination',filterQueryString);
		return(filterQueryString);
	}
	
	//TODO: change keydown for keyup
	$('div#modal-search-account input#username').live("keydown",function(event){
		var keypressed = (document.all)? event.keyCode : event.which;
		var actual_value = ($(this).val()==undefined)?"":$(this).val();
		if((keypressed != 13)&&(keypressed != 8)){
			if($(this).val().length>=3){
				var actual_key = String.fromCharCode(keypressed);
				actual_key = actual_key.toLowerCase();
				request.abort();
				$.callPrivateService('gameaccount-fastsearch-forusername','&searchstring='+actual_value+actual_key+'&idtype=2&top=10',true);	
			}
		}
	});

	$(document).live('ajaxStart',function(){
		if(!$(':focus').hasClass('no-load')){ //Disabled in fastsearch
			var wait = setInterval(function(){
				if($('span#loading-icon').length!=0){
					clearInterval(wait);
					$('span#loading-icon').show();
				}
			},100);
		}
	}).live('ajaxStop',function(){
		if(!$(':focus').hasClass('no-load')){
		var wait2 = setInterval(function(){
			if($('span#loading-icon').is(':visible')){
				clearInterval(wait2);
				$('span#loading-icon').hide();
			}
		},100);
		}
		//$('span#loading-icon, span#loading-icon-modal').hide();
	})/*.live('ajaxError',function(){
			$('span#loading-icon').hide();
		},100)*/;
		//$('span#loading-icon, span#loading-icon-modal').hide();
		
		
		
		
})(jQuery);
