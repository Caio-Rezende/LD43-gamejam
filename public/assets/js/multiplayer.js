window.onload = function () {
  //Iniciando as gerações iniciais
  window.onkeyup = gameCycle;

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBWL1Vw_xX_H_HWNYhFKWyaY17LLvRNY2I",
    authDomain: "ld43-gamejam.firebaseapp.com",
    databaseURL: "https://ld43-gamejam.firebaseio.com",
    projectId: "ld43-gamejam",
    storageBucket: "ld43-gamejam.appspot.com",
    messagingSenderId: "199950348470"
  };
  firebase.initializeApp(config);
  var defaultDatabase = firebase.database();

  ref = defaultDatabase.ref();
}

var ref = null;

var sessionName = false;
var gameStart = false;
var thisPlayer = null;
var visitors = [];

var prize = null;
var initialPositions = [];
var players = [];

var turn = 0;
var curPlayer = 0;
var boardSize = 9;
var endState = false;
var truthPositions = [];
var holes = [];

function setSession(val) {
  if (ref) {
    ref.child(val).once('value', (snapshot) => {
      if (!snapshot.val()) {
        gameSet(9);
        ref.child(val).update({
          size: 9,
          turn: 0,
          players : players,
          initialPositions: initialPositions,
          truthPositions : truthPositions,
          endState : false
        });
      } else {
        updateConfig(snapshot.val());
      }

      sessionName = val;
      document.forms['player'].name.disabled = false;

      ref.child(val).on('value', (snapshot) => {
        updateConfig(snapshot.val());
      });
    });
  }
}

function updateConfig (config) {
  boardSize = config.size;
  turn = config.turn;
  players = config.players;
  initialPositions = config.initialPositions;
  truthPositions = config.truthPositions;
  visitors = config.visitors ? config.visitors : [];
  holes = config.holes ? config.holes : [];
  endState = config.endState;
  checkGameStart();
}

function checkGameStart() {
  var allNames = JSON.parse(JSON.stringify(visitors));
  if (!allNames) {
    allNames = [];
  }
  if (players && players.length == 4) {
    document.getElementById('board').innerHTML = '';
    createBoard('board', boardSize);

    var half = parseInt(boardSize / 2, 10);
    paintTile([half, half], boardSize, 'gold');
    prize = [half, half];
    for (var p in players) {
      if (isNaN(parseInt(p, 10))) continue;
      allNames.push(players[p].name);
      if (!players[p].initialPos) {
        players[p].initialPos = [initialPositions[p][0], initialPositions[p][1]];
      }
      if (!players[p].pos) {
        players[p].pos = [players[p].initialPos[0], players[p].initialPos[1]];
      }
      updatePlayersPosition(players[p]);
    }
    for (var h in holes) {
      if (isNaN(parseInt(h, 10))) continue;
      paintTile([holes[h][0], holes[h][1]], boardSize, 'black');
    }
    curPlayer = (turn % 4);
    gameStart = true;

    var maiaAudio = document.getElementById('maiaAudio');
    if (maiaAudio && maiaAudio.src) {
      maiaAudio.play();
    }
  }

  updateTurnPlayerInfo();

  var participants = document.getElementById('participants');
  if (participants) {
    participants.innerText = allNames.join(', ');
  }

  var sessionInfo = document.getElementById('sessionInfo');
  if (sessionInfo) {
    sessionInfo.innerText = 'Turn: ' + turn + '; Game Over: ' + (endState ? 'true' : 'false');
  }
}

function setPlayer(val) {
  thisPlayer = null;
  if (players) {
    for (var p in players) {
      if (isNaN(parseInt(p, 10))) continue;
      if (players[p].name == val) {
        thisPlayer = players[p];
        displayPlayerInfo();
        return;
      }
    }
  }
  if (!players || players.length < 4) {
    var id = players ? players.length : 0;
    thisPlayer = {
      name : val,
      id : id,
      color: playersColors[id],
      initialPos : [initialPositions[id][0], initialPositions[id][1]],
      previousPos : null
    }
    if (!players) {
      players = [];
    }
    players.push(thisPlayer);
    ref.child(sessionName).child('players').update(players);
    displayPlayerInfo();
    alert('Welcome to the game!! The first to the maze may get the prize... But sacrificies, must be made.');
  } else {
    thisPlayer = {
      id: -1,
      name: val,
      color: 'silver'
    };
    displayPlayerInfo();
    thisPlayer = null;
    visitors.push(val);
    ref.child(sessionName).update({visitors: visitors});
  }
}

function displayPlayerInfo () {
  document.forms['player'].style.display = 'none';
  document.getElementById('inGame').style.display = 'block';
  var playerInfo = document.getElementById('playerInfo');
  if (playerInfo) {
    playerInfo.style.backgroundColor = thisPlayer.color;
    if (thisPlayer.id >= 0) {
      playerInfo.innerText = thisPlayer.name + ', you are the ' + thisPlayer.color
    } else {
      playerInfo.innerText = thisPlayer.name + ', you are a visitor'
    }
  }
  
  var thisPlayerPhoto = document.getElementById('thisPlayerPhoto');
  if (thisPlayerPhoto && thisPlayer) {
    thisPlayerPhoto.className = thisPlayer.color;
    thisPlayerPhoto.style.background = '3px solid ' + thisPlayer.color;
  }
}

function isMyTurn () {
  if (thisPlayer && (turn % 4) == thisPlayer.id) {
    return true;
  }
  return false;
}

