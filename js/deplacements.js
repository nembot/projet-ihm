var currentSolution = [];

var currentRobotColor;
var currentRobotCellId;
var currentRobotLine;
var currentRobotColumn;
var success = false;
var clock;
var bclock = false;

$(document).ready(function() {
	clock = $('.clock').FlipClock({
		autoStart: false,
		clockFace: 'MinuteCounter',
		callbacks: {
			interval: function() {
				var time = this.factory.getTime().time;
			}
		}
	});
	nbcoup = new FlipClock($('.nbcoup'), 0, {
		clockFace: 'Counter'
	});
});


function setRobotByEvent(e) {
	var id = $(e.target).closest('td').attr('id');

 		var robotCoordinates = getLineAndColumnFromId(id);
 		var line = robotCoordinates.line;
 		var column = robotCoordinates.column;

 		//resetCells();
 		if(getRobotColor(line, column) != "") {
 			demarquerRobot(currentRobotCellId);
 			currentRobotColor = getRobotColor(line, column);
 			currentRobotCellId = id;
 			currentRobotLine = line;
 			currentRobotColumn = column;
 			//marquerRobot(id, currentRobotColor);
 		}
}

 function addCellsListener() {
 	//console.log('adding cells listeners');
 	$("#tableJeu").click(function(e) {
 		setRobotByEvent(e);
 	});
 }

 function resetCells() {
 	$("#"+currentRobotCellId).css('background-color', '#f2f2f2');
 	$("#"+currentRobotCellId).empty();
 }


 function initTouch() {

   var myElement = document.getElementById('tablePartie');

   // create a simple instance
   // by default, it only adds horizontal recognizers
   var mc = new Hammer(myElement);

    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    mc.get('pinch').set({ enable: true });
    mc.get('rotate').set({ enable: true });

   // listen to events...
   mc.on("pan panleft panright panup pandown", function(ev) {
   	 setRobotByEvent(ev);
   	 if(ev.type == "panup" || ev.type == "pandown" ||ev.type == "panright" ||ev.type == "panleft")
 			//e.preventDefault();
	    if(currentRobotColor != "") {
	    	var nextCell;
	    	if(ev.type == "panup") {//up
	    		nextCell = getNextPosition("up");
	    	} else if(ev.type == "pandown") {//down
	    		nextCell = getNextPosition("down");
	    	} else if(ev.type == "panright") {//right
				nextCell = getNextPosition("right");
	    	} else if(ev.type == "panleft") {// left
	    		nextCell = getNextPosition("left");
	    	}
	    	if(nextCell) { // proposée
	    		var id = nextCell.attr('id');
	    		var l = getLineAndColumnFromId(id).line;
	    		var c = getLineAndColumnFromId(id).column;
	    		sendProposition(currentRobotColor, l, c);
	    	}
	    }
   	 //$(ev.target).closest('td').css('background-color', 'red');


     //myElement.textContent = ev.type +" gesture detected.";
     //alert(ev.type + "");
   });


/*
 	$('html').bind('touchEvent', function() {
 		if(e.keyCode == 37 || e.keyCode == 38 ||e.keyCode == 39 ||e.keyCode == 40)
 		var hammertime = new Hammer(myElement, myOptions);


 	});

*/
 }

 function initKeyboard() {
 	$('html').bind('keydown', function(e){
 		if(e.keyCode == 37 || e.keyCode == 38 ||e.keyCode == 39 ||e.keyCode == 40)
 			e.preventDefault();
	    if(currentRobotColor != "") {
	    	var nextCell;
	    	if(e.keyCode == 38) {//up
	    		nextCell = getNextPosition("up");
	    	} else if(e.keyCode == 40) {//down
	    		nextCell = getNextPosition("down");
	    	} else if(e.keyCode == 39) {//right
				nextCell = getNextPosition("right");
	    	} else if(e.keyCode == 37) {// left
	    		nextCell = getNextPosition("left");
	    	}
	    	if(nextCell) { // proposée
	    		var id = nextCell.attr('id');
	    		var l = getLineAndColumnFromId(id).line;
	    		var c = getLineAndColumnFromId(id).column;
	    		sendProposition(currentRobotColor, l, c);
	    	}
	    }
	});
 }


 function updateRobotsPositions() {
 	for (var i = 0; i < robots.length; i++) {
 	 	if(robots[i].color == currentRobotColor) {
 	 		robots[i].line = currentRobotLine;
 	 		robots[i].column = currentRobotColumn;
 	 	}
 	 }
 }

 function getLineAndColumnFromId(id) {
 	var coordinates = {};
 	
 	var lineStr = id.split('_')[0];
 	var colStr = id.split('_')[1];
 	var line = parseInt(lineStr.replace("i",""));
 	var column = parseInt(colStr.replace("j",""));
 	coordinates.line = line;
 	coordinates.column = column;
 	return coordinates;
 }

  function moveRobot(cell) {
  	//resetCells();
  	var img = getRobotImg(currentRobotColor);
		cell.append(img);
  }
 /*
	Dont touch :

	Calcule quelles sont les cases interdites lors du déplacement
 */

 function hasRobot(cell) {
 	var coordinates = getLineAndColumnFromId(cell.attr('id'));
 	 for (var i = 0; i < robots.length; i++) {
 	 	if(coordinates.line == robots[i].line && coordinates.column == robots[i].column) {
 	 		return true;
 	 	}
 	 }
 	 return false;
 }

 function getObstacles() {
 	var obstacles = {
 		h:-1,
 		b:16,
 		g:-1,
 		d:16
 	};

 	for(var i = 0; i < board.length; i++) {//verical
 		var cell = $("#i"+i+"_j"+currentRobotColumn);
 			if(i < currentRobotLine && obstacles.h < i) { // obstacle haut
 				if(cell.hasClass("hautGras")) {
 					obstacles.h = i-1;
 				}
 				if(cell.hasClass("basGras")) {
 					obstacles.h = i;
 				}
 				if(hasRobot(cell)) {
 					obstacles.h = i;
 				}
 			}

 			if(i > currentRobotLine && obstacles.b > i ) { // obstacle bas
 				if(cell.hasClass("hautGras")) {
 					obstacles.b = i;
 				}
 				if(cell.hasClass("basGras")) {
 					obstacles.b = i+1;
 				}
 				if(hasRobot(cell)) {
 					obstacles.b = i;
 				}
 			}

 			if(i==currentRobotLine) {
 				if(cell.hasClass("hautGras")) {
 					obstacles.h = i-1;
 				}
 				if(cell.hasClass("basGras")) {
 					obstacles.b = i+1;
 				}
 			}

 		}


 	for(var j=0; j<board.length; j++) { // horizontal
 		var cell = $("#i"+currentRobotLine+"_j"+j);
 			if(j < currentRobotColumn && obstacles.g < j) { // obstacle gauche
 				if(cell.hasClass("gaucheGras")) {
 					obstacles.g = j-1;
 				}
 				if(cell.hasClass("droiteGras")) {
 					obstacles.g = j;
 				}

 				if(hasRobot(cell)) {
 					obstacles.g = j;
 				}
 			}

 			if(j > currentRobotColumn && obstacles.d > j ) {
 				if(cell.hasClass("gaucheGras")) {
 					obstacles.d = j;
 				}
 				if(cell.hasClass("droiteGras")) {
 					obstacles.d = j+1;
 				}
 				if(hasRobot(cell)) {
 					obstacles.d = j
 				}
 			}
 			if(j==currentRobotColumn) {
 				if(cell.hasClass("gaucheGras")) {
 					obstacles.g = j-1;
 				}
 				if(cell.hasClass("droiteGras")) {
 					obstacles.d = j+1;
 				}

 			}
 		}


 	return obstacles;
 }

 function getNextPosition(direction) {

 	var obstacles = getObstacles();
	var nextCell;
	if(direction == "up") {
		nextCell = $("#i"+(obstacles.h+1)+"_j"+currentRobotColumn);
		//nextCell.css('background-color', 'black');
	} else if(direction == "down") {
		nextCell = $("#i"+(obstacles.b-1)+"_j"+currentRobotColumn);
		//nextCell.css('background-color', 'black');
	} else if (direction == "right") {
		nextCell = $("#i"+currentRobotLine+"_j"+(obstacles.d-1));
		//nextCell.css('background-color', 'black');
	} else if (direction == "left") {
		nextCell = $("#i"+currentRobotLine+"_j"+(obstacles.g+1));
		//nextCell.css('background-color', 'black');
	}
	return nextCell;
 }


 function getRobotColor(l, c) {
 	for(var i=0; i<game.robots.length; i++) {
 		//console.log(game.robots[i].line);
 		//console.log(game.robots[i].column);
 		if(game.robots[i].line == l && game.robots[i].column == c) {
 			return game.robots[i].color;
 		}
 	}
 	return "";
 }

 function marquerRobot(id, color) {
 	$("#"+id).css('background-color', color);
 }

 function demarquerRobot(id) {
 	$("#"+id).css('background-color', '#f2f2f2');
 }

 function sendProposition(color, l, c) {
 	currentSolution.push({ command : 'select', robot: color}, { command:'move', line : l, column : c});
 	console.log(color);
	XHR("POST" ,"/proposition"
 		, { onload : function() {
 			var response = JSON.parse(this.response);
      console.log("success="+success);
 			if(response.state != 'INVALID_MOVE' && response.state != 'INVALID_SELECT' && success == false) {
        success = false;
        if(response.state == 'SUCCESS') {
          ohSnap('Partie terminée, félicitations !', 'green');
					//alert('Bravo mais un autre joueur peut trouver une solution dans les 60 secondes');
          success = true;
					clock.stop();
          console.log("success2="+success);
        }
        resetCells();
	 			demarquerRobot(currentRobotCellId);
	 			currentRobotCellId = "i"+l+"_j"+c;
		    	currentRobotLine = l;
		    	currentRobotColumn = c;
		    	updateRobotsPositions();
		    	var nextCell = $('#i'+l+'_j'+c);
		    	moveRobot(nextCell);
					nbcoup.increment();
		    	//marquerRobot(currentRobotCellId, currentRobotColor);
					/* Suppression des log */
		    	//var logString = '<p style="color : '+color+';">'+color+' vers l: '+l+' c : '+c+'</p>'
		    	//$('#logText').prepend(logString);

		    } else {
		    	if(response.state == 'INVALID_MOVE' && success == false) {
		    			ohSnap('Déplacement invalide', 'red');
							//nbcoup.decrement();
					}
		    	if(response.state == 'INVALID_SELECT' && success == false)
		    			ohSnap('Veuillez sélectionner un autre robot', 'red');

				currentSolution.pop();
				currentSolution.pop();
			}
			if (bclock == false) {
				clock.start();
				bclock = true;
			}
 		}
 		,variables: {
			login:user
			, idGame:idG
			, proposition: JSON.stringify(currentSolution)
 		}
 	});

 }

  // retourne id de cellule du robot actuel

  function getRobotActuelCellId() {
  	var cellId; // id de la case du robot actuel

  	if(robotActuel) {
  		var colorRobot = game.robots[robotActuel].color; // couleur du robot actuel
 		if(colorRobot == 'blue') {
 			cellId = "i"+lb+"_j"+cb;
 		} else if (colorRobot == 'green') {
 			cellId = "i"+lv+"_j"+cv;
 		} else if (colorRobot == 'red') {
 			cellId = "i"+lr+"_j"+cr;
 		} else if (colorRobot == 'yellow') {
 			cellId = "i"+lj+"_j"+cj;
 		}

  	}
  	return cellId;
  }


 function addKeyboardEvent() {
 	if(robotActuel) {
 		// si la case du robot actuel est sélectionnée :
 		$( "#"+getRobotActuelCellId()).keydown(function( event ) {
 			//console.log(event);
 		});
 	}
 }


  function initPositions() {
  	for(var i=0; i<game.robots.length; i++) {
		if(robots[i].color == 'blue') {
			lb = robots[i].line;
			cb = robots[i].column;
		} else if(robots[i].color == 'red') {
			lr = robots[i].line;
			cr = robots[i].column;
		} else if(robots[i].color == 'green') {
			lv = robots[i].line;
			cv = robots[i].column;
		} else if(robots[i].color == 'yellow') {
			lj = robots[i].line;
			cj = robots[i].column;
		}
	}
  }

 /*
 	Ajout des listeners de clavier sur les robots
 */
 function initDeplacements() {
 	addCellsListener();
 	initKeyboard();
 	initTouch();
 	//if(!robotActuel) { // la premiere fois on doit initialiser toutes les variables des robots
 	//	initPositions(); // remplie les variables de position de tous les robots
 	//}
	//marquerRobot(); // dessine sa couleur sur la grille
	//addKeyboardEvent();
  /*
  $("#robot_yellow").click(function(){
        var image = $("#robot_yellow");
        image.remove();
   		$("#i0_j5").append(image);
   });
  */
 }

 //initClick();
