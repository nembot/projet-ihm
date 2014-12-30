

$( document ).ready(function() {
	$('.carousel').carousel('pause');
});

$('#carousel').on('slide.bs.carousel', function (event) {
	var dir=event.direction;
	var inp=document.getElementById("id_avatar");
	if (dir=="left") inp.value=(inp.value=="9" ? "1" : parseFloat(inp.value) + 1);
	if (dir=="right")  inp.value=(inp.value=="1" ? "9" : parseFloat(inp.value) - 1);
})

function getAvatar(){
	return $("#id_avatar").val();
}

function init() {
	// Connect to the SocketIO server to retrieve ongoing games.
	socket = io.connect();
	socket.on('gamesList', function(data) {
		var rejoindreUnePartie = document.getElementById('rejoindrepartie');
		var ul = document.getElementById('lesParties');
		ul.innerHTML='';
		if (data.gamesList.length > 0) {
			rejoindreUnePartie.innerHTML='Rejoindre une partie';
		}
		for(p in data.gamesList) {
			var li = document.createElement('li');
			var a = document.createElement('a');
			ul.appendChild( li );
			li.appendChild( a );
			a.appendChild( document.createTextNode( data.gamesList[p] ) );
			a.setAttribute('href', '#');
			a.setAttribute('id', data.gamesList[p]);
			a.setAttribute('onclick', 'putName("'+data.gamesList[p]+'")');
		}
	}
);
socket.emit('loginPage');
}

function putName(id) {
	document.getElementById("idGame").value = id;
	document.getElementById("idGame").setAttribute('readonly', '');
}
