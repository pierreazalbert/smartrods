var enlargeButton = $('<button>').attr('class', 'btn enlarge-btn').attr('data-toggle', 'modal').attr('data-target', '#enlargeModal').text('Enlarge');
var infoButton = $('<button>').attr('class', 'btn info-btn').attr('style', 'top:50%').attr('data-toggle', 'modal').attr('data-target', '#infoModal').text('More info');
var overlayDiv = $('<div>').attr('class', 'overlay').append(enlargeButton, infoButton);

var canvasDiv = $('<canvas>').attr('width', '200').attr('height', '200');
var nameDiv = $('<span>').attr('class', 'board-username').attr('style', 'text-align:left');
var boardDiv = $('<div>').attr('class', 'col-xs-12 col-sm-4 col-md-3 col-lg-2 tile').attr('onclick', '""').append(canvasDiv, nameDiv, overlayDiv);

var startButton =  $('<span>').attr('class', 'glyphicon glyphicon-play player-start').attr('style', 'color:#4A4A4A; font-size:150%')
var pauseButton =  $('<span>').attr('class', 'glyphicon glyphicon-pause player-pause').attr('style', 'color:#4A4A4A; font-size:150%')
var playButton =  $('<span>').attr('class', 'glyphicon glyphicon-play player-resume').attr('style', 'color:#4A4A4A; font-size:150%')
var stopButton =  $('<span>').attr('class', 'glyphicon glyphicon-stop player-stop').attr('style', 'color:#4A4A4A; font-size:150%; padding-left:1%; padding-right:0.7%')

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

function pollClassroom() {
  $.ajax({
           type: "GET",
           url: "/api/classrooms/{{current_user.classroom_id}}",
           data: '',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {
             //console.log(result);
           },
           error: function (error) { console.log(error); }
  })
    .done(function(data) {

      // The first time we poll we create everything
      if (tempClassroom === null) {
        for (i in data) {
          createBoard(data[i]);
        }
      }
      // Otherwise, check if something has changed
      else {
        // Check if some of the boards have changed
        for (i in data) {

          // Check if board exists in previous data received
          var last = tempClassroom.filter(function (board) {
            return (board.id === data[i].id);
          });

          if (last === null) {
            createBoard(data[i]);
          }
          else if (data[i].rods != last[0].rods) {
            updateBoard(data[i]);
          }
          else {
            console.log('no boards to update');
          }
      }
      };

      tempClassroom = data;
      respondCanvas();

    })
    .always(function() {
      setTimeout(pollClassroom, 5000);
    });
}

function pollBoard(board_id) {
  $.ajax({
           type: "GET",
           url: String("/api/boards/" +  board_id),
           data: '',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) { /*console.log(result);*/ },
           error: function (error) { console.log(error); }
  })
    .done(function(data) {

      //console.log(data.activity.slice(-1)[0])

      // The first time we poll we create the board drawing
      if (boardTemp === null) {
        console.log('rendering board ' + data.id);
        $('canvas').attr('id', String('board_' + data.id));
        $('#enlarge-user').text(data.user);
        drawBoard($('canvas')[0], data.id, data.activity.slice(-1)[0].rods);
      }
      // Otherwise, check if something has changed
      else {

        if (boardTemp.activity.slice(-1)[0].rods != data.activity.slice(-1)[0].rods) {
          console.log('updating board ' + data.id);
          drawBoard($('canvas')[0], data.id, data.activity.slice(-1)[0].rods);
        }
        else {
          console.log('no boards to update');
        }

      }

      boardTemp = data;
      //respondCanvas();

    })
    .always(function() {
      pollBoardTimer = setTimeout(function() { pollBoard(board_id); }, 5000);
    });
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

$(document).on('click', '.enlarge-player-pause', function () {
  var button = $(event.target);
  clearTimeout(pollBoardTimer);
  console.log('paused board polling');
  button.removeClass('glyphicon-pause').addClass('glyphicon-play');
  $('.play-status').removeClass('label-success').addClass('label-default').text('PAUSED');
});

$(document).on('click', '.toggle-button:not(.active)', function () {

  if ($(this).hasClass('toggle-stats')){

    $('.toggle-button').each( function () {
      $(this).removeClass('active');
    });
    $('.toggle-stats').each( function () {
      $(this).addClass('active');
    });
  }
  else {
    $('.toggle-button').each( function () {
      $(this).removeClass('active');
    });
    $('.toggle-boards').each( function () {
      $(this).addClass('active');
    });
  }

});

$(document).on('click', '.enlarge-player-play', function () {
  var button = $(event.target);
  var board_id = parseInt($(button).parent().parent().parent().find('canvas').attr('id').split('_')[1], 10);
  pollBoard(board_id);
  console.log('resumed board polling');
  button.removeClass('glyphicon-play').addClass('glyphicon-pause');
  $('.play-status').removeClass('label-default').addClass('label-success').text('LIVE');
});

