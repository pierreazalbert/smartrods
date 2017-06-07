var clockTimer;

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

  $('.classroom-player-time').each( function () {
    $(this)[0].textContent = "00:00:00";
  });

  clockTimer = setInterval(updateClock, 1000);


});

$(document).on('click', '.classroom-player-pause', function () {
  console.log('clicked on pause');
  $('.classroom-player-pause').each( function () {
    $(this).removeClass('glyphicon-pause').addClass('glyphicon-play');
    $(this).removeClass('classroom-player-pause').addClass('classroom-player-play');
  });
  clearInterval(clockTimer);
});

$(document).on('click', '.classroom-player-play', function () {
  console.log('clicked on play');
  $('.classroom-player-play').each( function () {
    $(this).removeClass('glyphicon-play').addClass('glyphicon-pause');
    $(this).removeClass('classroom-player-play').addClass('classroom-player-pause');
  });
  clockTimer = setInterval(updateClock, 1000);
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
  clearInterval(clockTimer);
});

function updateClock () {

  timeString = $('.classroom-player-time')[0].textContent;

  currentTime = new Date("1/1/1900 " + timeString);
  currentTime.setSeconds(currentTime.getSeconds() + 1);
  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  var currentSeconds = currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;

  // Update the time display
  $('.classroom-player-time').each( function () {
    $(this)[0].textContent = currentTimeString;
  });
}

function updatePlayer () {
  $.ajax({
           type: "GET",
           url: "/api/classrooms/{{current_user.classroom_id}}",
           data: '',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {/*console.log(result);*/},
           error: function (error) { console.log(error); }
  })
    .done(function(data) {

      $('.classroom-player-activity').each( function () {

      })

    });
}
