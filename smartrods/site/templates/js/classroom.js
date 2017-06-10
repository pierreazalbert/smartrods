var enlargeButton = $('<button>').attr('class', 'btn enlarge-btn').attr('data-toggle', 'modal').attr('data-target', '#enlargeModal').text('Enlarge');
var infoButton = $('<button>').attr('class', 'btn info-btn').attr('style', 'top:50%').attr('data-toggle', 'modal').attr('data-target', '#infoModal').text('More info');
var overlayDiv = $('<div>').attr('class', 'overlay').append(enlargeButton, infoButton);

var canvasDiv = $('<canvas>').attr('width', '200').attr('height', '200');
var nameDiv = $('<span>').attr('class', 'board-username').attr('style', 'text-align:left');
var boardDiv = $('<div>').attr('class', 'col-xs-12 col-sm-4 col-md-3 col-lg-2 tile').attr('onclick', '""').append(canvasDiv, nameDiv, overlayDiv);

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

      // Update player status

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

          // Check if board exists in previous data received
          var last = tempClassroom.filter(function (board) {
            return (board.id === data[i].id);
          });

          if (last === null) {
            createBoard(data[i]);
          }
          else if (data[i].rods != last[0].rods) {
            updateBoard(data[i]);
          }
          else {
            console.log('no boards to update');
          }
      }
      };

      tempClassroom = data;
      respondCanvas();

    });
    // .always(function() {
    //   setTimeout(updateClassroom, 5000);
    // });
}

// function pollBoard(board_id) {
//   $.ajax({
//            type: "GET",
//            url: String("/api/boards/" +  board_id),
//            data: '',
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            //username: 'smartrods',
//            //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
//            success: function (result) { /*console.log(result);*/ },
//            error: function (error) { console.log(error); }
//   })
//     .done(function(data) {
//
//       //console.log(data.activity.slice(-1)[0])
//
//       // The first time we poll we create the board drawing
//       if (boardTemp === null) {
//         console.log('rendering board ' + data.id);
//         $('canvas').attr('id', String('board_' + data.id));
//         $('#enlarge-user').text(data.user);
//         drawBoard($('canvas')[0], data.id, data.activity.slice(-1)[0].rods);
//       }
//       // Otherwise, check if something has changed
//       else {
//
//         if (boardTemp.activity.slice(-1)[0].rods != data.activity.slice(-1)[0].rods) {
//           console.log('updating board ' + data.id);
//           drawBoard($('canvas')[0], data.id, data.activity.slice(-1)[0].rods);
//         }
//         else {
//           console.log('no boards to update');
//         }
//
//       }
//
//       boardTemp = data;
//       //respondCanvas();
//
//     })
//     .always(function() {
//       pollBoardTimer = setTimeout(function() { pollBoard(board_id); }, 5000);
//     });
// }

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
