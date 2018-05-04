	$(document).ready(function() {	
		for (var i=0;i<=100;i++)
		{ 
			$('#progressbar'+i).progressbar({value: i});	
		}								
	});
	