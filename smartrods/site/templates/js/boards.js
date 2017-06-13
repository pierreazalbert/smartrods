var enlargeButton = $('<button>').attr('class', 'btn enlarge-btn').attr('data-toggle', 'modal').attr('data-target', '#enlargeModal').text('Enlarge');
var infoButton = $('<button>').attr('class', 'btn info-btn').attr('style', 'top:50%').attr('data-toggle', 'modal').attr('data-target', '#infoModal').text('More info');
var overlayDiv = $('<div>').attr('class', 'overlay').append(enlargeButton, infoButton);

var canvasDiv = $('<canvas>').attr('width', '200').attr('height', '200');
var nameDiv = $('<span>').attr('class', 'board-username').attr('style', 'text-align:left');
var boardDiv = $('<div>').attr('class', 'col-xs-12 col-sm-4 col-md-3 col-lg-2 tile').attr('onclick', '""').append(canvasDiv, nameDiv, overlayDiv);

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
  });

  // Parse input data
  if (data != "-") {

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
  //console.log(data.events.slice(-1)[0].rods);
  drawBoard(canvas[0], data.id, data.events.slice(-1)[0].rods);
  // Add div to page
  $('#grid').append(board);
}

function updateBoard(data) {
  console.log('updating contents of board ', data.id);

  // Draw board
  var canvas = $(String('#board_' + data.id));
  drawBoard(canvas, data.id, data.events.slice(-1)[0].rods);

  // In case board is open in info modal, update as well
  var infoCanvas = $(String('#board_' + data.id + '_info'));
  drawBoard(infoCanvas, data.id, data.events.slice(-1)[0].rods);

  // In case board is open in enlarge modal, update as well
  var enlargeCanvas = $(String('#board_' + data.id + '_enlarge'));
  if ($('.enlarge-player-pause').length) {
    drawBoard(enlargeCanvas, data.id, data.events.slice(-1)[0].rods);
  }
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
    //console.log(data[0].events.slice(-1)[0].rods);
    drawBoard(this, id, data[0].events.slice(-1)[0].rods);
  });
}

var colours = [
    "#E1E1E1", // 0 - empty
    "#FFFFFF", // 1 - white
    "#D0011B", // 2 - red
    "#7ED321", // 3 - light green
    "#BD0FE1", // 4 - purple
    "#F7E500", // 5 - yellow
    "#417505", // 6 - dark green
    "#4A4A4A", // 7 - black
    "#8B572A", // 8 - brown
    "#4990E2", // 9 - blue
    "#F6A623" // 10 - orange
  ];
