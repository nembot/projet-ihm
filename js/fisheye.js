/*
 $('document').ready(function() {
 	alert('rr');
$(".fisheye-image").click(

        function () {
            $("#fisheye-div").fadeIn();
            alert('cc');
        },
        function () {
            $("#fisheye-div").fadeOut();
        }
    );
 });
 */
 $('document').ready(function() {
	$('#FisheyeMenu').on('mouseover', '.fisheye-image', function(e) {
	  $("#fisheye-div").fadeIn();
	  //alert(e.target.id);
	  console.log(e);
	  $('#fisheye-div').empty();
	  showGame("fisheye-div", e.target.id);
	}); 

	$('#FisheyeMenu').on('mouseout', '.fisheye-image', function() {
	    $('#fisheye-div').empty();
	    $("#fisheye-div").fadeOut();      
	}); 
	
}); 