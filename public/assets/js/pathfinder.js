var pathsFound = [];
function pathFinder(boardSize) {
  var square = boardSize * boardSize;
  allMap.length = [];
  for (var i = 0; i < square; i++) {
    allMap.push(false);
  }
  pathsFound = [];
  updatePlayersDefault(boardSize);
  for (var p in playersDefault) {
    var intP = parseInt(p, 10);
    if (isNaN(intP) || !intP) continue;

    var player = playersDefault[p];

    min = parseInt(boardSize / 2 + 2, 10);

    var path = [player.pos];
    iterateFinder(path, boardSize, min, 0);
  }
  return true;
}

var allMap = [];

function createFoundPaths (boardSize) {
  var pathFinderOutput = document.getElementById('pathfinderOutput');
  pathFinderOutput.innerHTML = 'Processando...';

  pathFinderOutput.innerHTML = '';
  for (var p in pathsFound) {
    var li = document.createElement('li');
    li.innerHTML =
      "["
      + pathsFound[p].join('],[')
      + "] <div id='board-"
      + (p)
      + "'/>";
    pathFinderOutput.appendChild(li);
    if (isNaN(parseInt(pathsFound[p], 10))) continue;
    createBoard('board-' + p, boardSize);
    displayPath(p + '-', pathsFound[p]);
  }
  pathFinderOutput.innerHTML = '';

  var li = document.createElement('li');
  pathFinderOutput.appendChild(li);
  li.innerHTML = "<div id='board-allMap'/>";
  createBoard('board-allMap', boardSize);
  var square = boardSize * boardSize;
  for (var i = 0; i < square; i++) {
    if (!allMap[i]) {
      allMap[i] = parseInt(Math.random() * 10, 10) % 4 ? false : true;
    }
    var tile = document.getElementById("board-allMap-tile-" + i);
    if (tile) {
      if (allMap[i]) {
        tile.className = 'tile white';
      } else {
        tile.className = 'tile black';
      }
    }
  }
  li.innerHTML += "[" + allMap.join(', ') + "]";

  return true;
}

function fnLeftX(lastX, lastY, firstX, half, path, boardSize, min, iteration) {
  //verificando se pode descer x
  if (testLimits(lastX - 1, lastY, boardSize)) {
    return testPos([lastX - 1, lastY], path, boardSize, min, iteration);
  }
  return false;
}

function fnRightX(lastX, lastY, firstX, half, path, boardSize, min, iteration) {
  //verificando se pode subir x
  if (testLimits(lastX + 1, lastY, boardSize)) {
    return testPos([lastX + 1, lastY], path, boardSize, min, iteration);
  }
  return false;
}

function fnTopY(lastX, lastY, firstY, half, path, boardSize, min, iteration) {
  //verificando se pode subir y
  if (testLimits(lastX, lastY + 1, boardSize)) {
    return testPos([lastX, lastY + 1], path, boardSize, min, iteration);
  }
  return false;
}

function fnBottomY(lastX, lastY, firstY, half, path, boardSize, min, iteration) {
  //verificando se pode descer y
  if (testLimits(lastX, lastY - 1, boardSize)) {
    return testPos([lastX, lastY - 1], path, boardSize, min, iteration);
  }
  return false;
}

function testLimits (x, y, boardSize) {
  if (x < 0 || y < 0 || x >= boardSize || y >= boardSize) {
    return false;
  }
  return true;
}

