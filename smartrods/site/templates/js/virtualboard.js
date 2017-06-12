function updateEnlarge(board_id, rods_data) {
  $.ajax({
    type: "POST",
    url: "/api/boards/"+String(board_id),
    data: rods_data,
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
  }).done(function(result) { console.log(result); });
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
  drawBoard(canvas[0], data.id, data.events.slice(-1)[0].rods);
}

function respondVirtualCanvas() {
  $('canvas[id]').each(function() {
    var container = $(this).parent();
    var size = $(container).width();
    var id = parseInt($(this).attr('id').split('_')[1], 10);
    var data = tempEnlarge;
    $(this).attr('width', size * 2);
    $(this).attr('height', size * 2);
    //console.log(data[0].events.slice(-1)[0].rods);
    drawBoard(this, id, data.events.slice(-1)[0].rods);
  });
}
