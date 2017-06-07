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

function updateClock () {

  timeString = $('#classroom-player-time')[0].text;

  currentTime = new Date(timeString);
  currentTime.setSeconds(currentTime.getSeconds() + 1);

  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  var currentSeconds = currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Compose the string for display
  var currentTimeString = currentHours + "h " + currentMinutes + "min " + currentSeconds + "sec";

  // Update the time display
  $('#classroom-player-time').each( function () {
    $(this).text = currentTimeString;
  });
}
