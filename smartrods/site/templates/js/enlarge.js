$(document).on('click', '.open-zoom', function (event) {
  var button = $(event.target); // Button that triggered the modal
  var container = button.parent().parent().parent().parent();
  var board = container.find('canvas');
  var id = parseInt(board.attr('id').split('_')[1], 10);
  var zoom = window.open("/boardzoom/" + id);
});

$(document).on('click', '.enlarge-player-play', function () {
  var button = $(event.target);
  var board_id = parseInt($(button).parent().parent().parent().find('canvas').attr('id').split('_')[1], 10);
  // RESUME UPDATE OF MODAL BOARD
  console.log('resumed board polling');
  button.removeClass('glyphicon-play').addClass('glyphicon-pause');
  $('.play-status').removeClass('label-default').addClass('label-success').text('LIVE');
});

$(document).on('click', '.enlarge-player-pause', function () {
  var button = $(event.target);
  // PAUSE UPDATES OF MODAL BOARD
  console.log('paused board polling');
  button.removeClass('glyphicon-pause').addClass('glyphicon-play');
  $('.play-status').removeClass('label-success').addClass('label-default').text('PAUSED');
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
  drawBoard(canvas[0], id, data[0].events.slice(-1)[0].rods);
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
