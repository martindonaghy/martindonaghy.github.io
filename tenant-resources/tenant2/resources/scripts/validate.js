	
	function validate()
	{
		this.error = false;
		this.message = '';
	}	
	
	var validate = new validate();
	
	function catchChange(id) {
		$('#'+id).change(function(){
			hideInlineValidation(id);
		});			
		$('#'+id).keydown(function(){
			hideInlineValidation(id);
		});			
	}	
	
	function showInlineValidation(id, message) {
		if ($('#'+id).length > 0) {	
			$('#'+id+'Err').remove();
			$('#'+id).addClass('formError');
			$('#'+id).parent().append('<div style="vertical-align:top; display:inline-block; color: red;" id="'+id+'Err">&nbsp;'+message+'</div>');	
		}
	}
	
	function hideInlineValidation(id) {
		if ($('#'+id).length > 0) {	
			$('#'+id+'Err').remove();
			$('#'+id).removeClass('formError');
		}
	}	
	
	function showInlineValidationByName(id, message) {
		if ($('input[name='+id+']').length > 0) {	
			$('#'+id+'Err').remove();
			$('input[name='+id+']').addClass('formError');
			$('input[name='+id+']').parent().append('<div style="vertical-align:top; display:inline-block; color: red;" id="'+id+'Err">&nbsp;'+message+'</div>');	
		}
	}
	
	function hideInlineValidationByName(id) {
		if ($('input[name='+id+']').length > 0) {	
			$('#'+id+'Err').remove();
			$('input[name='+id+']').removeClass('formError');
		}
	}		
	
	function realtimeValidationRequired(id, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validateRequired(id, message);
		});		
	}		
		
	function validateRequired(id, message, validate) {
		if ($('#'+id).length > 0) {	
			if ($('#'+id).val() == null || $('#'+id).val().length <= 0) {
				showInlineValidation(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}	
	
	function realtimeValidationMaxLength(id, message, length) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validateMaxLength(id, message, length);
		});		
	}		
		
	function validateMaxLength(id, message, length, validate) {
		if ($('#'+id).length > 0) {	
			if ($('#'+id).val() != null && $('#'+id).val().length > length) {
				showInlineValidation(id,message);
				if (validate != null) {
					validate.message += message+' You have entered ('+$('#'+id).val().length+') characters.<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}		

	function realtimeValidationChecked(id, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validateChecked(id, message);
		});		
	}		
		
	function validateChecked(id, message, validate) {
		if ($('#'+id).length > 0) {	
			if (!$('#'+id).is(':checked')) {
				showInlineValidation(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}

	function realtimeValidationRadioChecked(id, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validateRadioChecked(id, message);
		});		
	}		
		
	function validateRadioChecked(id, message, validate) {
		if ($('input[name='+id+']').length > 0) {	
			if (!$('input[name='+id+']').is(':checked')) {
				showInlineValidationByName(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}

	function validateRadioCheckedTable(id, message, validate) {
		if ($('input[name='+id+']').length > 0) {	
			if (!$('input[name='+id+']').is(':checked')) {
				//showInlineValidationByName(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}	
	
	function realtimeValidationEmail(id, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validateEmail(id, message);	
		});		
	}			
	
	function validateEmail(id, message, validate) { 	
		if ($('#'+id).val().length > 0) {	
			if (!checkEmail($('#'+id).val())) {
				showInlineValidation(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}
	
	function checkEmail(email) {		
		var emailRegex=/[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		return emailRegex.test(email);
	}	
	
	function realtimeValidationPassword(id, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validatePassword(id, message);	
		});		
	}			
	
	function validatePassword(id, message, validate) { 
		if ($('#'+id).length > 0) {	
			if (!checkPassword($('#'+id).val())) {
				showInlineValidation(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}	
	
	function checkPassword(password) {	
        if(password.length < 6) {
        	return false
        }
        re = /[0-9]/;
        if(!re.test(password)) {
          return false;
        }
        re = /[a-z]/;
        if(!re.test(password)) {
        	return false;
        }
        re = /[A-Z]/;
        if(!re.test(password)) {
        	return false;
        }

        return true;
    }	
	
	
	function realtimeValidationMatches(id, id2, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validateMatches(id, id2, message);	
		});
		$('#'+id2).focusout(function(){
			hideInlineValidation(id);	
			validateMatches(id, id2, message);
		});		
	}				
	
	function validateMatches(id, id2, message, validate) {
			if ($('#'+id).val() != $('#'+id2).val()) {	
			 if ($('#'+id).val().length > 0){
				showInlineValidation(id,message);
			   }
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
	}
	
	function submitValidateMatches(id, id2, message, validate) {
		if ($('#'+id).val() != $('#'+id2).val()) {	
			showInlineValidation(id,message);
			if (validate != null) {
				validate.message += message+'<br/><br/>';
				validate.error = true;
			}
		}	
}
		
	
	function realtimeValidationPhone(id, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validatePhone(id, message);	
		});		
	}	
	
	function validatePhone(id, message, validate) { 
		if ($('#'+id).length > 0) {	
			if (!checkPhone($('#'+id).val())) {
				showInlineValidation(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}
	
	function checkCouncilTaxRef(taxref) {
		var councilTaxRegex = new RegExp("^[0-9]{8}$");
		return councilTaxRegex.test(taxref);
	}
	
	function validateCouncilTaxRef(id, message, validate) { 
		if ($('#'+id).length > 0) {	
			if (!checkCouncilTaxRef($('#'+id).val())) {
				showInlineValidation(id,message);
				if (validate != null) {
					validate.message += message+'<br/><br/>';
					validate.error = true;
				}
			}	
		}
	}
	
	function realtimeValidationCouncilTaxRef(id, message) {
		catchChange(id);
		$('#'+id).focusout(function(){
			validateCouncilTaxRef(id, message);	
		});		
	}
	
	function checkPhone(phone) {
		var phoneRegex = new RegExp("^[0-9]{9,20}$");
		return phoneRegex.test(phone);
	}
	
	
	//Returns true if postcode is in valid format	
	function checkPostcode(postcode) {
		var postCodeRegex = new RegExp("(GIR 0AA)|((([A-Z-[QVX]][0-9][0-9]?)|(([A-Z-[QVX]][A-Z-[IJZ]][0-9][0-9]?)|(([A-Z-[QVX]][0-9][A-HJKSTUW])|([A-Z-[QVX]][A-Z-[IJZ]][0-9][ABEHMNPRVWXY])))) [0-9][A-Z-[CIKMOV]]{2})");
		return postCodeRegex.test(postcode);
	}
	
	
	//qs returns an 
	function qs() {"use strict";
	 var query, parms, i, pos, key, val, qsp;
	 qsp = {};
	 query = location.search.substring(1);
	 parms = query.split('&');
	 for (i=parms.length-1; i>=0; i--) {
		pos = parms[i].indexOf('=');
		if (pos > 0) {
		   key = parms[i].substring(0,pos);
		   val = parms[i].substring(pos+1);
		   qsp[key] = val;
		   }
		}
	 return qsp;
	}
	
	
	