$(document).on('click', '.open-zoom', function (event) {
  var button = $(event.target); // Button that triggered the modal
  var container = button.parent().parent().parent().parent();
  var board = container.find('canvas');
  var id = parseInt(board.attr('id').split('_')[1], 10);
  var zoom = window.open("/boardzoom/" + id);
});

$(document).on('click', '.enlarge-player-pause', function () {
  var button = $(event.target);
  console.log('paused zoom update');
  button.removeClass('glyphicon-pause').addClass('glyphicon-play');
  button.removeClass('enlarge-player-pause').addClass('enlarge-player-play');
  $('.enlarge-player-previous').removeClass('disabled');
  $('.enlarge-player-next').removeClass('disabled');
});

$(document).on('click', '.enlarge-player-play', function () {
  var button = $(event.target);
  var board_id = parseInt($(button).parent().parent().parent().find('canvas').attr('id').split('_')[1], 10);
  console.log('resumed zoom update');
  button.removeClass('glyphicon-play').addClass('glyphicon-pause');
  button.removeClass('enlarge-player-play').addClass('enlarge-player-pause');
  $('.enlarge-player-previous').addClass('disabled');
  $('.enlarge-player-next').addClass('disabled');
});

$(document).on('click', '.enlarge-player-previous', function () {
  var button = $(event.target);
  console.log('zoom previous action');


  drawBoard(enlargeCanvas, data.id, data.rods);
});

$(document).on('click', '.enlarge-player-next', function () {
  var button = $(event.target);
  console.log('zoom next action');


  drawBoard(enlargeCanvas, data.id, data.rods);
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

});
