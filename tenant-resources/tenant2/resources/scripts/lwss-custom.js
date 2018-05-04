$(document).ready(function() {
	$('#registrationForm').submit(function(event) {
		register($(this).serializeArray(),event);
		return false;
	});		
	
	$('#sendPasswordResetForm').submit(function(event) {
		sendPasswordReset($(this).serializeArray(),event);
		return false;
	});		
	
	$('#changePasswordForm').submit(function(event) {
		changePassword($(this).serializeArray(),event);
		return false;
	});		

	$('#loginForm').submit(function() {
		lock();
	});		
	
	$('#updateIndividualForm').submit(function(event) {
		updateIndividual($('#updateIndividualForm').serializeArray(),event);
		return false;
	});			
	
	$('#requestDetailsAccordion').accordion({heightStyle: 'content', collapsible: true});
	$("#eformIFrame").attr('src', $("#eformURL").val()+'&token='+$("#token").val());
	
	$('#profileAccordian').accordion({heightStyle: 'content', collapsible: true});
	
	if ($('#errorMessage').html() != '') {
		$("#errorMessage").show();
	}
	if ($('#successMessage').html() != '') {
		$("#successMessage").show();
	}
	if ($('#warningMessage').html() != '') {
		$("#warningMessage").show();
	}
	if ($('#infoMessage').html() != '') {
		$("#infoMessage").show();
	}
	
	if ($('#registrationForm').length > 0) {	
		realtimeValidationEmail('email', getMessage('messagevalidationemail'));
		realtimeValidationPassword('password', getMessage('messagevalidationpassword'));
		realtimeValidationMatches('confEmail', 'email', getMessage('messagevalidationemailnomatch'));
		realtimeValidationMatches('confPassword', 'password', getMessage('messagevalidationpasswordnomatch'));
	}
	
	if ($('#changePasswordForm').length > 0) {
		realtimeValidationPassword('currentPassword','Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.');
		realtimeValidationPassword('password','Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.');		
		realtimeValidationMatches('confPassword','password','Passwords do not match.');
	}
	
	if ($('#resetPasswordForm').length > 0) {			
		realtimeValidationPassword('password','Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.');		
		realtimeValidationMatches('confPassword','password','Passwords do not match.');
	}		
	
	if ($('#sendPasswordResetForm').length > 0) {			
		realtimeValidationEmail('resetEmail','Please enter a valid email.');
	}
	
	if ($('#updateIndividualForm').length > 0) {			
		realtimeValidationRequired('Title','Title is required.');
		realtimeValidationRequired('Forename','Forename is required.');
		realtimeValidationRequired('Surname','Surname is required.');	
		realtimeValidationMaxLength('Forename','Forename must be less than 35 characters.',35);
		realtimeValidationMaxLength('Surname','Surname must be less than 35 characters.',35);			
	}	
	
	$('#menuButton').click(function() {
		$(".menuList").toggle();
		return false;
	});	
	
	$('.config-delete').on("click", function(e) {
		e.preventDefault();
		var href = this.href;

		var buttons = {};
		var okButton = $('#delete-dialog-ok').val();
		var cancelButton = $('#delete-dialog-cancel').val();
		
		buttons[okButton] = function() {
			$(this).dialog("close");
			window.location.href = href
		};
		
		buttons[cancelButton] = function() {
			$(this).dialog("close");
		};
				
		$(".config-delete-dialog").html($('#delete-dialog-desc').val());
		
		$(".config-delete-dialog").dialog({
			resizable: false,
			title: $('#delete-dialog-title').val(),
			modal: true,
			width: 400,	
			buttons: buttons
		});
	});	
	
	if (window['ListPagination']) {
		var options = {
				valueNames: ['status'],
				 page: 10,
				 plugins: [ ListPagination({}) ] 
		};
		var serviceRequestList = new List('MyServiceRequestsList', options);

		$('#displayClosedFilter').click(function() {
			serviceRequestList.filter(function(item) {
			    if (item.values().status == "closed") {
			      return true;
			    } else {
			      return false;
			    }
			  });
		  showHidePagination();
		  return false;
		});
		
		$('#displayOpenFilter').click(function() {
			serviceRequestList.filter(function(item) {
			    if (item.values().status == "open") {
			      return true;
			    } else {
			      return false;
			    }
			  });
		  showHidePagination();
		  return false;
		});
		
		$('#displayAllFilter').click(function() {
			serviceRequestList.filter(function(item) {
			     return true;
			  });
		  showHidePagination();
		  return false;
		});
	}
	
});

