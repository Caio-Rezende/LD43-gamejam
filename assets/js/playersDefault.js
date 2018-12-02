var playersDefault = [{
  color: "gold",
  pos: [4, 4]
}, {
  color: "red",
  pos: [4, 8]
}, {
  color: "blue",
  pos: [8, 4]
}, {
  color: "green",
  pos: [0, 4]
}, {
  color: "purple",
  pos: [4, 0]
}];

function updatePlayersDefault(size) {
  //posições iniciais de cada cor
  var half = parseInt(size / 2, 10)
  playersDefault[0].pos = [half, half];
  playersDefault[1].pos = [0, half];
  playersDefault[2].pos = [half, 0];
  playersDefault[3].pos = [half, half * 2];
  playersDefault[4].pos = [half * 2, half];
}