$(document).on('click', '.classroom-player-start', function () {

  console.log('clicked on start');

  $('.classroom-player-start').each( function () {
    $(this).removeClass('glyphicon-play').addClass('glyphicon-pause');
    $(this).removeClass('classroom-player-start').addClass('classroom-player-pause');
  });
  $('.classroom-player-stop').each( function () {
    $(this).removeClass('hidden');
  });
  $('.classroom-player-time').each( function () {
    $(this).removeClass('hidden');
  });
});

$(document).on('click', '.classroom-player-pause', function () {
  console.log('clicked on pause');
  $('.classroom-player-pause').each( function () {
    $(this).removeClass('glyphicon-pause').addClass('glyphicon-play');
    $(this).removeClass('classroom-player-pause').addClass('classroom-player-play');
  });
});

$(document).on('click', '.classroom-player-play', function () {
  console.log('clicked on play');
  $('.classroom-player-play').each( function () {
    $(this).removeClass('glyphicon-play').addClass('glyphicon-pause');
    $(this).removeClass('classroom-player-play').addClass('classroom-player-pause');
  });
});

$(document).on('click', '.classroom-player-stop', function () {
  console.log('clicked on stop');
  $('.classroom-player-stop').each( function () {
    $(this).addClass('hidden');
  });
  $('.classroom-player-time').each( function () {
    $(this).addClass('hidden');
  });
  $('.classroom-player-play').each( function () {
    $(this).removeClass('classroom-player-play').addClass('classroom-player-start');
  });
  $('.classroom-player-pause').each( function () {
    $(this).removeClass('glyphicon-pause').addClass('glyphicon-play');
    $(this).removeClass('classroom-player-pause').addClass('classroom-player-start');
  });
});

$(document).on('click', '.open-zoom', function (event) {

  var button = $(event.target); // Button that triggered the modal

  var container = button.parent().parent().parent().parent();
  var board = container.find('canvas');
  var id = parseInt(board.attr('id').split('_')[1], 10);
  var zoom = window.open("/boardzoom/" + id);

});

$(document).on('click', '.enlarge-btn', function (event) {

  // Get parent board info
  var button = $(event.target); // Button that triggered the modal
  var container = button.parent().parent();
  var board = container.find('canvas');
  var id = parseInt(board.attr('id').split('_').pop(), 10);
  var modal = $('#enlargeModal');
  var canvas = modal.find('canvas');
  var size = $(window).width();
  $(canvas).attr('width', size*2);
  $(canvas).attr('height', size*2);

  // Board data has already been loaded so no need for new ajax query
  var data = tempClassroom.filter(function (board) {
    return (board.id === id);
  });

  // Draw canvas using buffered data
  canvas.attr('id', String('board_' + data[0].id + '_enlarge'));
  drawBoard(canvas[0], id, data[0].rods);
  // Fill in modal header fields including board drawing
  modal.find('#enlarge-user').text(data[0].user);

//   var zoom = window.open();
//   zoom.document.write("<div class='container'><canvas width='200' height='200'></canvas></div>");
//
//   var canvas = zoom.find('canvas');
//   console.log(canvas);
//   var size = zoom.height();
//   $(canvas).attr('width', size*2);
//   $(canvas).attr('height', size*2);
//
//   $.ajax({
//            type: "GET",
//            url: String("/api/boards/"+id),
//            data: '',
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            username: 'smartrods',
//            password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
//            success: function (result) {/*console.log(result);*/},
//            error: function (error) { console.log(error); }
//   }).done(function(data) {
//
//     drawBoard(canvas[0], id, data.rods[0]);
//
//   });
//
});

// function getBoardData (event) {
//
// }

$(document).on('click', '.info-btn', function (event) {

  // Get parent board info
  var button = $(event.target); // Button that triggered the modal
  var container = button.parent().parent();
  var board = container.find('canvas');
  var id = parseInt(board.attr('id').split('_').pop(), 10);
  var modal = $('#infoModal');
  var canvas = modal.find('canvas');
  var size = container.width();
  $(canvas).attr('width', size*2);
  $(canvas).attr('height', size*2);

  // Board data has already been loaded so no need for new ajax query
  var data = tempClassroom.filter(function (board) {
    return (board.id === id);
  });

  // Draw canvas using buffered data
  canvas.attr('id', String('board_' + data[0].id + '_info'));
  drawBoard(canvas[0], id, data[0].rods);
  // Fill in modal header fields including board drawing
  modal.find('#info-user').text(data[0].user);
  modal.find('#info-id').text(data[0].id);
  modal.find('#info-connected').text((data[0].is_connected? "Yes":"No"));

  // $.ajax({
  //          type: "GET",
  //          url: String("/api/boards/"+id),
  //          data: '',
  //          contentType: "application/json; charset=utf-8",
  //          dataType: "json",
  //          username: 'smartrods',
  //          password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
  //          success: function (result) {/*console.log(result);*/},
  //          error: function (error) { console.log(error); }
  // }).done(function(data) {
  //
  //   // Render table for activity log
  //   // ... make function to compare rods objects and extract changes
  //
  //   // Fill in data for statistics tab
  //   // ... make function to calculate stats based on current exercise
  //
  // });

});