function showHidePagination()
{
	var listLength = $('ul.list > li').length;
	if (listLength > 9)
	{
		document.getElementById("paginationControls").style.display="block";
	}
	else
	{
		document.getElementById("paginationControls").style.display="none";
	}
}

function register(data,event) {
	
	hideAllMessages();
	
	validate.error=false;
	validate.message='';
	
	validateEmail('email','Please enter a valid email.',validate);
	validatePassword('password','Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.',validate);
	submitValidateMatches('confEmail','email','Email addresses do not match.',validate);
	submitValidateMatches('confPassword','password','Passwords do not match.',validate);
	
	if (validate.error) {
		$('#errorMessage').html("Please check your registration details");
		$("#errorMessage").show();
		event.preventDefault();
		return;		
	}		
	
	lock();
	
    $.ajax({
      url: '/auth/sendActivationEmail',
      data: data,
      type: 'POST',
      cache: false,
      success: function(message){
    	  unlock();    	  
    	  
    	  if (message == 'EMAIL_INVALID') {
    		  $("#errorMessage").html("Please enter a valid email.");
    		  $("#errorMessage").show();
    		  
		  } else if (message == 'PASSWORD_INVALID') {
    		  $("#errorMessage").html("Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.");
    		  $("#errorMessage").show();    	
		  
    	  } else if (message == 'DB_ERROR') {
    		  $("#errorMessage").html("There was an unexpected error, please try again later");
        	  $("#errorMessage").show();    		  
    		  
    	  } else if (message == 'OK') {
    		  $("#successMessage").html("An activation email has been sent to your account, please click on the activation link to complete your registration");
        	  $("#successMessage").show();    
  
    	  } else {
    		  ("#errorMessage").html("There was an unexpected error, please try again later");
    		  $("#errorMessage").show();    		  
    	  }
    	  
      },
	  error: function(jqXHR, errorThrown){
		  unlock();
		  $("#errorMessage").html("There was an unexpected error, please try again later");
		  $("#errorMessage").show();
	  }	  
    });
}; 

function sendPasswordReset(data,event) {
	
	hideAllMessages();
	
	validate.error=false;
	validate.message='';
	
	validateEmail('resetEmail','Please enter a valid email.',validate);
	
	if (validate.error) {
		$('#errorMessage').html("Please check your details");
		$("#errorMessage").show();
		event.preventDefault();
		return;		
	}		
	
	lock();
	
    $.ajax({
      url: '/auth/sendPasswordResetEmail',
      data: data,
      type: 'POST',
      cache: false,
      success: function(message){
    	  unlock();
    	  
		  if (message == 'OK') {
			  $("#successMessage").html("An email has been sent to account " + $('#resetEmail').val() + "; please click on the link to reset your password");
	    	  $("#successMessage").show();    	  
    	  } else if (message == 'EMAIL_INVALID') {
    		  $("#errorMessage").html("Please enter a valid email.");
    		  $("#errorMessage").show();  
		  } else {
    		  ("#errorMessage").html("There was an unexpected error, please try again later");
    		  $("#errorMessage").show();    		  
    	  }
      },
	  error: function(jqXHR, errorThrown){
		  unlock();
		  $("#errorMessage").html("There was an unexpected error, please try again later");
		  $("#errorMessage").show();
	  }	  
    });
}; 

function validateResetPassword() {
	
	hideAllMessages();
	
	validate.error=false;
	validate.message='';
	
	validatePassword('password','Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.',validate);
	submitValidateMatches('confPassword','password','Passwords do not match.',validate);
	
	if (validate.error) {
		$('#errorMessage').html("Please check your details");
		$("#errorMessage").show();
		return false;		
	}
	
	lock();
	
	return true;
}; 

