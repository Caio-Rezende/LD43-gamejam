var playersDefault = [{
  color: "gold",
  pos: [4, 4]
}, {
  color: "red",
  pos: [0, 8]
}, {
  color: "blue",
  pos: [8, 0]
}, {
  color: "green",
  pos: [0, 0]
}, {
  color: "purple",
  pos: [8, 8]
}];

var mapNames = {
  red : 'shaman',
  blue : 'warrior',
  green : 'lhama',
  purple : 'purple'
}

var playersColors = ['red', 'blue', 'green', 'purple'];

function updatePlayersDefault(size) {
  //posições iniciais de cada cor
  var half = parseInt(size / 2, 10)
  playersDefault[0].pos = [half, half];
  playersDefault[1].pos = [0, 0];
  playersDefault[2].pos = [0, size -1];
  playersDefault[3].pos = [size -1, size -1];
  playersDefault[4].pos = [size -1, 0];
}