
var API_URL='/lerest/v1';
var VOF_FORM_URL='/form/widget/';
var DEFAULT_ERROR_MSG='An error has occurred, please try again later';
var NO_DETAILS_MSG='No details available';

var searchForPartyurl;
var createIndividualurl;
var mydetailsurl;
var myrequestsurl;
var myhistoryurl;
var twofactorauthurl;
var authtokenstore;
var filterstore;

var authsendsmsurl='/lerest/v1/auth/2fa/sms/send';
var authresendsmsurl='/lerest/v1/auth/2fa/sms/resend';
var authcheckurl='/lerest/v1/auth/2fa/code/check';


//
// Main API functions
//
function leapi(authtoken, filter) {
	authtokenstore = authtoken;

	if(!filter) {
        filterstore='all';
    } else {
        filterstore = filter;
    }
	
	$('.le-content').html(
			'<div class="le-lock" style="display: none;"/>' +			
		   	'<div class="le-lock-msg" style="display: none;"/>');

	lock();

	return $.ajax({
		url: API_URL+'?token='+authtoken,
		type: 'GET', dataType: 'json', contentType: 'application/json', mimeType: 'application/json'
	}).done(function(response, status, xhr) {
		auth=xhr.getResponseHeader('Authorization');
		processLinks(response.links);
		unlock();
	}).fail(ajaxError);
}

function letwofactorauth() {
	if(twofactorauthurl) {
		lock();
		return $.ajax({
			url: twofactorauthurl,
			type: 'GET',
			beforeSend: ajaxSend		
		}).done(function(response, status, xhr) {
			auth=xhr.getResponseHeader('Authorization');
			$('.le-content').append(response);
			process2faData();
			unlock();
		}).fail(ajaxError);
	} else {
		setError();
	}
}

function leprofile() {
	if(mydetailsurl) {
		lock();
		return $.ajax({
			url: mydetailsurl,
			type: 'GET',
			beforeSend: ajaxSend		
		}).done(function(response, status, xhr) {
			auth=xhr.getResponseHeader('Authorization');
			$('.le-content').append(response);
			processProfileData();
			unlock();
		}).fail(ajaxError);
	} else {
		setError();
	}
}

function lerequests() {
	if(myrequestsurl) {
		lock();	
		return $.ajax({
			url: myrequestsurl+'?filter='+filterstore,
			type: 'GET',
			beforeSend: ajaxSend		
		}).done(function(response, status, xhr) {
			auth=xhr.getResponseHeader('Authorization');
			$('.le-content').append(response);
			processRequestData();
			unlock();
		}).fail(ajaxError);		
	} else {
		setError();
	}
}

function lehistory() {
	if(myhistoryurl) {
		lock();
		return $.ajax({
			url: myhistoryurl,
			type: 'GET',
			beforeSend: ajaxSend		
		}).done(function(response, status, xhr) {
			auth=xhr.getResponseHeader('Authorization');
			$('.le-content').append(response);
			processHistoryData();
			unlock();
		}).fail(ajaxError);
	} else {
		setError();
	}
}


//
// Utility functions
//
function process2faData() {
	$('#sendSMS2faCodeForm').submit(function(event) {
		lock();
		event.preventDefault();		
		if(isValidPhoneNumber()) {
			send2faSms(ConvertFormToJSON($(this)), authsendsmsurl);
		}
		unlock();
		return false;
	});	

	$('#resendSMS2faCodeLink').click(function(event) {
		event.preventDefault();
		resend2faSms();
		return false;
	});

	$('#check2faCodeForm').submit(function(event) {
		lock();
		event.preventDefault();
		if(isValidCode()) {
			check2faCode(ConvertFormToJSON($(this)));
		}
		unlock();
		return false;
	});
}

function processProfileData() {
	if (! $('.le-content').has('.le-profile').length) {
		setMessage();
	}
}

function processRequestData() {
	if (! $('.le-content').has('.le-request-item').length) {
		setMessage();
	} else {			
		$('.le-request-list .le-request-item').click(function(event) {
		 	requestDetails('.le-request-item-holder .le-request-form-details', $(this).data('location'));
		  	return false;
		});

		$('.le-request-date > time').each(function () {
			applyRelativeDate($(this));
		});
		
		$('.le-history-date > time').each(function () {
			applyRelativeDate($(this));
		});		
	}	
}

