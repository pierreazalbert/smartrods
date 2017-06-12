$(document).on('click', '.classroom-player-start', function () {
  window.location = "{{ url_for('site.exercises') }}";
});

$(document).on('click', '.classroom-player-pause', function () {
  pauseActivity(activity_id);
});

$(document).on('click', '.classroom-player-play', function () {
  resumeActivity(activity_id);
});

$(document).on('click', '.classroom-player-stop', function () {
  endActivity(activity_id);
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

function updatePlayer() {
  $.ajax({
           type: "GET",
           url: "/api/classrooms/{{current_user.classroom_id}}/activities",
           data: '',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) { /*console.log(result);*/ },
           error: function (error) { console.log(error); }
  })
    .done(function(data) {

      $('.classroom-player-activity').each( function () {
          $(this)[0].textContent = data['activity_name'];
          activity_id = data['activity_id'];
          activity_type = data['activity_type'];
          activity_started = data['started'];
          activity_elapsed = data['elapsed'];
          solution_max_size = data['solution_max_size'];
      });
      if (parseInt(data['activity_type'], 10) > 0) {
        if(data['paused'] == true) {
          restartActivity(activity_elapsed);
        }
        else {
          startActivity();
        }
        // add popover to specify solution max size and activity started
      }

    });
}

function startActivity() {

  console.log('started activity');

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
}

function restartActivity(activity_elapsed) {

  console.log('restarted activity');

  $('.classroom-player-start').each( function () {
    $(this).removeClass('glyphicon-start').addClass('glyphicon-play');
    $(this).removeClass('classroom-player-start').addClass('classroom-player-play');
  });
  $('.classroom-player-time').each( function () {
    $(this)[0].textContent = String(activity_elapsed);
  });
  $('.classroom-player-time').each( function () {
    $(this).removeClass('hidden');
  });
  $('.classroom-player-stop').each( function () {
    $(this).removeClass('hidden');
  });

}

function pauseActivity(activity_id) {
  $.ajax({
           type: "PUT",
           url: "/api/classrooms/{{current_user.classroom_id}}/activities",
           data: '{"action":"pause", "activity_id":' + activity_id + ', "elapsed":"' + String($('.classroom-player-time')[0].textContent) + '"}',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {
             console.log(result);
           },
           error: function (error) {
             console.log(error);
           }
  });
  console.log('paused activity');
  $('.classroom-player-pause').each( function () {
    $(this).removeClass('glyphicon-pause').addClass('glyphicon-play');
    $(this).removeClass('classroom-player-pause').addClass('classroom-player-play');
  });

  clearInterval(clockTimer);
}

function resumeActivity(activity_id) {
  $.ajax({
           type: "PUT",
           url: "/api/classrooms/{{current_user.classroom_id}}/activities",
           data: '{"action":"resume", "activity_id":' + activity_id + '}',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {
             console.log(result);
           },
           error: function (error) {
             console.log(error);
           }
  });
  console.log('resumed activity');
  $('.classroom-player-play').each( function () {
    $(this).removeClass('glyphicon-play').addClass('glyphicon-pause');
    $(this).removeClass('classroom-player-play').addClass('classroom-player-pause');
  });
  clockTimer = setInterval(updateClock, 1000);
}

function endActivity(activity_id) {
  $.ajax({
           type: "PUT",
           url: "/api/classrooms/{{current_user.classroom_id}}/activities",
           data: '{"action":"stop", "activity_id":' + activity_id + ', "elapsed":"' + String($('.classroom-player-time')[0].textContent) + '"}',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {
             console.log(result);
           },
           error: function (error) {
             console.log(error);
           }
  });

  $.ajax({
           type: "POST",
           url: "/api/classrooms/{{current_user.classroom_id}}/activities",
           data: '{"action":"start", "activity_type":0}',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {
             console.log(result);
           },
           error: function (error) {
             console.log(error);
           }
  });

  console.log('stopped activity');

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
  updatePlayer();
}
