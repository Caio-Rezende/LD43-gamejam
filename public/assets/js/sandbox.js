window.onload = function () {
  //Iniciando as gerações iniciais
  gameSet(9, 'board');
  update();
}

var curColor = 0;

//Seed inicial gerando o board
function gameSet(size, id) {
  //Imprimindo tamanho selecionado
  var boardSizeOutput = document.getElementById('boardSizeOutput');
  boardSizeOutput.innerText = size;

  updatePlayersDefault(size);

  var players = playersDefault;

  createBoard(id, size, changeColor);

  //dando as primeiras cores aos quadrados
  for (var p = 0; p < players.length; p++) {
    var player = players[p];
    var pos = player.pos;
    var num = pos[0] + pos[1] * size;
    var pTile = document.getElementById(id + "-tile-" + num);
    pTile.className = 'tile ' + player.color;
  }

  return true;
}

//Seleciona cor do click
function setPlayer(id) {
  curColor = id;
}

//Aplica o click no tile para (des)pintar
function changeColor() {
  if (this && this.style) {
    if (this.className != ('tile ' + playersDefault[curColor].color)) {
      if (!this.dataset.prevStyle) {
        this.dataset.prevStyle = this.className;
      }
      this.className = 'tile ' + playersDefault[curColor].color;
    } else {
      this.className = this.dataset.prevStyle;
    }
  }
  update();
}

//Gera os caminhos de cada cor
function update() {
  var text = [];
  var tiles = document.getElementById('board').getElementsByTagName('tile');
  var outputType = (document.forms['form'] && document.forms['form'].outputType.value)
    ? document.forms['form'].outputType.value
    : 'pos';

  //verificando quais cores estão em cada quadrado
  for (tile in tiles) {
    if (tiles[tile] && tiles[tile].className) {
      var color = tiles[tile].className.replace('tile ', '');
      if (!text[color]) {
        text[color] = [];
      }
      text[color].push(tiles[tile].dataset[outputType]);
    }
  }

  //imprimindo a lista de posições por cor
  for (var color in text) {
    var p = document.getElementById(color);
    if (p) {
      p.innerText = text[color].join(', ')
    }
  }

  return true;
}