function processHistoryData() {
	if (! $('.le-content').has('.le-history-details').length) {
		setMessage();
	} else {			
		$('.le-history-list .le-request-item').click(function() {
		  requestDetails('.le-history-item-holder .le-request-form-details', $(this).data('location'));
		  return false;
		});
		
		$('.le-history-date > time').each(function () {
			applyRelativeDate($(this));
		});		
	}	
}

function send2faSms(data, url) {
	lock();
	return $.ajax({		
		url: url,
		data: JSON.stringify(data),
		type: 'POST', 
		dataType: 'json', 
		contentType: 'application/json', 
		mimeType: 'application/json', 
		beforeSend: ajaxSendJson
	}).done(function(response, status, xhr) {
		auth=xhr.getResponseHeader('Authorization');
		setSmsMessage('Text message sent successfully');
		unlock();
	}).fail(function(response, status, xhr) {
		switch (response.status) {
			case 400: setSmsError('You have entered an invalid phone number'); break;
			default: setSmsError('An error occurred, please try again later'); break;
		}	
		unlock();
	});
}

function resend2faSms() {
	lock();
	clearFieldErrors();
	return $.ajax({		
		url: authresendsmsurl,
		type: 'POST',
		beforeSend: ajaxSendJson
	}).done(function(response, status, xhr) {
		auth=xhr.getResponseHeader('Authorization');
		setSmsMessage('Text message sent successfully');
		unlock();
	}).fail(function(response, status, xhr) {
		switch (response.status) {
			default: setSmsError('An error occurred, please try again later'); break;
		}	
		unlock();
	});
}

function doCMSAuthCallback() {
	var authObj = { success : true };
	dualAuthCallback.init(authObj);
}

function check2faCode(data) {
	lock();

	// add main token
	data['token'] = authtokenstore;

	return $.ajax({		
		url: authcheckurl,
		data: JSON.stringify(data),
		type: 'POST', 
		dataType: 'json', 
		contentType: 'application/json', 
		mimeType: 'application/json', 
		beforeSend: ajaxSendJson
	}).done(function(response, status, xhr) {
		auth=xhr.getResponseHeader('Authorization');
		setCodeMessage('Code has been verified successfully');
		doCMSAuthCallback();
		unlock();
	}).fail(function(response, status, xhr) {
		switch (response.status) {
			case 400: setCodeError('You have entered an invalid verification code'); break;
			case 401: setCodeError('You have entered an incorrect verification code'); break;
			default: setCodeError('An error occurred, please try again later'); break;
		}	
		unlock();
	});
}

function requestDetails(formHolderClass, url) {
	lock();
	return $.ajax({		
		url: url,
		type: 'GET',
		beforeSend: ajaxSend		
	}).done(function(response, status, xhr) {
		auth=xhr.getResponseHeader('Authorization');
		$('.le-content .le-request').html(response);
		loadForm(formHolderClass);
		showRequestDetails();
		unlock();		
	}).fail(ajaxError);
}

function loadForm(formHolderClass) {
	var formName = $(formHolderClass).data('form');
	var ref = $(formHolderClass).data('ref');
	var newtoken = $(formHolderClass).data('token');
	var formUrl = VOF_FORM_URL+formName+'?token=';

	if (formName && ref) {
		lock();
		if (newtoken) {
	    	formUrl = formUrl+newtoken+'&ref='+ref;
	    } else {
	    	formUrl = formUrl+authtokenstore+'&ref='+ref;	
	    }
	    $.ajax({
	      url: formUrl
	    })
	    .done(function(data){
	        $(formHolderClass).append(data);
	        $('#dform_close').remove();
	    })
	    .fail(function(data){
	        $(formHolderClass).append('<div class="error-message">No details available</div>');
	    });
	    unlock();
	}
}

function applyRelativeDate(element) {
	var createdDate = element.attr('datetime');
	var createdDateTitle = element.attr('title');
	element.html(moment(createdDate).startOf('minute').fromNow() + ' (' + createdDateTitle + ')');
}

function showRequestList() {
	$('.le-content .le-request').hide();
	$('.le-content .le-request-list').show();
	$('.le-content .le-history-list').show();	
}

function showRequestDetails() {		
	$('.le-content .le-request-list').hide();
	$('.le-content .le-history-list').hide();	
	$('.le-content .le-request').show();
}

