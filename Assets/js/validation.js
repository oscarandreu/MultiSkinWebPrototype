function validatePhone(input){
	   var amountRegExp = /^([0-9]\s?\-?\+?){8,20}$/;
	    if(!amountRegExp.test(input)){
	   	 return (false);
	    }
	    return (true);
};

function validateAddress(input){
	var amountRegExp = /^([0-9A-Za-záéíóúAÉÍÓÚÑñÇçÄÖÜäöüßºª\(\)\-,]|(\s)){3,50}$/;
    if(!amountRegExp.test(input)){
   	 return (false);
    }
    return (true);
};

function validateName(input){
	var amountRegExp = /^([A-Za-záéíóúAÉÍÓÚÑñÇçÄÖÜäöüß]|(\s)){3,30}$/;
    if(!amountRegExp.test(input)){
   	 return (false);
    }
    return (true);
};

function validateUserName(input){
	var amountRegExp = /^[A-Za-z][A-Za-z0-9\.-]{2,29}$/;
    if((!amountRegExp.test(input))||(input.length>15)){
   	 return (false);
    }
    return (true);
};

function validateEmail(input){
	var amountRegExp = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]{2,200}(\.[a-z]{2,6})+$/;
    if(!amountRegExp.test(input)){
   	 return (false);
    }
    return (true);
};

function validateDate(input){
	var amountRegExp = /^(0[1-9]|[12][0-9]|3[01])[-\/\.](0[1-9]|1[012])[-\/\.](19|20)\d\d$/;
    if(!amountRegExp.test(input)){
   	 return (false);
    }
    return (true);
};

function validatePassword(input){
	var amountRegExp = /^[A-Za-z0-9][A-Za-z0-9\.-]{2,29}$/;
    if(!amountRegExp.test(input)){
   	 return (false);
    }
    return (true);
};


/*Alphanumeric, must contains numerics, lower case and upper case characters and the length at least 6 characters. The password must not match the forbiden names in the array*/
function validateSecurePassword(input, arrayForbidenNames){
	var valid_input = true;
	var end_index = 0;
	var new_word="";
	$.each(arrayForbidenNames, function(k, v) {
		end_index = v.length - 4;
		for(i=0;i<=end_index;i++){
			if(input.indexOf(v.slice(i,i+4))!=-1){
				valid_input=false;
				return;
			}
		}

	});
	
	var amountRegExp = /^[A-Za-z0-9]{6,}$/;
	var amountRegExpNumbers =/[0-9]+/;
	var amountRegExpAlpha =/[A-za-z]+/;
    if((!amountRegExp.test(input))||(!amountRegExpNumbers.test(input))||(!amountRegExpAlpha.test(input))){
   	 	return (false);
    }
    return (valid_input);
};


function validateCurrency(input){
	var amountRegExp = /^([0-9,.]){1,11}$/;
    if(!amountRegExp.test(input)){
   	 return (false);
    }
    return (valid_input);
};

function validateField(field_name,field_value){
	switch(field_name){
		case "username":
			if(!validateUserName(field_value)){
				$('input[name=username]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "password":
			var forbiden_words = new Array();
			$('input.forbiden-word').each(function(k,v){
				forbiden_words[k] = $(this).val();
			});
			if(!validateSecurePassword(field_value,forbiden_words)){
				$('input[name=password]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "firstName":
			if(!validateName(field_value)){
				$('input[name=firstName]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "lastName":
			if(!validateName(field_value)){
				$('input[name=lastName]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "email":
			if(!validateEmail(field_value)){
				$('input[name=email]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "streetAddress":
			if(!validateAddress(field_value)){
				$('input[name=streetAddress]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "city":
			if(!validateAddress(field_value)){
				$('input[name=city]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "province":
			if(!validateAddress(field_value)){
				$('input[name=province]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "homePhone":
			if(!validatePhone(field_value)){
				$('input[name=homePhone]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "mobilePhone":
			if(!validatePhone(field_value)){
				$('input[name=mobilePhone]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		case "fax":
			if(!validatePhone(field_value)){
				$('input[name=fax]').focus().closest('div.control-group').addClass('error');
				return false;
			}
		break;
		default: return true;
	}
	return true;
}
