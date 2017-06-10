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

  var last_event = data[0].events.slice(-1)[0];
  // Draw canvas using buffered data
  canvas.attr('id', String('board_' + data[0].id + '_info'));
  drawBoard(canvas[0], id, last_event.rods);
  // Fill in modal header fields including board drawing
  modal.find('#info-user').text(data[0].user);
  modal.find('#info-id').text(data[0].id);
  modal.find('#info-connected').text((data[0].is_connected? "Yes":"No"));

  // Update stats using buffered data
  var stats = JSON.parse(last_event.statistics.replace(/'/g, '"'));
  if(last_event.outcomes == "-") {
    modal.find('#stats-progression').text("-");
    modal.find('#stats-accuracy').text("-");
    modal.find('#stats-fluency').text("-");
    modal.find('#stats-systematicity').text("-");
  }
  else {
    modal.find('#stats-progression').text(stats.progression);
    modal.find('#stats-accuracy').text(stats.accuracy);
    modal.find('#stats-fluency').text(stats.fluency);
    modal.find('#stats-systematicity').text(stats.systematicity);
  }

  // Update activity log using buffered data (after clearing table)
  var table = modal.find('tbody');
  table.empty();
  for (i in data[0].events) {
    var event = data[0].events[i];
    var newrow = $('<tr>').append($('<td>').text(event.timestamp.slice(5,-4)),
                                  $('<td>').text(event.actions),
                                  $('<td>').text(event.outcomes));
    table.append(newrow);
  }
});
