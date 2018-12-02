window.onload = function () {
  //Iniciando as gerações iniciais
  gameSet(9, 'board');
  update();
}

var curPlayer = 0;
var prizes = [
  [3, 4], [4, 5], [5, 4], [4, 3]
];

//Seed inicial gerando o board
function gameSet(size, id) {
  //Imprimindo tamanho selecionado
  var boardSizeOutput = document.getElementById('boardSizeOutput');
  boardSizeOutput.innerText = size;

  updatePlayersDefault(size);

  prizes[0] = [half - 1, half];
  prizes[1] = [half + 1, half];
  prizes[2] = [half, half - 1];
  prizes[3] = [half, half + 1];

  var players = playersDefault;

  createBoard(id, size, changeColor);

  //dando as primeiras cores aos quadrados
  for (var p = 0; p < players.length; p++) {
    var player = players[p];
    var pos = player.pos;
    var num = pos[0] + pos[1] * size;
    var pTile = document.getElementById(id + "-tile-" + num);
    pTile.style.backgroundColor = player.color;
  }

  return true;
}

//Seleciona cor do click
function setPlayer(id) {
  curPlayer = id;
}

//Aplica o click no tile para (des)pintar
function changeColor() {
  if (this && this.style) {
    if (this.style.backgroundColor != playersDefault[curPlayer].color) {
      if (!this.dataset.prevStyle) {
        this.dataset.prevStyle = this.style.backgroundColor;
      }
      this.style.backgroundColor = playersDefault[curPlayer].color;
    } else {
      this.style.backgroundColor = this.dataset.prevStyle;
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
    if (tiles[tile] && tiles[tile].style && tiles[tile].style.backgroundColor) {
      var color = tiles[tile].style.backgroundColor;
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