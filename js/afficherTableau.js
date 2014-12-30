// l'objet global du tableau
var game = {};
// 1) on ramène le tableau dynamiquement par le nom de partie en cours
// pour l'instant elle est fixe sur la patie test1.
var idG;
var user;

var board = {};
var robots = {};
var target = {};

var partie;


  function showGame() {
    idG = document.getElementById('idGame').value;
    user = document.getElementById('login').value;
    XHR( "GET"
       , "/"+idG
       ,   {
            onload : function() {
              game = JSON.parse(this.response);
              board = game.board;
              robots = game.robots;
              target = game.target;
              console.log(game);

              if(board != null && robots != null && target != null)
                dessinerTableau();
                initDeplacements();
            }
     });
  }

/*
XHR( "POST"
     , "/"
     ,   {
          onload : function() {
            console.log(this.response);
          }
   });
*/

// connection au socket :
/*
socket = io.connect();
socket.on('participants', function(data) {
     console.log(data);
     var ul = document.getElementById('lesParticipants');
     ul.innerHTML='';
      for(p in data.participants) {
       var li = document.createElement('li');
       ul.appendChild( li );
       li.appendChild( document.createTextNode( data.participants[p] ) );
      }
    });
*/
// fonction qui permet de dessiner le tableau  :




function dessinerTableau() {
  dessinerGrille();
  dessinerCible();
  dessinerRobots();

}


// dessigner grille :

function dessinerGrille() {
  partie = document.getElementById('tablePartie');
  if(partie) {
    var tbl=document.createElement('table');
    tbl.id = "tableJeu";
    tbl.style.width='400px';
    tbl.style.height='400px';
    tbl.style.tableLayout="fixed";
    tbl.setAttribute('border','1');
    var tbdy=document.createElement('tbody');

    for (var i = 0; i < board.length; i++) {
        var tr=document.createElement('tr');
        for(var j=0; j < board[i].length;j++){
            var td=document.createElement('td');
            var cell = board[i][j];
            var cellId = 'i'+i+'_j'+j;
            var g = cell.g;
            var h = cell.h;
            var b = cell.b;
            var d = cell.d;
            // hautGras basGras gaucheGras noBorderDroite noBorderBas droiteGras noBorderBas
            var cellCls = '';
            if(g) {
              cellCls += 'gaucheGras ';
            } else {
              //cellCls += 'noBorderGauche ';
            }
            if(h) {
              cellCls += 'hautGras ';
            } else {
              //cellCls += 'noBorderHaut ';
            }
            if(b) {
              cellCls += 'basGras ';
            } else {
              //cellCls += 'noBorderBas ';
            }
            if(d) {
              cellCls += 'droiteGras';
            } else {
              //cellCls += 'noBorderDroite';
            }

            td.appendChild(document.createTextNode('.'));
            td.className  = cellCls;
            td.id = cellId;
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    };

    tbl.appendChild(tbdy);
    partie.appendChild(tbl)
  } else {
    console.log('partie is not defined');
  }
}

// dessiner obstacles:

function getTargetImg(color) {
  var imgTarget = document.createElement('img');
  imgTarget.setAttribute("id", "target_"+color+".png");
  imgTarget.src = "/img/target_"+color+".png";
  imgTarget.width = "15";
  imgTarget.height = "15";

  return imgTarget;
}
function dessinerCible() {
    //console.log(target);
    if(target) {
      var l = target.l;
      var c = target.c;
      var t = target.t;
      var cell = document.getElementById('i'+l+'_j'+c);

      if(cell) {
        var targetImg = getTargetImg(t);
        cell.appendChild(targetImg);
        //cell.style.background=" url('/img/target.png') no-repeat right top";
        //cell.style.backgroundSize ="100% 100%";
      }  else {
        console.log('not found target !');
      }
    }
}


 function getRobotImg(color) {
  var img = document.createElement('img');
  img.setAttribute("id", "robot_"+color);
  img.src = "/img/robot_"+color+".png";
  img.width = "15";
  img.height = "15";

  return img;
}
// dessiner robots
function dessinerRobots() {
  for (var i = 0; i < robots.length; i++) {
    var line = robots[i].line;
    var column = robots[i].column;
    var color = robots[i].color;

    if(partie) {
      var cell = document.getElementById('i'+line+'_j'+column);
      if(cell) {
        var robotImg = getRobotImg(color);
        cell.appendChild(robotImg);
        //cell.style.background=" url('/img/robot_"+color+".png') no-repeat right top";
        //cell.style.backgroundSize ="100% 100%";
      } else {
        console.log('not found robot !');
      }
    }
  };
}