function changePassword(data,event) {
	
	hideAllMessages();
	
	validate.error=false;
	validate.message='';
	
	validatePassword('currentPassword','Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.',validate);
	validatePassword('password','Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.',validate);
	submitValidateMatches('confPassword','password','Passwords do not match.',validate);
	
	if (validate.error) {
		$('#errorMessage').html("Please check your password details");
		$("#errorMessage").show();
		event.preventDefault();
		return;		
	}		
	
	 $("#errorMessage").html('');
	 $("#errorMessage").hide();
	 $("#successMessage").html('');
	 $("#successMessage").hide();
	
	lock();
    $.ajax({
      url: '/auth/changePassword',
      data: data,
      type: 'POST',
      cache: false,
      success: function(message){
    	  unlock();
    	  if (message == 'PASSWORD_INCORRECT') {
    		  $("#currentPassword").val('');
    		  $("#errorMessage").html('Current password incorrect');
        	  $("#errorMessage").show();
    	  } 
    	  else if (message == 'PASSWORD_INVALID') {
    		  $("#currentPassword").val('');
    		  $("#errorMessage").html('Passwords must be at least 6 characters long and contain 1 uppercase letter, 1 lowercase letter and 1 number.');
        	  $("#errorMessage").show();
    	  }
    	  else if (message == 'DB_ERROR') {
    		  $("#currentPassword").val('');
    		  $("#errorMessage").html('There was an unexpected error, please try again later');
        	  $("#errorMessage").show();        	  
    	  } else {
    		  $("#currentPassword").val('');
    		  $("#password").val('');
    		  $("#confPassword").val('');
    		  $("#successMessage").html("Your password has been updated");
        	  $("#successMessage").show();    		  
    	  }
      },
	  error: function(jqXHR, errorThrown){
		  unlock();
		  $("#errorMessage").html(errorThrown)
		  $("#errorMessage").show();
	  }	  
    });
}; 


function updateIndividual(data,event) {
	
	hideAllMessages();
		
	validate.error=false;
	validate.message='';
	
	validateRequired('Title','Title is required.',validate);
	validateRequired('Forename','Forename is required.',validate);
	validateRequired('Surname','Surname is required.',validate);
	validateMaxLength('Forename','Forename must be less than 35 characters.',35,validate);
	validateMaxLength('Surname','Surname must be less than 35 characters.',35,validate);	
	
	if (validate.error) {
		$('#errorMessage').html("Please check your details");
		$("#errorMessage").show();
		event.preventDefault();
		return;		
	}		
	
	$("#errorMessage").html('');
	$("#errorMessage").hide();
	$("#successMessage").html('');
	$("#successMessage").hide();	
	 
	lock();
    $.ajax({
      url: '/auth/updateIndividual',
      data: data,
      type: 'POST',
      cache: false,
      success: function(message){
    	  	unlock();
    	  	
    	  	if (message == 'OK') {    	  		
    	  		$("#successMessage").html("Your registration is complete, please log in");
    	  		$("#successMessage").show();
    	  		$("#updateIndividual").hide();
    	  		$("#updateIndividualComplete").show();
    	  	}	  
      },
	  error: function(jqXHR, errorThrown){
		  unlock();
		  $("#errorMessage").html("There was an unexpected error, please try again later");
		  $("#errorMessage").show();
	  }	  
    });
};  

function displayCategory(className) {
	$('.category').hide();
	$('.'+className).show();	
};

function displayAllCategories(className) {
	$('.category').show();
};

function displayStatuses(className) {
	$('.status').hide();
	$('.'+className).show();	
};

function displayAllStatuses(className) {
	$('.status').show();
};

function getMessage(className) {
	return $('#messaging .' + className).val();
};

function lock() {
    $('#lock').show();
    $('#lockMsg').show();
}

function unlock() {
    $('#lock').hide();
    $('#lockMsg').hide();
}

function hideAllMessages() {
	$("#errorMessage").hide();
	$("#successMessage").hide();
	$("#warningMessage").hide();
	$("#infoMessage").hide();
}
