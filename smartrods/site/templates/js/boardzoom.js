function updateEnlarge() {
  $.ajax({
    type: "GET",
    url: "/api/virtualboards/"+String(board_id),
    data: '',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    //username: 'smartrods',
    //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
    success: function(result) {
      $('.enlarge-player-status').each(function() {
        $(this)[0].textContent = "LIVE";
        $(this).removeClass('label-danger').removeClass('label-info').addClass('label-success');
      });
      $('.enlarge-player-play').removeClass('disabled');
      $('.enlarge-player-pause').removeClass('disabled');
    },
    error: function(error) {
      $('.enlarge-player-status').each(function() {
        $(this)[0].textContent = "OFFLINE";
        $(this).removeClass('label-success').addClass('label-danger');
      });
      $('.enlarge-player-play').addClass('disabled');
      $('.enlarge-player-pause').addClass('disabled');
      console.log(error);
    }
  }).done(function(data) {

    // The first time we poll we create everything
    if (tempEnlarge === null) {
        createEnlargeBoard(data);
    }
    // Otherwise, check if something has changed
    else {
        if (data.events.slice(-1)[0].rods != tempEnlarge.events.slice(-1)[0].rods) {
          updateBoard(data);
        }
        else {
          console.log('no boards to update');
        }
    }

    tempEnlarge = data;
    respondEnlargeCanvas();

  });
}

function createEnlargeBoard(data) {
  console.log('creating enlarged canvas for board ' + data.id);
  // Create new div
  var canvas = $('canvas');
  // Give div the id of the board and insert user name
  canvas.attr('id', String('board_' + data.id));
  $('#enlarge-username').text(data.user);
  // Draw board
  //console.log(data.events.slice(-1)[0].rods);
  drawBoard(canvas[0], data.id, data.events.slice(-1)[0].rods);
}

function respondEnlargeCanvas() {
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

$(document).on('click', '.enlarge-player-pause', function () {
  var button = $(event.target);
  console.log('paused zoom update');
  button.removeClass('glyphicon-pause').addClass('glyphicon-play');
  button.removeClass('enlarge-player-pause').addClass('enlarge-player-play');
  clearInterval(enlargeTimer);
  $('.enlarge-player-status').each(function() {
    $(this)[0].textContent = "PAUSED";
    $(this).removeClass('label-success').addClass('label-default');
  });
});

$(document).on('click', '.enlarge-player-play', function () {
  var button = $(event.target);
  console.log('resumed zoom update');
  button.removeClass('glyphicon-play').addClass('glyphicon-pause');
  button.removeClass('enlarge-player-play').addClass('enlarge-player-pause');
  enlargeTimer = setInterval(updateEnlarge(board_id), 3000);
  $('.enlarge-player-status').each(function() {
    $(this)[0].textContent = "LIVE";
    $(this).removeClass('label-default').addClass('label-success');
  });
});
