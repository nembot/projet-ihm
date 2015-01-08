 $('document').ready(function() {
	$('#FisheyeMenu').on('mouseover', '.fisheye-image', function(e) {
	  $("#fisheye-div").fadeIn();
	  //alert(e.target.id);
	  console.log('targe' + e.target.id);
	  if(e.target.id != null && e.target.id != '')
	  	showGame("fisheye-div", ''+e.target.id+'');
	}); 

	$('#FisheyeMenu').on('mouseout', '.fisheye-image', function() {
	    $('#fisheye-div').empty();
	    $("#fisheye-div").fadeOut();      
	});
}); 