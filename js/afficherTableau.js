// l'objet global du tableau
var game = {};
// 1) on ramène le tableau dynamiquement par le nom de partie en cours
// pour l'instant elle est fixe sur la patie test1.

var board = {};
var robots = {};
var target = {};

var partie;


  function showGame() {

    XHR( "GET"
       , "/"+document.getElementById('idGame').value
       ,   { 
            onload : function() {
              game = JSON.parse(this.response);
              board = game.board;
              robots = game.robots;
              target = game.target;

              console.log(game);

              if(board != null && robots != null && target != null)
                dessinerTableau();  
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
    tbl.style.width='400px';
    tbl.style.height='400px';
    
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

function dessinerCible() {
    
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
        cell.style.background=" url('/img/robot_"+color+".png') no-repeat right top";
        cell.style.backgroundSize ="100% 100%";
      } else {
        console.log('not found !');
      }
    }
  };
}