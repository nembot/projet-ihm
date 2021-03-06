/*
	On a besoin d'XHR dans le login aussi. 
*/

var XHR = function(method, ad, params) {
	var xhr = new XMLHttpRequest();
	xhr.onload = params.onload || null;
	xhr.open(method, ad);
	if(method == 'POST') {xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');}
	var variables   = params.variables || null
	  , str			= '';
	for(var i in variables) {
		 str += i + '=' + encodeURIComponent( variables[i] ) + '&';
		}
	xhr.send( str );
}


$( document ).ready(function() {
	$('.carousel').carousel('pause');
});

function nextAvatar(){

	var inp=document.getElementById("id_avatar");
	inp.value=(inp.value=="1" ? "9" : parseFloat(inp.value) - 1);

}

function prevAvatar(){

	var inp=document.getElementById("id_avatar");
	inp.value=(inp.value=="9" ? "1" : parseFloat(inp.value) + 1);
	}
	
function init() {
	// Connect to the SocketIO server to retrieve ongoing games.
	socket = io.connect();
	socket.on('gamesList', function(data) {
		var rejoindreUnePartie = document.getElementById('rejoindrepartie');
		
		//var ul = document.getElementById('lesParties');
		var fisheye = document.getElementById('FisheyeMenu');
		fisheye.style.display = 'inline-block';
		fisheye.style.width = '100%';
		fisheye.style.marginBottom = '15px';
		
		//ul.innerHTML='';
		fisheye.innerHTML='';
		if (data.gamesList.length > 0) {
			rejoindreUnePartie.innerHTML='Rejoindre une partie :';
		}
		var counter = 0;
		for(p in data.gamesList) {
			counter++;

			var partieDiv = document.createElement('div');
			partieDiv.style.width = '60px';
			partieDiv.style.textAlign = 'center';
			partieDiv.style.display = 'inline-block';
		
			//var li = document.createElement('li');
			var img = document.createElement('img');
			// la classe de l'image : 
			var a = document.createElement('a');
			var source = '../img/image'+counter+'.png';
			
			//ul.appendChild( li );
			//li.appendChild( a );
			fisheye.appendChild(partieDiv);
			partieDiv.appendChild( a );
			
			var textPartie = document.createElement('span');
			textPartie.innerHTML = data.gamesList[p];


			a.appendChild( img );
			
			img.setAttribute('src', source);
			img.setAttribute('alt',data.gamesList[p]);
			img.setAttribute('id',data.gamesList[p]);
			
			//a.appendChild( document.createTextNode( data.gamesList[p] ) );
			a.setAttribute('href', '#');
			a.className = "fisheye-image";
			a.setAttribute('id', ''+data.gamesList[p]+'');
			a.setAttribute('onclick', 'putName("'+data.gamesList[p]+'")');
			a.appendChild(textPartie);
			
		}
		if (data.gamesList.length == 0) {
			rejoindreUnePartie.innerHTML='Aucune partie créée';
		}
	}
);
socket.emit('loginPage');
}

function putName(id) {
	document.getElementById("idGame").value = id;
	document.getElementById("idGame").setAttribute('class', 'form-control');
	document.getElementById("idGame").setAttribute('readonly', '');
	document.getElementById("divPseudo").setAttribute('class','has-error');
	document.getElementById("labelPseudo").setAttribute('class','control-label');
	document.getElementById("labelPseudo").innerHTML = "Renseigne ton pseudo !";
}

function verif_champ() {
	var idGame = document.getElementById("idGame").value;
	var login = document.getElementById("login").value;

	if (idGame == "") {
		alert("Le nom de partie n'est pas renseigné !");
		return false;
	}
	else if (login == "") {
		alert("Le login n'est pas renseigné !");
		return false;
	}
	return true;
}