function processLinks(links) {
	$.each(links, function() {		
		var href = this.href;
		href.indexOf('?') > 0 ? href = href.substr(0, href.indexOf('?')) : href = this.href;
		if (this.rel == 'profile') {
			mydetailsurl = href;
		}
		if (this.rel == 'requests') {
			myrequestsurl = href;
		}
		if (this.rel == 'history') {
			myhistoryurl = href;
		}
		if (this.rel == 'auth2fa') {
			twofactorauthurl = href;
		}		
		if (this.rel == 'search') {
			searchForPartyurl = href;
		}
		if (this.rel == 'create') {
			createIndividualurl = href;
		}
	});
}


//
// Messages
//
function buildMessage(message) {
	return '<div class="le-message">'+message+'</div>'
}

function buildErrorMessage(message) {
	return '<div class="le-error-message">'+message+'</div>'
}

function setError() {
	$('.le-content').append(buildErrorMessage(DEFAULT_ERROR_MSG));
}

function setMessage() {
	$('.le-content').append(buildMessage(NO_DETAILS_MSG));
}

function clearFieldErrors() {
	$('.le-content .code-message, .le-content .sms-message').empty();
}

function setSmsError(message) {
	setFieldError($('.le-content .sms-message'), message);
}

function setSmsMessage(message) {
	setFieldMessage($('.le-content .sms-message'), message);
}

function setCodeError(message) {
	setFieldError($('.le-content .code-message'), message);
}

function setCodeMessage(message) {
	setFieldMessage($('.le-content .code-message'), message);
}

function setFieldError(element, message) {
	element.html(buildFieldErrorMessage(message));
}

function setFieldMessage(element, message) {
	element.html(buildFieldMessage(message));
}

function buildFieldMessage(message) {
	return '<div class="le-field-message">'+message+'</div>'
}

function buildFieldErrorMessage(message) {
	return '<div class="le-field-error-message">'+message+'</div>'
}


//
// Locking
//
function lock() {
	$('.le-content .le-lock, .le-content .le-lock-msg').show();
}

function unlock() {
	$('.le-content .le-lock, .le-content .le-lock-msg').hide();
}


//
// ajax
//
function ajaxSend(xhr) {
	xhr.setRequestHeader('Authorization', auth);
	xhr.setRequestHeader('Accept', 'text/html; charset=UTF-8');
}

function ajaxSendJson(xhr) {
	xhr.setRequestHeader('Authorization', auth);
	xhr.setRequestHeader('Accept', 'application/json;');
}

function ajaxError(xhr, settings, thrownError) {
	setError();
	unlock();
}

function ConvertFormToJSON(form){
    var array = $(form).serializeArray();
    var json = {};
    
    $.each(array, function() {
        json[this.name] = this.value || '';
    });
    
    return json;
}


//
// validation
//
function validateMaxLength(id, message, length, errorFn) {
	if ($('#'+id).length > 0) {	
		if ($('#'+id).val() != null && $('#'+id).val().length > length) {
			errorFn(message+', please enter maximum of ' + length + ' digits');
			return false;
		}
		return true;
	}  
}

function validateLength(id, message, length, errorFn) {
	if ($('#'+id).length > 0) {	
		if ($('#'+id).val() != null && $('#'+id).val().length != length) {
			errorFn(message+', please enter ' + length + ' digits');
			return false;
		}
		return true;
	}  
}

function validateRequired(id, message, errorFn) {
	if ($('#'+id).length > 0) {	
		if ($('#'+id).val() == null || $('#'+id).val().length <= 0) {
			errorFn(message);
			return false;
		}
		return true;
	}
}

function validatePhone(id, message, errorFn) {
	var phoneRegex = new RegExp("^(?!.*  )[0-9+ ]*$");
	if ($('#'+id).length > 0) {	
		if (!phoneRegex.test($('#'+id).val())) {
			errorFn(message);
			return false;
		}
		return true;
	}
}

function validateCode(id, message, errorFn) {
	var codeRegex = new RegExp("^[0-9]{6}$");
	if ($('#'+id).length > 0) {	
		if (!codeRegex.test($('#'+id).val())) {
			errorFn(message);
			return false;
		}
		return true;
	}
}

function isValidCode() {
	clearFieldErrors();
	if(!validateRequired('code','Please enter a 6-digit verification code',setCodeError)) {
		return false;
	}	
	if(!validateCode('code','You have entered an invalid verification code',setCodeError)) {
		return false;
	}
	return true;
}

function isValidPhoneNumber() {
	clearFieldErrors();
	if(!validateRequired('number','Please enter a phone number',setSmsError)) {
		return false;
	}
	if(!validatePhone('number','You have entered an invalid phone number',setSmsError)) {
		return false;
	}	
	return true;
}