//pathfinderOutput
function iterateFinder(path, boardSize, min, iteration) {
  //Limite de execução
  if (iteration > 2 * min) return;
  
  var lastPos = path[path.length - 1];
  var firstPos = path[path.length - 1];

  var lastX = lastPos[0];
  var lastY = lastPos[1];

  var firstX = firstPos[0];
  var firstY = firstPos[1];

  var half = parseInt(boardSize / 2, 10);

  var rand = (new Date()).getTime() % 4;

  switch (rand) {
    case 0:
      if (fnLeftX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnRightX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnBottomY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnTopY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      break;
    case 1:
      if (fnTopY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnBottomY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnLeftX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnRightX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      break;
    case 2:
      if (fnBottomY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnTopY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnRightX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnLeftX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      break;
    case 3:
      if (fnRightX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnLeftX(lastX, lastY, firstX, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnTopY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      if (fnBottomY(lastX, lastY, firstY, half, path, boardSize, min, iteration)) {
        return true;
      }
      break;
  }

  var pathFinderOutput = document.getElementById('pathfinderOutput');
  if (pathFinderOutput) {
    pathFinderOutput.innerHTML = 'Processando... [' + path.join('],[') + ']';
  }
}

function testPos(pos, path, boardSize, min, iteration) {
  if (!checkInPath(path, pos) && !hasAdjacent(path, pos)) {
    path.push(pos);
    //verificando se é a vitória
    if (iteration > min && isBullsEye(path[0], pos, boardSize)) {
      var pathFound = path.map((r) => (r));
      pathsFound.push(pathFound);
      return true;
    }
    if (iterateFinder(path, boardSize, min, iteration + 1)) {
      return true;
    }
    path.pop();
    return false;
  }
}

//Verificando se pos já existe em path
function checkInPath(path, pos) {
  for (var p in path) {
    if (path[p][0] == pos[0] && path[p][1] == pos[1]) {
      return true;
    }
  }
  return false;
}

function equalPath(p1, p2) {
  return p1[0] == p2[0] && p1[1] == p2[1];
}

//Verificando se tem adjacente
function hasAdjacent(path, pos) {
  var checkTop = [pos[0], pos[1] - 1];
  var checkRight = [pos[0] + 1, pos[1]];
  var checkBottom = [pos[0], pos[1] + 1];
  var checkLeft = [pos[0] - 1, pos[1]];

  var isTopAdjacent = (!equalPath(path[path.length - 1], checkTop) && checkInPath(path, checkTop));
  var isRightAdjacent = (!equalPath(path[path.length - 1], checkRight) && checkInPath(path, checkRight));
  var isBottomAdjacent = (!equalPath(path[path.length - 1], checkBottom) && checkInPath(path, checkBottom));
  var isLeftAdjacent = (!equalPath(path[path.length - 1], checkLeft) && checkInPath(path, checkLeft));

  var isAdjacent = isTopAdjacent || isRightAdjacent || isBottomAdjacent || isLeftAdjacent;

  var tf = false;
  for (var p in playersDefault) {
    var intP = parseInt(p, 10);
    if (isNaN(intP) || !intP) continue;
    var isTopBad = (equalPath(playersDefault[p].pos, checkTop) && !equalPath(path[0], checkTop));
    var isRightBad = (equalPath(playersDefault[p].pos, checkRight) && !equalPath(path[0], checkRight));
    var isBottomBad = (equalPath(playersDefault[p].pos, checkBottom) && !equalPath(path[0], checkBottom));
    var isLeftBad = (equalPath(playersDefault[p].pos, checkLeft) && !equalPath(path[0], checkLeft));
    tf = tf || isTopBad || isRightBad || isBottomBad || isLeftBad;
  }
  
  if (tf || isAdjacent) {
    return true;
  }
  return false;
}

//Verificando se pos é condição de vitória
function isBullsEye(first, pos, boardSize) {
  var half = parseInt(boardSize / 2, 10);
  if (equalPath([half, half], pos)) {
    return true;
  }
  return false;
}

function displayPath(id, path) {
  var color = '';
  var firstPath = path[0];
  for (var p in playersDefault) {
    var player = playersDefault[p];
    if (firstPath[0] == player.pos[0] && firstPath[1] == player.pos[1]) {
      color = playersDefault[p].color;
      break;
    }
  }

  var boardSize = parseInt(document.forms['form'].boardSize.value, 10);
  for (var pos in path) {
    var num = (path[pos][0] + path[pos][1] * boardSize);
    var tile = document.getElementById("board-" + id + "tile-" + num);
    if (tile) {
      tile.className = 'tile ' + color;
    }
    allMap[num] = true;
  }
}

function onClickPathFind () {
  var boardSize = parseInt(document.forms['form'].boardSize.value, 10);
  pathFinder(boardSize);
  createFoundPaths(boardSize);
}

function changeBoardSize() {
  var boardSize = parseInt(document.forms['form'].boardSize.value, 10);
  //Imprimindo tamanho selecionado
  var boardSizeOutput = document.getElementById('boardSizeOutput');
  if (boardSizeOutput) {
    boardSizeOutput.innerText = boardSize;
  }
}