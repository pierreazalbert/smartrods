function initVirtual(board_id) {
  $.ajax({
    type: "GET",
    url: "/api/boards/"+String(board_id),
    data: '',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    //username: 'smartrods',
    //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
    success: function(result) {
      $('.virtual-player-status').each(function() {
        $(this)[0].textContent = "LIVE";
        $(this).removeClass('label-danger').removeClass('label-info').addClass('label-success');
      });
      $('.virtual-player-play').removeClass('disabled');
      $('.virtual-player-pause').removeClass('disabled');
    },
    error: function(error) {
      $('.virtual-player-status').each(function() {
        $(this)[0].textContent = "OFFLINE";
        $(this).removeClass('label-success').addClass('label-danger');
      });
      $('.virtual-player-play').addClass('disabled');
      $('.virtual-player-pause').addClass('disabled');
      console.log(error);
    }
  }).done(function(data) {
    console.log(data);
    createVirtualBoard(data);
  });
}

function drawVirtual(canvas, id, data) {

  var canvasSize = canvas.width;
  var boardSize = canvasSize * 0.9;

  $(canvas).drawRect({
    layer: true,
    x: canvasSize / 2,
    y: canvasSize / 2,
    height: boardSize * 1.1,
    width: boardSize * 1.1,
    cornerRadius: boardSize / 25,
    fillStyle: "#E2E2E2",
    fromCenter: true,
  }).scaleCanvas({
    layer: true,
    scale:1
  }).restoreCanvas({
    layer: true,
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
           $(canvas).addLayer({
             type: 'rectangle',
             layer: true,
             draggable: true,
             //name: String("rod_" + value),
             groups: ["rods"],
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
   $(canvas).drawLayers();

}

function createVirtualBoard(data) {
  console.log('creating canvas for virtual board ' + data.id);
  // Create new div
  var canvas = $('canvas');
  console.log(canvas);
  // Give div the id of the board and insert user name
  canvas.attr('id', String('board_' + data.id));
  $('#virtual-username').text(data.user);
  // Draw board
  //console.log(data.events.slice(-1)[0].rods);
  drawVirtual(canvas[0], data.id, data.events.slice(-1)[0].rods);
}

// function respondVirtualCanvas() {
//   $('canvas[id]').each(function() {
//     var container = $(this).parent();
//     var size = $(container).width();
//     var id = parseInt($(this).attr('id').split('_')[1], 10);
//     var data = tempEnlarge;
//     $(this).attr('width', size * 2);
//     $(this).attr('height', size * 2);
//     //console.log(data[0].events.slice(-1)[0].rods);
//     drawVirtual(this, id, data.events.slice(-1)[0].rods);
//   });
// }
