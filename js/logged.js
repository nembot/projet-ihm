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

function init() {
	// Connect to the SocketIO server to retrieve ongoing games.
	socket = io.connect();

	showParticipant(socket);

	showFinalCountDown(socket);

	showTerminateGame(socket);

	showSolutions(socket);

	socket.emit ('identification', 	{ login	: document.getElementById('login').value
									, idGame: document.getElementById('idGame').value}
				);
}

function showParticipant(socketF) {
	var currentParticipant = document.getElementById('login').value;
	var count = 0;
	socketF.on('participants', function(data) {
		 var ul = document.getElementById('lesParticipants');
		 ul.innerHTML='';
		 for(p in data.participants) {
			 var li = document.createElement('li');
			 ul.appendChild( li );
			 li.appendChild( document.createTextNode( data.participants[p] ) );
			 /*if(data.participants[p] == currentParticipant) {
			 	count++;
			 }*/
			}

			/*if(count > 1) {
				alert('Ce joueur est déja connecté sur cette partie !');
				window.location.replace('http://localhost:8090/login.xhtml');
			}*/
		});
}



function showFinalCountDown (socketF) {
	socketF.on('FinalCountDown'	, function(data) {
		 var ms   = data.FinalCountDown;
		 console.log("FinalCountDown : " + ms);
		});
}

function showTerminateGame (socketF) {
	socketF.on('TerminateGame'	, function(data) {
		 $('#indicateurpartie').append(' est terminée !');
	});
}

function showSolutions (socketF) {
	socketF.on('solutions'		, function(data) {
		 console.log("Solutions are :\n"+JSON.stringify(data.solutions));
		});
}
