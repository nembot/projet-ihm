var shown=false;
function info()
{
	if (shown) hide_info(); else show_info();
}
function show_info()
{
	$("#robot").animate({
		bottom:'170px',
	},"600");
	$("#robot").animate({
		bottom:'140px',
	},"400");
	$("#robot").animate({
		bottom:'160px',
	},"400");
	$("#robot").animate({
		bottom:'150px',
	},"400");

	$("#robot-logged").animate({
		bottom:'100px',
	},"600");
	$("#robot-logged").animate({
		bottom:'70px',
	},"400");
	$("#robot-logged").animate({
		bottom:'90px',
	},"400");
	$("#robot-logged").animate({
		bottom:'80px',
	},"400");


	$("#help-text").animate({
		opacity:'1',
		height:"200px",
	},"slow");

	$("#help-text-logged").animate({
		opacity:'1',
		height:"170px",
	},"slow");
	shown=true;
}
function hide_info()
{
	$("#robot").animate({
		bottom:'170px',
	});
	$("#robot").animate({
		bottom:'-150px',
	});

	$("#robot-logged").animate({
		bottom:'100px',
	});
	$("#robot-logged").animate({
		bottom:'-150px',
	});

	$("#help-text").animate({
		opacity:'0',
		height:"0px",
	},"slow");
	$("#help-text-logged").animate({
		opacity:'0',
		height:"0px",
	},"slow");

	shown=false;
}
