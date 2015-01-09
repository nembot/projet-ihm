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

var ifGagne = false;
function init() {
	// Connect to the SocketIO server to retrieve ongoing games.
	socket = io.connect();

	showParticipant(socket);

	showFinalCountDown(socket);

	showTerminateGame(socket);

	showSolutions(socket, ifGagne);

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
		console.log("ms="+ms);

		 console.log("FinalCountDown : " + ms);
		});
}

function showTerminateGame (socketF) {
	socketF.on('TerminateGame'	, function(data) {
		 $('#indicateurpartie').append(' est terminée !');
		window.location.replace("./");
	});
}

function showSolutions (socketF, ifGagne) {
	console.log("ifGagne="+ifGagne);
	socketF.on('solutions'		, function(data) {
		console.log(data);
		// if (ifGagne == false) {
		// 	ohSnap("Un autre joueur a trouvé une solution.<br/>Vous avez 60 secondes pour trouver une meilleure solution.", "orange");
		// 	clock.start();
		// 	ifGagne = true;
		// }

		for (var i=0; i <= data.solutions.length; i++) {
			var calculCoup = data.solutions[i].proposition.length / 2;
			if (ifGagne == false) {
				if (data.solutions[i].player != user.id) {
					ohSnap(data.solutions[i].player+" a trouvé une solution avec "+calculCoup+" coups.<br/>Vous avez 60 secondes pour trouver une meilleure solution.", "orange");
					clock.setCountdown(true);
					clock.setTime(60);
					clock.start();
					ifGagne = true;
				}
			}
			// if (minCoup(data.solutions)) {
			//
			// }
			// else {
			// 	ohSnap("Un autre joueur a trouvé une solution.<br/>Vous avez perdu", "red");
			// }
		}
		// Comparé les nombres de coups entre les joueurs gagnant à implémenter.
		 console.log("Solutions are :\n"+JSON.stringify(data.solutions));
		});
}

function minCoup(table) {
	var min = table[0];
	for (var i = 0; i < table.length; i++) {
		if (table[i] <= min) {
			min = table[i];
		}
	}
	return min;
}
