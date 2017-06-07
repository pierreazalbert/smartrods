function drawBoard(canvas, id, data) {

  var canvasSize = canvas.width;
  var boardSize = canvasSize * 0.9;

  $(canvas).drawRect({
    layer: false,
    name: String('board_' + id),
    x: canvasSize / 2,
    y: canvasSize / 2,
    height: boardSize * 1.1,
    width: boardSize * 1.1,
    cornerRadius: boardSize / 25,
    fillStyle: "#E2E2E2",
    fromCenter: true,
    mouseover: function(layer) {
      console.log('clicked!');
    }
  });

  // Parse input data
  var input =  data.replace(/{/g, "[").replace(/}/g, "]");
  var rods = JSON.parse("[" + input + "]")[0];

  for (var row in rods) {
   var column = 0;
   while (column < 10) {
     //console.log('column ' + column);
     var value = parseInt(rods[row][column], 10);
     //console.log('cell value: ' + value);
     if (value === 0) {
       column = column + 1;
       //console.log('empty cell');
     } else {
       //console.log("adding rod " + value + " to board " + id);
       // Draw rod
       $(canvas).drawRect({
         layer: false,
         name: String("rod_" + value),
         //groups: ["rods"],
         x: canvasSize * 0.05 + boardSize / 10 * column,
         y: canvasSize * 0.05 + boardSize / 10 * row,
         height: boardSize / 10,
         width: boardSize * value / 10,
         fillStyle: $(colours)[value],
         strokeStyle: "#E1E1E1",
         strokeWidth: boardSize / 100,
         cornerRadius: boardSize / 50,
         fromCenter: false
       });
       column = column + value;
     }
   }
 }

}

function createBoard(data) {
  console.log('creating new tile for board ' + data.id);
  // Create new div
  var board = $(boardDiv).clone();
  var canvas = $(board).find('canvas');
  // Give div the id of the board and insert user name
  canvas.attr('id', String('board_' + data.id));
  $(board).find('.board-username').text(data.user);
  // Draw board
  drawBoard(canvas[0], data.id, data.rods);
  // Add div to page
  $('#grid').append(board);
}

function updateBoard(data) {
  console.log('updating contents of board ', data.id);

  // Draw board
  var canvas = $(String('board_' + data.id));
  drawBoard(canvas, data.id, data.rods);

  // In case board is open in info modal, update as well
  var infoCanvas = $(String('board_' + data.id + '_info'));
  drawBoard(infoCanvas, data.id, data.rods);

  // In case board is open in enlarge modal, update as well
  var enlargeCanvas = $(String('board_' + data.id + '_enlarge'));
  drawBoard(enlargeCanvas, data.id, data.rods);
}

function respondCanvas() {
  $('canvas[id]').each( function () {
    var container = $(this).parent();
    var size = $(container).width();
    var id = parseInt($(this).attr('id').split('_')[1], 10);
    var data = tempClassroom.filter(function (board) {
      return (board.id === id);
    });
    $(this).attr('width', size*2);
    $(this).attr('height', size*2);
    drawBoard(this, id, data[0].rods);
  });
}
