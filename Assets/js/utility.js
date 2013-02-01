/*document.body data:
 * - params_pagination : params that use the pagination function to when the callfunction is called.
 */

function replaceUndefined(value){
	if((value=='')||(value==undefined))  	
    	return (' - ')   
    return value;
}

function getURLParameter(name) {
    return decodeURI(
       (RegExp(name + '=' + '(.*?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function replaceEmpty(value){
	if(value==''){
		return "null";
	}else{
		return value;
	}
}

function normalizeDateTime(date_input){
	if((date_input=="")||(date_input==undefined)){
		return "";
	}
	//date_input =completeDateDigitsYMD(date_input);
	var ugly_input;
	if(date_input.indexOf("T")>0){
		ugly_input = date_input.split("T");
	}else{
		ugly_input = date_input.split(" ");
	}
	var normal_date = normalizeDate(ugly_input[0]);
	var normal_time = ugly_input[1];
	return (normal_date+" "+normal_time);
};

$(' div[data-toggle=buttons-radio] button').die('click').live('click', function(event){
	event.preventDefault();
	var $this = $(this);
	var value_selected = $(this).attr('value');
	if(!$this.hasClass('disabled')){
		$this.closest('.btn-group').attr('value',value_selected)
				.find('button.active').removeClass('active')
				.end()
			.end().addClass('active');
	}
});

//Date format yyyy-m-d h:m:s  Return: 30 days before
function getPreviousMonthFirstDay(date){
	var current_date = date.split("-");
	var prevMonth = parseInt(current_date[1]);
	prevMonth--;
	var prevYear = parseInt(current_date[0]);
	if(prevMonth<1){
		prevMonth = 12;
		prevYear--;
	}
	return(prevYear+"-"+prevMonth+"-1 0:0:0");	
}

function getNextMonthFirstDay(date,dateTop){
	var current_date = date.split("-");
	var nextMonth = parseInt(current_date[1]);
	nextMonth++;
	var nextYear = parseInt(current_date[0]);
	
	if(dateTop!=false){
		var top_date_time = dateTop.split("-");
		var top_month = parseInt(top_date_time[1]);
		var top_year = parseInt(top_date_time[0]);
		
		if((nextMonth>=top_month)&&(nextYear>=top_year)){
			return dateTop;
		}	
	}
	if(nextMonth>12){
		nextMonth = 1;
		nextYear++;
	}
	return(nextYear+"-"+nextMonth+"-1 0:0:0");	
}

function getCurrentMonthFirstDay(date){
	var current_date;
	if(date.indexOf(':')){
		current_date = date.split(" ");
		current_date = current_date[0];
	}
	current_date = date.split("-");
	
	return(current_date[0]+"-"+current_date[1]+"-1 0:0:0");	
}


$.fn.fastSearch = function( options ) {
	var params=[];  
	var $this=$(this);
	var fastSearch = {
		config : {
			id_keysearch_input: 'null',
			id_input_result: 'null',
			id_type_search: '0',
			id_account: '',//Search from root
			top: '20',
			include_parent: '0',
			default_value: '',
			only_direct: '0'
		},
		info : {
			list_accounts : [],
			id_accounts_list: [],
			balance_accounts_list: []
	
		},
		init : function(config){
			$.extend(this.config, options);
			var type_search = (fastSearch.config.id_type_search=='0')?'':'&idtype='+fastSearch.config.id_type_search;
			$('input#'+fastSearch.config.id_input_result).val(fastSearch.config.default_value);
			fastSearch.config.id_keysearch_input=$this.attr('id');
			$this.off('keyup').on('keyup',function(event){
				var key=(document.all) ? event.keyCode : event.which; 
				var search_string = $(this).val();
				if((search_string.length>3)&&(key!=13)&&(key!=37)&&(key!=38)&&(key!=39)&&(key!=40)&&(key!=undefined)){
					$('input#'+fastSearch.config.id_input_result).val(fastSearch.config.default_value).change();
					if(request!=undefined) request.abort();
					params=[];
					params.push(fastSearch.config);
					params.push(fastSearch.info);
					//$.callPrivateService('gameaccount-fastsearch-forusername','&searchstring='+search_string+'&top='+fastSearch.config.top+'&'+type_search+'&idaccount='+fastSearch.config.id_account,true,params);
					$.callPrivateService('gameaccount-fastsearch-forusername','&searchstring='+search_string+'&top='+fastSearch.config.top+'&'+type_search+'&idaccount='+fastSearch.config.id_account+'&includeparent='+fastSearch.config.include_parent+'&onlydirect='+fastSearch.config.only_direct,true,params);
				}else{
					if(key==13){
						//$('input#'+fastSearch.config.id_input_result).val(fastSearch.info.id_accounts_list[$('#'+fastSearch.config.id_keysearch_input)]);			
					}	
				}
			}).keydown(function(event) {
				var key=(document.all) ? event.keyCode : event.which; 
				if(key==13){
					event.preventDefault();			
				}
			}).off('blur').on('blur',function(){
				setTimeout(function(){
				var name_selected = $this.val();
				var value_selected = (fastSearch.info.id_accounts_list[name_selected]!=undefined)?fastSearch.info.id_accounts_list[name_selected]:fastSearch.config.default_value;
				$('input#'+fastSearch.config.id_input_result).val(value_selected);
				$('input#'+fastSearch.config.id_input_result).change();
				},200);
			});
		}
	};
	
	$('body').off('dataretrieved-gameaccount-fastsearch-forusername').on("dataretrieved-gameaccount-fastsearch-forusername", function(e, xml,params){
				params[1].list_accounts = [];
				params[1].id_accounts_list = [];
				params[1].balance_accounts_list = [];
				$('registers register',xml).each(function(){
					params[1].list_accounts.push($(this).attr('username'));
					params[1].id_accounts_list[$(this).attr('username')]=$(this).attr('idaccount');
					params[1].balance_accounts_list[$(this).attr('username')]=$(this).attr('balance');
				});
				
				var autocomplete = $('#'+params[0].id_keysearch_input).typeahead();
					autocomplete.data('typeahead').source = params[1].list_accounts; //where newSource is your own array
					$('#'+params[0].id_keysearch_input).trigger('keyup');
			});	
    
    fastSearch.init(options);

  };

/*FastSearch Nickname*/
$.fn.fastSearchNickname = function( options ) {
	var params=[];  
	var $this=$(this);
	var fastSearch = {
		config : {
			id_keysearch_input: 'null',
			id_input_result: 'null',
			id_type_search: '0',
			id_account: '',//Search from root
			top: '20',
			default_value: '',
			include_parent: '0',
			only_direct: '0'
		},
		info : {
			list_accounts : [],
			id_accounts_list: [],
			balance_accounts_list: []
	
		},
		init : function(config){
			$.extend(this.config, options);
			var type_search = (fastSearch.config.id_type_search=='0')?'':'&idtype='+fastSearch.config.id_type_search;
			$('input#'+fastSearch.config.id_input_result).val(fastSearch.config.default_value);
			//$('input#'+fastSearch.config.id_keysearch_input).off('keyup').on('keyup',function(event){
			fastSearch.config.id_keysearch_input=$this.attr('id');
			$this.off('keyup').on('keyup',function(event){
				var key=(document.all) ? event.keyCode : event.which; 
				var search_string = $(this).val();
				if((search_string.length>3)&&(key!=13)&&(key!=37)&&(key!=38)&&(key!=39)&&(key!=40)&&(key!=undefined)){
					$('input#'+fastSearch.config.id_input_result).val(fastSearch.config.default_value).change();
					if(request!=undefined) request.abort();
					params=[];
					params.push(fastSearch.config);
					params.push(fastSearch.info);
					$.callPrivateService('gameaccount-fastsearch-fornickname','&searchstring='+search_string+'&top='+fastSearch.config.top+'&'+type_search+'&idaccount='+fastSearch.config.id_account+'&includeparent='+fastSearch.config.include_parent+'&onlydirect='+fastSearch.config.only_direct,true,params);
				}else{
					if(key==13){			
					}	
				}
			}).keydown(function(event) {
				var key=(document.all) ? event.keyCode : event.which; 
				if(key==13){
					event.preventDefault();			
				}
			}).off('blur').on('blur',function(){
				setTimeout(function(){
					var name_selected = $this.val();
					var value_selected = (fastSearch.info.id_accounts_list[name_selected]!=undefined)?fastSearch.info.id_accounts_list[name_selected]:fastSearch.config.default_value;
					$('input#'+fastSearch.config.id_input_result).val(value_selected);
					$('input#'+fastSearch.config.id_input_result).change();
				},200);
			});
		}
	};
	
	$('body').off('dataretrieved-gameaccount-fastsearch-fornickname').on("dataretrieved-gameaccount-fastsearch-fornickname", function(e, xml,params){
				params[1].list_accounts = [];
				params[1].id_accounts_list = [];
				params[1].balance_accounts_list = [];
				$('registers register',xml).each(function(){
					params[1].list_accounts.push($(this).attr('nickname'));
					params[1].id_accounts_list[$(this).attr('nickname')]=$(this).attr('idaccount');
					params[1].balance_accounts_list[$(this).attr('nickname')]=$(this).attr('balance');
				});
				
				var autocomplete = $('#'+params[0].id_keysearch_input).typeahead();
					autocomplete.data('typeahead').source = params[1].list_accounts; //where newSource is your own array
					$('#'+params[0].id_keysearch_input).trigger('keyup');
			});	
    
    fastSearch.init(options);

  };

/*Pagination*/
var pagination = {
	config : {
		pagesnavigation : 8,
		totalpages : 1,
		currentpage : 1,
		callfunction : 'callfunction',
		pagingDivId : 'container-pagination',
		actionName : 'action-undefined',
		
	},
	
	init: function(config){
		$.extend(this.config, config);
		//var pagingDivId = (pagination.config.pagingDivId != '') ? pagination.config.pagingDivId : 'container-pagination';
		var pagingDivId = pagination.config.pagingDivId;
		var prev_enabled= (pagination.config.currentpage==1)?'disabled':'enabled';
		var next_enabled= (pagination.config.currentpage==pagination.config.totalpages)?'disabled':'enabled';
		var output_pages_navigation="";
		var enabled_page;
		var max_index = (pagination.config.totalpages < pagination.config.pagesnavigation)?pagination.config.totalpages : pagination.config.pagesnavigation;
		var first_page = (parseInt(pagination.config.currentpage)-(parseInt(max_index)/2) < 1)? 1 : parseInt(pagination.config.currentpage)-(parseInt(max_index)/2);
		var last_page = (parseInt(pagination.config.currentpage)+((parseInt(max_index)/2)-1) < pagination.config.totalpages)? parseInt(pagination.config.currentpage)+((parseInt(max_index)/2)-1) : pagination.config.totalpages;
		var rest_page = parseInt(max_index)-(last_page-first_page+1);
		if(first_page==1){
			last_page+=rest_page;
		}else{
			first_page-=rest_page;
		}
		for(i=first_page;i<=last_page;i++){
			enabled_page = (i==pagination.config.currentpage)? 'active' : 'unactive';
			output_pages_navigation+="<li class='"+enabled_page+"'><a href='#'>"+i+"</a></li>";
		}
		$('div#' + pagingDivId).html("<div class='pagination' actionname='"+pagination.config.actionName+"' pagesnavigation='"+pagination.config.pagesnavigation+"' totalpages='"+pagination.config.totalpages+"' callfunction='"+pagination.config.callfunction+"' params='"+pagination.config.params+"' current-page='"+pagination.config.currentpage+"'><ul><li class='first "+prev_enabled+"'><a href='#'>"+tr('first')+"</a></li><li class='prev "+prev_enabled+"'><a href='#'>«</a></li>"+output_pages_navigation+"<li class='next "+next_enabled+"'><a href='#'>»</a></li><li class='last "+next_enabled+"'><a href='#'>"+tr('last')+"</a></li></ul></div>")
		.find('li.next.enabled a').on('click',function(){
			var $currentPagination = $(this).closest('div.pagination');
			var page_number = parseInt($currentPagination.attr('current-page'))+1;
			var action_name = $currentPagination.attr('callfunction');
			var parameters_qs = $currentPagination.attr('params');
			var action_name = $currentPagination.attr('actionname');
			$.callPrivateService(pagination.config.callfunction,pagination.config.params+"&pagenumber="+page_number,true,action_name);
		}).end()
		.find('li.prev.enabled a').on('click',function(){
			var $currentPagination = $(this).closest('div.pagination');
			var page_number = parseInt($currentPagination.attr('current-page'))-1;
			var action_name = $currentPagination.attr('callfunction');
			var parameters_qs = $currentPagination.attr('params');
			var action_name = $currentPagination.attr('actionname');
			$.callPrivateService(pagination.config.callfunction,pagination.config.params+"&pagenumber="+page_number,true,action_name);
		}).end()
		.find('li.unactive a').on('click',function(){
			var $currentPagination = $(this).closest('div.pagination');
			var page_number= parseInt($(this).text());
			var action_name = $currentPagination.attr('callfunction');
			var parameters_qs = $currentPagination.attr('params');
			var action_name = $currentPagination.attr('actionname');
			$.callPrivateService(pagination.config.callfunction,pagination.config.params+"&pagenumber="+page_number,true,action_name);
		}).end()
		.find('li.first.enabled a').on('click',function(){
			var $currentPagination = $(this).closest('div.pagination');
			var page_number = 1;
			var action_name = $currentPagination.attr('callfunction');
			var parameters_qs = $currentPagination.attr('params');
			var action_name = $currentPagination.attr('actionname');
			$.callPrivateService(pagination.config.callfunction,pagination.config.params+"&pagenumber="+page_number,true,action_name);
		}).end()
		.find('li.last.enabled a').on('click',function(){
			var $currentPagination = $(this).closest('div.pagination');
			var page_number = parseInt($currentPagination.attr('totalpages'));
			var action_name = $currentPagination.attr('callfunction');
			var parameters_qs = $currentPagination.attr('params');
			var action_name = $currentPagination.attr('actionname');
			$.callPrivateService(pagination.config.callfunction,pagination.config.params+"&pagenumber="+page_number,true,action_name);
		});
	}
}

/*Search banking*/
$('button.filter-banking').live('click',function(event){
	event.preventDefault();
	var $container = $(this).closest('div#modal-account-selection').find('div.modal-body table.table-accounts tbody');
       var search_string = $(this).prev().val();
       var current_nick;
       var current_user;
       var cont_rows=0;
       $('button.button-waiting').prev().hide().end().show();
       var wait1 = setInterval(function(){
				       	if($('button.button-waiting').is(':visible')){
				       		clearInterval(wait1);
				       		 if(search_string!=""){
							       	search_string = search_string.toLowerCase();
							       	$('tr',$container).each(function(){
							       		cont_rows++;
							       		 current_nick = $(this).attr('nickname');
							       		 current_user = $(this).attr('username');
							       		if((current_user.toLowerCase().indexOf(search_string)!=-1)||((current_nick!="-")&&(current_nick.toLowerCase().indexOf(search_string)!=-1))){
							       			$(this).show();
							       		}else{
							       			$(this).hide();
							       		}
							       	});
								}else{
							       		$('tr',$container).show();
							     }
				       	}
				       },200);
				       
	 var wait2 = setInterval(function(){
	 	if((cont_rows>=$('tr',$container).length)&&( $('button.button-waiting').is(':visible'))){
	 		clearInterval(wait2);
	 		$('button.button-waiting').hide().prev().show();
	 	}
	 },200);
});


$('div#modal-account-selection form.form-search input.search-query').live('keyup',function(event){
	var key=(document.all) ? event.keyCode : event.which; //Only IE understand document.all
   if(key==13){// 13 = enter
   	$('button.filter-banking').trigger('click');
   	/*
       var $container = $(this).closest('div#modal-account-selection').find('div.modal-body table.table-accounts tbody');
       var search_string = $(this).val();
       var current_nick;
       var current_user;
       if(search_string!=""){
       	search_string = search_string.toLowerCase();
       	$('tr',$container).each(function(){
       		 current_nick = $(this).attr('nickname');
       		 current_user = $(this).attr('username');
       		if((current_user.toLowerCase().indexOf(search_string)!=-1)||((current_nick!="-")&&(current_nick.toLowerCase().indexOf(search_string)!=-1))){
       			$(this).show();
       		}else{
       			$(this).hide();
       		}
       	});	
       	*/
       }
   
}).live('keydown',function(e){
	var key=(document.all) ? e.keyCode : e.which; //Only IE understand document.all
   if(key==13){// 13 = enter
   		e.preventDefault();
   	}
});


function randomString() {
	var string_length = 8;
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	
	return randomstring;
}

var alertBox = {
	config: {
		message : "This is an alert box",
		type_alert : "alert-success",
		id_location : "body"
	},
	init: function(config){
		$.extend(this.config, config);
		var alert_output = "<div class='alert "+alertBox.config.type_alert+"'>"+
								"<a class='close' data-dismiss='alert'>×</a>"+
								alertBox.config.message+	
							"</div>";
		$('#'+alertBox.config.id_location).append(alert_output);
		alertBox.show();
		var t=setTimeout("alertBox.remove()",3000);
	},
	show: function(){
		$('#'+alertBox.config.id_location).find('div.alert').show();
	},
	
	remove: function(){
		$('#'+alertBox.config.id_location).find('div.alert').remove();
	}
};

function currency(amount)
{
	var delimiter = ","; // replace comma if desired

	var minus = '';
	var n = new String(amount);
	var a = [];
	while(n.length > 3)
	{
		var nn = n.substr(n.length-3);
		a.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	if(n.length > 0) { a.unshift(n); }
	n = a.join(delimiter);
	amount = n; 
	amount = minus + amount;
	return amount;
};

function getNow(){
	var current_date = new Date();
	var current_month = parseInt(current_date.getMonth())+1;
	return(current_date.getFullYear()+"-"+current_month+"-"+current_date.getDate()+" "+current_date.getHours()+":"+current_date.getMinutes()+":"+current_date.getSeconds());
}

function getToday(){
	var current_date = new Date();
	var current_month = parseInt(current_date.getMonth())+1;
	return(current_date.getFullYear()+"-"+current_month+"-"+current_date.getDate()+" 0:0:0");
}

function completeDateDigits(dateTime){
	var date_formated="";
	var section_date=dateTime;
	var section_time="";
	if(dateTime.indexOf(' ')!=-1){ //Date with time
		var date_time = dateTime.split(' ');
		section_time=date_time[1];
		section_date=date_time[0];
		section_time = section_time.split(':');
		var hours_t = (section_time[0].length<=1)?"0"+section_time[0]:section_time[0];
		var minutes_t = (section_time[1].length<=1)?"0"+section_time[1]:section_time[1];
		var sec_t ="" 
		if(section_time[2]!=undefined){
			sec_t = (section_time[2].length<=1)?":0"+section_time[2]: ":"+section_time[2];
		}
		section_time = " "+hours_t+":"+minutes_t+sec_t;
	}
	section_date = section_date.split('/');
	var day_d = (section_date[0].length<=1)?"0"+section_date[0]:section_date[0];
	var month_d = (section_date[1].length<=1)?"0"+section_date[1]:section_date[1];
	var year_d = section_date[2];
	section_date = day_d+"/"+month_d+"/"+year_d;
	date_formated = section_date+section_time;
	return date_formated;
}


function completeDateDigitsYMD(dateTime){
	var date_formated="";
	var section_date=dateTime;
	var section_time="";
	var separator;
	if((dateTime.indexOf(' ')!=-1)||(dateTime.indexOf('T')!=-1)){ //Date with time
		var date_time;
		if((dateTime.indexOf(' ')!=-1)){
			separator=' ';
			date_time = dateTime.split(' ');	
		}else{
			separator='T';
			date_time = dateTime.split('T');
		}
		section_time=date_time[1];
		section_date=date_time[0];
		section_time = section_time.split(':');
		var hours_t = (section_time[0].length<=1)?"0"+section_time[0]:section_time[0];
		var minutes_t = (section_time[1].length<=1)?"0"+section_time[1]:section_time[1];
		var sec_t ="" 
		if(section_time[2]!=undefined){
			sec_t = (section_time[2].length<=1)?":0"+section_time[2]: ":"+section_time[2];
		}
		section_time = separator+hours_t+":"+minutes_t+sec_t;
	}
	section_date = section_date.split('-');
	var year_d = (section_date[2].length<=1)?"0"+section_date[2]:section_date[2];
	var month_d = (section_date[1].length<=1)?"0"+section_date[1]:section_date[1];
	var day_d = section_date[0];
	section_date = year_d+"-"+month_d+"-"+day_d;
	date_formated = section_date+section_time;
	return date_formated;
}


function formatDate(dateTime){
	
	if((dateTime==" - ")||(dateTime=="")||(dateTime==" ")||(dateTime=="-")){
		return(dateTime);
	}
		/*var amountRegExp = /^((([0-9]{4})((\-[0-9][0-9]){2})(\s[0-9]{2}(\:[0-9]{2}){1,2})?)|(([0-9]{2})((\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]))((\s|T)[0-9]{2}(\:[0-9]{2}){1,2})?))?$/;
		if(!amountRegExp.test(dateTime)){
			
       		return (dateTime);//Format Not Valid
   		}else{*/
   			var current_time='';
   			var current_date='';
   			if(dateTime.indexOf(' ')!=-1){ //Date with time
   				dateTime=dateTime.split(' ');
   				current_date = dateTime[0];
   				current_time = " "+dateTime[1];
   			}else{
   				if(dateTime.indexOf('T')!=-1){
   					dateTime=dateTime.split('T');
   					current_date = dateTime[0];
   					current_time = " "+dateTime[1];	
   				}else{
   					current_date = dateTime;	
   				}
   			}
   			if(current_date.indexOf('\/')!=-1){//input format 00/00/0000
   				current_date = current_date.split('\/');
   				return(current_date[2]+"-"+current_date[1]+"-"+current_date[0]+current_time);
   			}else{//input format 0000-00-00
   				current_date = current_date.split('\-');
   				return(current_date[2]+"/"+current_date[1]+"/"+current_date[0]+current_time);
   			}
   		/*}*/
	};


function clearLeftNumber(number_str){
	number_str = number_str.toString();
	number_str = number_str.replace(/^\++/,'');
	number_str = number_str.replace(/^0+/,'');
	number_str = number_str.replace(/^\.+/,'0.');	
	return number_str;
}


//Accept yyyy-mm-dd hh:mm:ss , yyyy-mm-ddThh:mm:ss , or without time.
//timezone is destination timezone offset in UTC (timezone is destination timezone, the algorithm get local timezone iside de code)
function changeTimeZone(time,timezone){
	var local_date = time;
	var local_time = "00:00:00";
	var local_year = "";
	var local_month = "";
	var local_day = "";
	var local_hour = "";
	var local_min = "";
	var local_sec = "";
	
	if(time.indexOf(" ")!=-1){//separator backspace
		time=time.split(" ");
		local_date = time[0];
		local_time = time[1];
	}else{
		if(time.indexOf("T")!=-1){//separator T
			time=time.split("T");
			local_date = time[0];
			local_time = time[1];
		}
	}
	local_date = local_date.split('-');
	local_year = clearLeftNumber(local_date[0]);
	local_month = parseInt(clearLeftNumber(local_date[1]))-1;
	local_day = clearLeftNumber(local_date[2]);
	
	local_time = local_time.split(':');
	local_hour = clearLeftNumber(local_time[0]);
	local_min = clearLeftNumber(local_time[1]);
	local_sec = (local_time[2]!=undefined)?clearLeftNumber(local_time[2]):"0";
	
	var current_date_real = new Date(local_year,local_month,local_day,local_hour,local_min,local_sec,0);
	var local_timezone_offset = parseInt(clearLeftNumber($.getGMT())); 
	var offsetUTC = local_timezone_offset*60*60*1000;
	var local_UTC = (current_date_real.getTime())-offsetUTC;
	var timezone_msec = parseInt(timezone)*60*60*1000;
	var destination_UTC = local_UTC + timezone_msec;
	
	var output_date = new Date(destination_UTC);
	var month_output =parseInt(output_date.getMonth())+1;
	
	return(output_date.getFullYear()+"-"+month_output+"-"+output_date.getDate()+" "+output_date.getHours()+":"+output_date.getMinutes()+":"+output_date.getSeconds());
}


//Accept yyyy-mm-dd hh:mm:ss , yyyy-mm-ddThh:mm:ss , or without time.
//timezone is destination timezone offset in UTC (timezone is destination timezone ergo localtimezone $.getGMT())
function changeServerTimeZoneToLocal(time,timezone){
	if((time=="")||(time=="-")){
		return time;	
	} 
	timezone = parseInt(clearLeftNumber(timezone));
	var local_date = time;
	var local_time = "00:00:00";
	var local_year = "";
	var local_month = "";
	var local_day = "";
	var local_hour = "";
	var local_min = "";
	var local_sec = "";
	var separator = " ";
	if(time.indexOf(" ")!=-1){//separator backspace
		time=time.split(" ");
		local_date = time[0];
		local_time = time[1];
	}else{
		if(time.indexOf("T")!=-1){//separator T
			time=time.split("T");
			local_date = time[0];
			local_time = time[1];
			separator="T";
		}
	}
	local_date = local_date.split('-');
	local_year = clearLeftNumber(local_date[0]);
	local_month = parseInt(clearLeftNumber(local_date[1]))-1;
	local_day = clearLeftNumber(local_date[2]);
	
	local_time = local_time.split(':');
	local_hour = clearLeftNumber(local_time[0]);
	local_min = clearLeftNumber(local_time[1]);
	local_sec = (local_time[2]!=undefined)?clearLeftNumber(local_time[2]):"0";
	var current_date_real = new Date(local_year,local_month,local_day,local_hour,local_min,local_sec,0);
	var local_timezone_offset = parseInt(clearLeftNumber(SERVER_TIMEZONE));
	var offsetUTC = local_timezone_offset*60*60*1000;
	var local_UTC = (current_date_real.getTime())-offsetUTC;
	var timezone_msec = parseInt(timezone)*60*60*1000;
	var destination_UTC = local_UTC + timezone_msec;
	var output_date = new Date(destination_UTC);
	var month_output =parseInt(output_date.getMonth())+1;
	return(output_date.getFullYear()+"-"+month_output+"-"+output_date.getDate()+separator+output_date.getHours()+":"+output_date.getMinutes()+":"+output_date.getSeconds());
}


function FD(dateTime){
		//var amountRegExp = /^((([0-9]{4})((\-[0-9][0-9]){2})(\s[0-9]{2}(\:[0-9]{2}){1,2})?)|(([0-9]{2})((\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]))((\s|T)[0-9]{2}(\:[0-9]{2}){1,2})?))?$/;
		var amountRegExp = /^((([0-9]{4})((\-[0-9][0-9]){2})(\T[0-9]{2}(\:[0-9]{2}){1,2}(\.[0-9]{3})?)?)|(([0-9]{2})((\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]))((T)[0-9]{2}(\:[0-9]{2}){1,2})?))?$/;
		if(!amountRegExp.test(dateTime)){
			
       		return (dateTime);//Format Not Valid
   		}else{
   			var current_time='';
   			var current_date='';
   			if(dateTime.indexOf('.')!=-1){
   				dateTime = dateTime.slice(0,dateTime.indexOf('.'))
   			}
   			if(dateTime.indexOf('T')!=-1){ //Date with time
   				dateTime=dateTime.split('T');
   				current_date = dateTime[0];
   				current_time = " "+dateTime[1];
   			}else{
   				if(dateTime.indexOf('T')!=-1){
   					dateTime=dateTime.split(' ');
   					current_date = dateTime[0];
   					current_time = " "+dateTime[1];	
   				}else{
   					current_date = dateTime;	
   				}
   			}
   			if(current_date.indexOf('\/')!=-1){//input format 00/00/0000
   				current_date = current_date.split('\/');
   				return(current_date[2]+"-"+current_date[1]+"-"+current_date[0]+current_time);
   			}else{//input format 0000-00-00
   				current_date = current_date.split('\-');
   				return(current_date[2]+"/"+current_date[1]+"/"+current_date[0]+current_time);
   			}
   		}
	};


function subYears(n){
	
	/*
	var today = new Date();
	today.setFullYear(today.getFullYear()-17);
	*/
};

(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

$(function(){

  /*
  // Bind the event.
  $(window).hashchange( function(){
    // Alerts every time the hash changes!
    //alert( location.hash );
	
  });
*/

 // $(window).hashchange();
//  $(window).hashchange();

});

$('form.create-agent a.reference-my-account, form.create-player a.reference-my-account, form.create-affiliate a.reference-my-account').die('click').live('click',function(event){
	event.preventDefault();
	$('strong.name-reference-account').text('My Account');
	$('input#reference').val($.getId());
});

function getChipClassName(blind_value){
	var class_name;
	switch(blind_value){
		case "0.01":
			class_name='chip-1c';
		break;
		case "0.02":
			class_name='chip-2c';
		break;
		case "0.05":
			class_name='chip-5c';
		break;
		case "0.10":
			class_name='chip-10c';
		break;
		case "0.15":
			class_name='chip-15c';
		break;
		case "0.25":
			class_name='chip-25c';
		break;
		case "0.50":
			class_name='chip-50c';
		break;
		case "0.75":
			class_name='chip-75c';
		break;
		case "1.00":
			class_name='chip-1';
		break;
		case "1.50":
			class_name='chip-1-50c';
		break;
		case "2.00":
			class_name='chip-2';
		break;
		case "2.50":
			class_name='chip-2-50c';
		break;
		case "3.00":
			class_name='chip-3';
		break;
		case "3.50":
			class_name='chip-3-50c';
		break;
		case "4.00":
			class_name='chip-4';
		break;
		case "5.00":
			class_name='chip-5';
		break;
		case "6.00":
			class_name='chip-6';
		break;
		case "10.00":
			class_name='chip-10';
		break;
		case "20.00":
			class_name='chip-20';
		break;
		case "25.00":
			class_name='chip-25';
		break;
		case "40.00":
			class_name='chip-40';
		break;
		case "50.00":
			class_name='chip-50';
		break;
		case "100.00":
			class_name='chip-100';
		break;
		case "500.00":
			class_name='chip-500';
		break;
		case "1000.00":
			class_name='chip-1k';
		break;
		case "5000.00":
			class_name='chip-5k';
		break;
		case "25000.00":
			class_name='chip-25k';
		break;
		case "100000.00":
			class_name='chip-100k';
		break;
		case "500000.00":
			class_name='chip-500k';
		break;
		case "1000000.00":
			class_name='chip-1m';
		break;
		case "5000000.00":
			class_name='chip-5m';
		break;
		case "d":
			class_name='chip-d';
		break;
		default:
			class_name='chip-empty';
	};
	return class_name;
};


//date2 (or 'now') -date1 dd/mm/yyyy HH:MM:SS
//return [d,h,m]
function diffDate(date1,date2){
	if(date2=='now'){
		var date_now=new Date();
		date2 = date_now.getDate()+'/'+parseInt(parseInt(date_now.getMonth())+parseInt(1))+'/'+date_now.getFullYear()+' '+date_now.getHours()+':'+date_now.getMinutes()+':'+date_now.getSeconds();
	}
	var splitd1=date1.split(' ');
	var splitd2=date2.split(' ');
	var dd1=splitd1[0];
	var dd2=splitd2[0];
		dd1=dd1.split('/');
		dd2=dd2.split('/');
	var tt1=splitd1[1];
	var tt2=splitd2[1];
		tt1=tt1.split(':');
		tt2=tt2.split(':');
	var normalized_month1 = dd1[1];
		normalized_month1 = normalized_month1.replace(/^0/g, '');
		normalized_month1 = parseInt(normalized_month1)-1;
	var normalized_day1 = dd1[0];
		normalized_day1 = normalized_day1.replace(/^0/g, '');
		normalized_day1 = parseInt(normalized_day1);
	var normalized_hour1 = tt1[0];
		normalized_hour1 = normalized_hour1.replace(/^0/g, '');
		normalized_hour1 = parseInt(normalized_hour1);
	var normalized_min1 = tt1[1];
		normalized_min1 = normalized_min1.replace(/^0/g, '');
		normalized_min1 = parseInt(normalized_min1);
	var normalized_sec1 = tt1[2];
		normalized_sec1 = normalized_sec1.replace(/^0/g, '');
		normalized_sec1 = parseInt(normalized_sec1);
	var normalized_month2 = dd2[1];
		normalized_month2 = normalized_month2.replace(/^0/g, '');
		normalized_month2 = parseInt(normalized_month2)-1;
	var normalized_day2 = dd2[0];
		normalized_day2 = normalized_day2.replace(/^0/g, '');
		normalized_day2 = parseInt(normalized_day2);
	var normalized_hour2 = tt2[0];
		normalized_hour2 = normalized_hour2.replace(/^0/g, '');
		normalized_hour2 = parseInt(normalized_hour2);
	var normalized_min2 = tt2[1];
		normalized_min2 = normalized_min2.replace(/^0/g, '');
		normalized_min2 = parseInt(normalized_min2);
	var normalized_sec2 = tt1[2];
		normalized_sec2 = normalized_sec2.replace(/^0/g, '');
		normalized_sec2 = parseInt(normalized_sec2);
	var d1=new Date(parseInt(dd1[2]),normalized_month1,normalized_day1,normalized_hour1,normalized_min1,normalized_sec1,0);
	var d2=new Date(parseInt(dd2[2]),normalized_month2,normalized_day2,normalized_hour2,normalized_min2,normalized_sec2,0);
	var time_r= d2.getTime()-d1.getTime();
	var days= parseInt(time_r/86400000);
	time_r=time_r%86400000;
	var hours= parseInt (time_r/3600000);
	time_r=time_r%3600000;
	var minutes = parseInt(time_r/60000);
	time_r=time_r%60000;
	var result = new Array();
	result[0]=days;
	result[1]=hours;
	result[2]=minutes;
	return result;
};

(function($){
	 
    $.fn.extend({ 
         /*
          * @function datepresetpicker()
          * 
          * @params datepresetname - name of datepresetfield that is varchar to set it on null
          * 		datefromid - id of date from field
          * 		datetoid - id of date to field
          * 
          * @usage $(select_input_element).datepresetname()
          * 
          *  */
        //pass the options variable to the function
    	datepresetpicker: function(options,callback) {
    		

 
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                datepresetname: 'param1',
                datefromid: 'data-range-from',
                datetoid: 'data-range-to'
            }
                 
            var options =  $.extend(defaults, options);
 
            return this.each(function() {
                var o = options;
                 
                //code to be inserted here
                //you can access the value like this
                var datePresets = "<option value='null'>Manual</option>" + 
                		"<option value='today'>Today</option>" +
                		"<option value='yesterday'>Yesterday</option>" +
                		"<option value='currentweek'>Current week</option>" +
                		"<option value='lastweek'>Last week</option>" +
                		"<option value='currentmonth'>Current month</option>" +
                		"<option value='lastmonth'>Last month</option>" +
                		"<option value='currenttrimester'>Current trimester</option>" +
                		"<option value='currentsemester'>Current semester</option>" +
                		"<option value='currentyear'>Current year</option>";
                $(this).html(datePresets);
                
                Date.prototype.getPastWeekDay = function () {
                        var next = this;
                        var next3 = new Date(this.getFullYear(), this.getMonth(), this.getDate());
                        var dif = new Date(); // Today's date
                        dif = (next3.getDay() + 6) % 7; // Number of days to subtract
                        next = new Date(next - dif * 24*60*60*1000); // Do the subtraction
                        return {from: next, to: new Date()};
                }
                Date.prototype.getLastWeekDay = function () {
                        var next = new Date(this.getFullYear(), this.getMonth(), this.getDate());
                        var dif = new Date(); // Today's date
                        dif = (next.getDay() + 6) % 7; // Number of days to subtract
                        dif += 1;
                        next2 = new Date(next - dif * 24*60*60*1000); // Do the subtraction
                        dif += 6;
                        next = new Date(next - dif * 24*60*60*1000); // Do the subtraction
                        return {from: next, to: next2};
                }
                Date.prototype.getToday = function () {
                        var next = this;
                        var next3 = new Date(this.getFullYear(), this.getMonth(), this.getDate());
                        var dif = new Date(); // Today's date
                        dif = 0;
                        next2 = new Date(next3 - dif * 24*60*60*1000); // Do the subtraction
                        return {from: next2, to: next};
                }
                Date.prototype.getYesterday = function () {
                        var next = new Date(this.getFullYear(), this.getMonth(), this.getDate());
                        var dif = new Date(); // Today's date
                        dif = 1;
                        next2 = new Date(next - dif * 24*60*60*1000); // Do the subtraction
                        return {from: next2, to: next};
                }
                Date.prototype.getCMonth = function () {
                    	var next = this;
		                var next2 = new Date(next.getFullYear(), next.getMonth(), 1);
		                return {from: next2, to: next};
                }
                Date.prototype.getLMonth = function () {
                    	var next = new Date(this.getFullYear(), this.getMonth(), this.getDate());
                    	
		                var next2 = new Date(next.getFullYear(), next.getMonth(), 0);
		                next = new Date(next.getFullYear(), next.getMonth()-1, 1);
		                return {from: next, to: next2};
                }
                Date.prototype.getCYear = function () {
                    	var next = this;
		                var next2 = new Date(next.getFullYear(), 0, 1);
		                return {from: next2, to: next};
                }
                Date.prototype.getLYear = function () {
                    	var next = new Date(this.getFullYear(), this.getMonth(), this.getDay());
		                var next2 = new Date(next.getFullYear(), 0, 1);
		                next = new Date(next.getFullYear()-1, 0, 1);
		                return {from: next, to: next2};
                }
                
                var currentTime = new Date();
                var cweek = currentTime.getPastWeekDay();
                var lweek = currentTime.getLastWeekDay();
                var today = currentTime.getToday();
                var yesterday = currentTime.getYesterday();
                var cmonth = currentTime.getCMonth();
                var lmonth = currentTime.getLMonth();
                var cyear = currentTime.getCYear();
                var lyear = currentTime.getLYear();
                
                $(this).change(function(){
                	var selectedvalue = $(this).val();
                	if(selectedvalue == "null"){
                		$("input[name='"+o.datepresetname+"']").val('null');
                		$("#"+o.datefromid).datepicker('enable');
                		$("#"+o.datetoid).datepicker('enable');
                		$("#"+o.datefromid).val('').closest('.control-group').addClass('required');
                		$("#"+o.datetoid).val('');
                	}
                	else{
                		$("input[name='"+o.datepresetname+"']").val('null');
                		$("#"+o.datefromid).datepicker('disable');
                		$("#"+o.datetoid).datepicker('disable');
                		$("#"+o.datefromid).val("").closest('.control-group').removeClass('required');
                		$("#"+o.datetoid).val(""); 
                		/*
                		$("input[name='"+o.datepresetname+"']").val('null');
                		$("#"+o.datefromid).datepicker('disable');
                		$("#"+o.datetoid).datepicker('disable');
                		var dateset = eval(selectedvalue);
                		var monthf = dateset.from.getMonth()+1;
                		var montht = dateset.to.getMonth()+1;
                		var date1=dateset.from.getDate()+'/'+monthf+'/'+dateset.from.getFullYear()+' '+dateset.from.getHours()+':'+dateset.from.getMinutes();
                		var date2=dateset.to.getDate()+'/'+montht+'/'+dateset.to.getFullYear()+' '+dateset.to.getHours()+':'+dateset.to.getMinutes();
                		$("#"+o.datefromid).val(completeDateDigits(date1));
                		$("#"+o.datetoid).val(completeDateDigits(date2));*/
                	}
                });
                if (typeof callback == 'function') { // make sure the callback is a function
        	        callback.call(this); // brings the scope to the callback
        	    }
            });
        }
    });
    
    //Order tables
    $('table a.sortTable').live('click',function(){
    	var qs = $.data(document.body,'cps_qs');
    	if((qs!=undefined)&&(qs!='null')){
    		qs = qs.split('&');
    	var new_qs="";
    	$.each(qs,function(k,v){
    		if((v.indexOf('fieldorderby')==-1)&&(v.indexOf('fieldorderAsc')==-1)){
    			new_qs+="&"+v;
    		}
    	});
    	var order="ascendant";
    	if($(this).hasClass('ascendant')){
    		$(this).removeClass('ascendant').addClass('descendant');
    		order='0';
    	}else{
    		$(this).removeClass('descendant').addClass('ascendant');
    		order='1';
    	}
    	new_qs+="&fieldorderby="+$(this).attr('orderby')+'&fieldorderAsc='+order;
    	new_qs=new_qs.replace(/^(\&\&)+/g,'\&');
    	callPrivateService($.data(document.body,'cps_action'),new_qs,$.data(document.body,'cps_async'),$.data(document.body,'cps_param'));	
    	}
    });
    $('ul.nav li a').live('click',function(){
    	$.data(document.body,'cps_qs','null');
    });
    


$('div.accordion-search a.reset').die('click').live('click',function(){
	var $current_form = $(this).closest('.accordion-inner').find('form');
	$current_form.find('input:visible').each(function(){
		$(this).val('');
	});
	$current_form.find('select').each(function(){
		$(this).val($('option:first',this).val());
	});
	
	$current_form.find('.controls label:first input:radio').each(function(){
		$(this).attr('checked',true);
	});
	
	$current_form.find('input:visible:first').not('.hasDatepicker').focus();
});


/* xmlformat
$.get('assets/languages/it_IT.xml',function(xml){
				var output_xml="";
				var isjs ="";
				$('word',xml).each(function(){
					isjs = ($(this).attr('isjs')=='true')?' isjs="true"':"";
					output_xml+='<word key="'+$(this).attr('key')+'"'+isjs+">"+$(this).attr('value')+"</word>";
				});
				console.info(output_xml);
		});
*/

$('input.date.half-text').live('change',function(){
	$(this).attr('data-original-title',$(this).val());
	$(this).tooltip();
});

})(jQuery);
