window.onload = function () {
  //Iniciando as gerações iniciais
  gameSet(9, 'board');
  window.onkeyup = gameCycle;
}

var prize = null;
var initialPositions = [];
var players = [];

var turn = 0;
var curPlayer = 0;
var boardSize = 9;
var endState = false;
var truthPositions = [];

//Seed inicial gerando o board
function gameSet(size) {
  if (!size) {
    return;
  }
  boardSize = size;

  //Imprimindo tamanho selecionado
  var boardSizeOutput = document.getElementById('boardSizeOutput');
  boardSizeOutput.innerText = size;

  updatePlayersDefault(size);

  players = JSON.parse(JSON.stringify(playersDefault));
  
  var half = parseInt(size / 2, 10)
  
  prize = [half, half];

  pathFinder(size);
  truthPositions = pathsFound.flat();
  truthPositions.push(prize);

  createBoard('board', size);

  //dando as primeiras cores aos quadrados
  for (var p = 0; p < players.length; p++) {
    players[p].previousPos = null;
    players[p].initialPos = [players[p].pos[0], players[p].pos[1]];
    updatePlayersPosition(players[p]);
    if (p > 0) {
      initialPositions.push([players[p].pos[0], players[p].pos[1]]);
      players[p].id = p - 1;
    }
  }

  players = players.slice(1);

  endState = false;
  turn = 0;
  curPlayer = 0;
  updateTurnPlayerInfo();

  return true;
}

function updatePlayersPosition (player) {
  //Limpando posição prévia
  var previousPos = player.previousPos;
  if (previousPos !== null) {
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
    pTile.style.backgroundColor = color;
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
  var turnPlayerInfo = document.getElementById('turnPlayerInfo');
  if (turnPlayerInfo) {
    turnPlayerInfo.style.color = player.color;
    var msg = '';
    if (endState) {
      msg = 'Turn: ' + (turn + 1) + ', WINNER: ' + player.color + '!!!';
    } else {
      msg = 'Turn: ' + (turn + 1) + ', Color: ' + player.color;
    }
    turnPlayerInfo.innerText = msg;
  }
}

function gameCycle (evt) {
  if (endState) {
    return;
  }
  var player = players[curPlayer];
  if (makeMove(evt, player)) {
    if (checkCurPos(player)) {
      if (checkWinCondition(player)) {
        return;
      }
    }

    turn++;
    curPlayer = (turn % 4);
    updateTurnPlayerInfo();
  }
}