//Seed inicial gerando o board - apenas o criador da sessão
function gameSet(size) {
  if (!size) {
    return;
  }
  boardSize = size;

  updatePlayersDefault(size);

  initialPositions = [];
  for (var p in playersDefault) {
    var intP = parseInt(p, 10);
    if (isNaN(intP) || !intP) continue;
    initialPositions.push([playersDefault[p].pos[0], playersDefault[p].pos[1]]);
  }
  
  var half = parseInt(size / 2, 10)
  
  prize = [half, half];

  pathFinder(size);
  truthPositions = pathsFound.flat();
  truthPositions.push(prize);

  endState = false;
  turn = 0;
  curPlayer = 0;

  return true;
}

function updatePlayersPosition (player) {
  //Limpando posição prévia
  var previousPos = player.previousPos;
  if (previousPos) {
    paintTile(previousPos, boardSize, 'white');
  }

  //atualizando posição
  var pos = player.pos;
  paintTile(pos, boardSize, player.color);
}

//Aplica cor no tile
function paintTile(pos, boardSize, color) {
  var num = pos[0] + pos[1] * boardSize;
  var pTile = document.getElementById("board-tile-" + num);
  if (pTile) {
    pTile.className = 'tile ' + color;
  }
}

//Verifica movimentação
function makeMove(evt, player) {
  var key = evt.keyCode;
  
  if ([38,69,40,68,37,83,39,70].indexOf(key) === -1) {
    return false;
  }
  player.previousPos = [player.pos[0], player.pos[1]];

  var tf = false;
  
  //UP
  if (key == 38 || key == 69) {
    player.pos[0]--;
  }
  //DOWN
  if (key == 40 || key == 68) {
    player.pos[0]++;
  }
  //LEFT
  if (key == 37 || key == 83) {
    player.pos[1]--;
  }
  //RIGHT
  if (key == 39 || key == 70) {
    player.pos[1]++;
  }

  return true;
}

function isPlayerInPos(checkPos, id) {
  for (var i in players) {
    var intI = parseInt(i, 10);
    if (isNaN(intI) || intI == id) continue;
    if (equalPath(players[i].pos, checkPos)) {
      return players[i].id;
    }
  }
  return false;
}

function checkCurPos(player) {
  var pos = player.pos;
  var outsideBoard = (pos[0] < 0) || (pos[0] >= boardSize) || (pos[1] < 0) || (pos[1] >= boardSize);

  var isHole = false;
  if (!outsideBoard) {
    if (checkInPath(truthPositions, pos)) {
      if (idIn = isPlayerInPos(pos, player.id)) {
        var unluckyPlayer = players[idIn];
        unluckyPlayer.pos = [-1, -1];
        checkCurPos(unluckyPlayer);
      }
    
      updatePlayersPosition(player);

      player.previousPos = [player.pos[0], player.pos[1]];
      return true;
    } else {
      isHole = true;
      holes.push([pos[0], pos[1]]);
      paintTile(pos, boardSize, 'black');
    }
  }

  var availables = [];

  for (var i in initialPositions) {
    var intI = parseInt(i, 10);
    if (isNaN(intI)) continue;
    var initPos = initialPositions[i];
    if (isPlayerInPos(initPos, player.id) === false) {
      availables.push([initPos[0], initPos[1]]);
    }
  }

  var randPos = [];
  if (availables.length > 1) {
    var rand = (new Date()).getTime() % availables.length;
    randPos = availables[rand];
  } else {
    randPos = availables.pop();
  }

  player.pos = [randPos[0], randPos[1]];
  
  updatePlayersPosition(player);

  player.previousPos = null;
}

function checkWinCondition(player) {
  if (equalPath(prize, player.pos)) {
    alert("WIN!!!");
    endState = true;
    updateTurnPlayerInfo();
    return true;
  }
  return false;
}

function updateTurnPlayerInfo() {
  var player = players[curPlayer];
  var curPlayerPhoto = document.getElementById('curPlayerPhoto');
  if (curPlayerPhoto && gameStart) {
    curPlayerPhoto.className = player.color;
    curPlayerPhoto.style.border = '3px solid ' + player.color;
  }
  var turnPlayerInfo = document.getElementById('turnPlayerInfo');
  if (turnPlayerInfo) {
    turnPlayerInfo.style.color = player.color;
    var msg = '[' + sessionName + '] ';
    if (!gameStart) {
      msg += 'Waiting players to connect (' + players.length + '/4)';
    } else {
      if (endState) {
        msg += 'Turn: ' + (turn + 1) + ', WINNER: ' + player.name + '!!!';
      } else {
        msg += 'Turn: ' + (turn + 1) + ', Player: ' + player.name;
      }
    }
    if (visitors.length > 0) {
      msg += ' (visitors: ' + visitors.length + ')';
    }
    turnPlayerInfo.innerHTML = msg;
  }
}

function gameCycle (evt) {
  if (!sessionName || !gameStart || endState || !isMyTurn()) {
    return;
  }

  var player = players[curPlayer];
  if (makeMove(evt, player)) {
    if (checkCurPos(player)) {
      if (checkWinCondition(player)) {
        ref.child(sessionName).update({
          players : players,
          endState : endState
        });
        return;
      }
    }

    turn++;
    curPlayer = (turn % 4);
    updateTurnPlayerInfo();
    ref.child(sessionName).update({
      turn: turn,
      players : players,
      holes : holes
    });
  }
  if (evt.preventDefault) evt.preventDefault();

  return false;
}

var isAudio = true;
var audioSrc = null;
function toggleAudio () {
  var maiaAudio = document.getElementById('maiaAudio');
  if (!audioSrc) {
    audioSrc = maiaAudio.src;
  }
  if (maiaAudio) {
    if (isAudio) {
      maiaAudio.pause();
      maiaAudio.currentTime = 0;
      maiaAudio.src = '';
    } else {
      maiaAudio.src = audioSrc;
      maiaAudio.load();
      maiaAudio.play();
    }
    isAudio = !isAudio;
  }
}