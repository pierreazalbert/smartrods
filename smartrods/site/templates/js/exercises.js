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

});
