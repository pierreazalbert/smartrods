
function updateClassroom() {
  $.ajax({
           type: "GET",
           url: "/api/classrooms/{{current_user.classroom_id}}",
           data: '',
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {
             $('.classroom-player-status').each( function () {
               $(this)[0].textContent = "LIVE";
               $(this).removeClass('label-danger').removeClass('label-info').addClass('label-success');
             });
             $('.classroom-player-start').each( function () {
               $(this).removeClass('disabled');
             });
             $('.classroom-player-pause').each( function () {
               $(this).removeClass('disabled');
             });
             $('.classroom-player-play').each( function () {
               $(this).removeClass('disabled');
             });
             $('.classroom-player-stop').each( function () {
               $(this).removeClass('disabled');
             });
           },
           error: function (error) {
             $('.classroom-player-status').each( function () {
               $(this)[0].textContent = "OFFLINE";
               $(this).removeClass('label-success').addClass('label-danger');
             });
             $('.classroom-player-start').each( function () {
               $(this).addClass('disabled');
             });
             $('.classroom-player-pause').each( function () {
               $(this).addClass('disabled');
             });
             $('.classroom-player-play').each( function () {
               $(this).addClass('disabled');
             });
             $('.classroom-player-stop').each( function () {
               $(this).addClass('disabled');
             });

             console.log(error);
           }
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
          console.log(data[i].events);
          // Check if board exists in previous data received
          var last = tempClassroom.filter(function (board) {
            return (board.id === data[i].id);
          });
          if (last === null) {
            createBoard(data[i]);
          }
          else if (data[i].events.slice(-1)[0].rods != last[0].events.slice(-1)[0].rods) {
            updateBoard(data[i]);
          }
          else {
            console.log('no boards to update');
          }
        }
      };

      tempClassroom = data;
      respondCanvas();
      updateStats();
    });
}

// Toggle button between all boards and all stats
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
