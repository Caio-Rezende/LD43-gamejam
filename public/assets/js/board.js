function createBoard(id, size, change, checkerBoard) {
  //gerando os quadrados pretos ebrancos
  var board = document.getElementById(id);
  board.innerHTML = '';
  board.style.width = 'calc(' + size + '*62px)';
  for (var i = 0; i < size; i++) {
    for (var ii = 0; ii < size; ii++) {
      var num = i + ii * size;
      var obj = document.createElement('tile');
      if (checkerBoard && num % 2) {
        obj.className = 'tile black';
      } else {
        obj.className = 'tile white';
      }
      obj.title = num + " (" + i + ',' + ii + ')';
      obj.id = id + "-tile-" + num;
      obj.dataset.pos = "[" + i + ',' + ii + ']';
      obj.dataset.num = num;
      obj.onclick = change;
      board.appendChild(obj);
    }
  }
}