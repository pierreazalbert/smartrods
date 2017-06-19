function initVirtual(board_id) {
  $.ajax({
    type: "GET",
    url: "/api/virtualboards/" + String(board_id),
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
    tempVirtual = data;
  });
}

function nearest(number, n) {
  return Math.round(number / n) * n;
}

function drawVirtual(canvas, id, data) {

  var canvasSize = $(canvas).width();
  $(canvas).attr('width', canvasSize).attr('height', canvasSize).detectPixelRatio();
  var boardSize = canvasSize;
  var gridSize = boardSize / 10;

  $(canvas).drawRect({
    layer: true,
    x: canvasSize / 2,
    y: canvasSize / 2,
    height: boardSize,
    width: boardSize,
    fillStyle: "#E2E2E2",
    fromCenter: true,
  });

  // Parse input data
  if (data != "-") {
    var input = data.replace(/{/g, "[").replace(/}/g, "]");
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
            data: {
              'value': value,
              'column': column,
              'row': parseInt(row,10)
            },
            //name: String("rod_" + value),
            groups: ["rods"],
            x: boardSize / 10 * column,
            y: boardSize / 10 * row,
            height: boardSize / 10,
            width: boardSize * value / 10,
            fillStyle: $(colours)[value],
            strokeStyle: "#E1E1E1",
            strokeWidth: boardSize / 100,
            cornerRadius: boardSize / 50,
            fromCenter: false,
            bringToFront: true,
            drag: function(layer) {
              layer.x = nearest(layer.x, gridSize);
              layer.y = nearest(layer.y, gridSize);
              if (layer.x + layer.width > boardSize) {
                layer.x = boardSize - layer.width;
              }
              if (layer.x < 0) {
                layer.x = 0;
              }
              if (layer.y + layer.height > boardSize) {
                layer.y = boardSize - layer.height;
              }
              if (layer.y < 0) {
                layer.y = 0;
              }
            },
            dragstop: function(layer) {
              console.log('moved rod', layer.data.value);
              layer.data.column = Math.round(layer.x / boardSize * 10);
              layer.data.row = Math.round(layer.y / boardSize * 10);
              if (detectOverlap(layer) == false) {
                updateVirtualArray();
              }
            }
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

function respondVirtualCanvas() {
  console.log('resizing virtual canvas');
  var size = $('canvas').width();
  $('canvas').attr('width', size);
  $('canvas').attr('height', size);
  $('canvas').clearCanvas().drawLayers();
}

function addVirtualRod(value) {
  var canvasSize = $('canvas').width();
  var boardSize = canvasSize;
  var gridSize = boardSize / 10;
  $('canvas').addLayer({
    type: 'rectangle',
    layer: true,
    draggable: true,
    data: {
      'value': value,
      'column': 0,
      'row': 0
    },
    groups: ["rods"],
    x: 0,
    y: 0,
    height: boardSize / 10,
    width: boardSize * value / 10,
    fillStyle: $(colours)[value],
    strokeStyle: "#E1E1E1",
    strokeWidth: boardSize / 100,
    cornerRadius: boardSize / 50,
    fromCenter: false,
    bringToFront: true,
    drag: function(layer) {
      layer.x = nearest(layer.x, gridSize);
      layer.y = nearest(layer.y, gridSize);
      if (layer.x + layer.width > boardSize) {
        layer.x = boardSize - layer.width;
      }
      if (layer.x < 0) {
        layer.x = 0;
      }
      if (layer.y + layer.height > boardSize) {
        layer.y = boardSize - layer.height;
      }
      if (layer.y < 0) {
        layer.y = 0;
      }
    },
    add: function (layer) {
      console.log('added rod', layer.data.value);
      if (detectOverlap(layer) == false) {
        updateVirtualArray();
      }
    },
    dragstop: function(layer) {
      console.log('moved rod', layer.data.value);
      layer.data.column = Math.round(layer.x / boardSize * 10);
      layer.data.row = Math.round(layer.y / boardSize * 10);
      if (detectOverlap(layer) == false) {
        updateVirtualArray();
      }
    }
  }).drawLayers();
}

function detectOverlap(layer) {
  var rods = $('canvas').getLayerGroup('rods');
  var overlap = false;
  $(rods).each(function() {
    if (layer.index != this.index) {
      if (layer.x < this.x + this.width &&
      layer.x + layer.width > this.x &&
      layer.y < this.y + this.height &&
      layer.y + layer.height > this.y) {
        console.log('overlap!');
        $('#virtual-info').text('Warning: some rods are overlapping, cannot update contents of board');
        overlap = true;
      }
    }
    if (overlap == true) {
      $('#virtual-info').text('Warning: some rods are overlapping, cannot update contents of board');
    }
    else {
      $('#virtual-info').text('');
    }
  });
  return overlap;
}

function clearBoard() {
  $('canvas').removeLayerGroup('rods').drawLayers();
  updateVirtualArray();
}

function updateVirtualArray() {
  var array = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  var contents = $('canvas').getLayerGroup('rods');
  $(contents).each(function() {
    var value = this.data.value;
    var column = this.data.column;
    var row = this.data.row
    //console.log(value, column, row);
    for (i = 0; i < value; i++) {
      array[row][column + i] = value;
    }
  });
  updateVirtualBoard(array);
}

function updateVirtualBoard(array) {
  var now = new Date();
  var timestamp = String(now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds());
  $.ajax({
           type: "POST",
           url: "/api/virtualboards/"+board_id,
           data: JSON.stringify({"rods":array, "timestamp":timestamp}),
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function(result) {
             console.log(result);
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
  });
}
