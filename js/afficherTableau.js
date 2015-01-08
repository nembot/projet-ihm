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



  /*
    Id c'est l'identifiant du div dans lequel on dessine la grille
  */
  function showGame(idDiv, idGame) {
    idG = idGame;
    user = document.getElementById('login').value;
    XHR( "GET"
       , "/"+  idGame
       ,   {
            onload : function() {
              game = JSON.parse(this.response);
              board = game.board;
              robots = game.robots;
              target = game.target;
              console.log(game);

              if(board != null && robots != null && target != null)
                dessinerTableau(idDiv, idGame);
                try {
                  initDeplacements();  
                } catch(e){

                }
                
            }
     });
  }

// fonction qui permet de dessiner le tableau  :

function dessinerTableau(idDiv, idGame) {
  dessinerGrille(idDiv);
  dessinerCible();
  dessinerRobots();
}


// dessigner grille :
/* 
  modification : 
  J'ai ajouté un id pour la cible du dessin 
*/

function dessinerGrille(id) {
  partie = document.getElementById(id);
  if(partie) {
    var tbl=document.createElement('table');
    tbl.id = "tableJeu";
    tbl.className = "table table-bordered";
    //tbl.style.width='400px';
    //tbl.style.height='400px';
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

            //td.appendChild(document.createTextNode(''));
            td.className  = cellCls;
            td.id = cellId;
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    };

    tbl.appendChild(tbdy);
    partie.appendChild(tbl)
  } else {
    console.log('partie non définie');
  }
}

function dessinerCible() {
    //console.log(target);
    if(target) {
      var l = target.l;
      var c = target.c;
      var t = target.t;
      var cell = document.getElementById('i'+l+'_j'+c);

      if(cell) {
        cell.style.background=" url('/img/target_"+t+".png') no-repeat right top";
        cell.style.backgroundSize ="100% 100%";
      }  else {
        console.log('cible non trouvée ..');
      }
    }
}


 function getRobotImg(color) {
  var img = document.createElement('img');
  img.setAttribute("id", "robot_"+color);
  img.src = "/img/robot_"+color+".png";
  img.className = "robot_partie"
  //img.width = "15";
  //img.height = "15";

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
      } else {
        console.log('not found robot !');
      }
    }
  };
}
