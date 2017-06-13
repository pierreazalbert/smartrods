function getActivityTypeID(name, target_number, solution_max_size) {

  var activity_type_id;

  $.ajax({
           type: "GET",
           url: "/api/activity_types?activity_name=" + String(name) + "&target_number=" + String(target_number) + "&solution_max_size=" + String(solution_max_size),
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           async: false,
           //username: 'smartrods',
           //password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
           success: function (result) {
             activity_type_id = result["activity_type_id"];
           },
           error: function (error) {
             console.log(error);
           }
  });

  return activity_type_id;

}

function startNumberbonds() {

  var targetnb = parseInt($('.btn-circle.active').text(), 10);
  console.log(targetnb);
  var solmaxsize = parseInt($('#spinner').val(), 10);
  console.log(solmaxsize);
  var activity_type_id = getActivityTypeID('NumberBonds', targetnb, solmaxsize);
  console.log(activity_type_id);

  $.ajax({
           type: "POST",
           url: "/api/classrooms/{{current_user.classroom_id}}/activities",
           data: '{"action":"start", "activity_type":' + activity_type_id + '}',
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
  window.location = "{{ url_for('site.classroom') }}";
}

// Toggle button between all boards and all stats
$(document).on('click', '.toggle-button:not(.active)', function () {

    if ($(this).hasClass('toggle-library')){

      $('.toggle-history').each( function () {
        $(this).removeClass('active');
      });
      $('.toggle-library').each( function () {
        $(this).addClass('active');
      });
    }
    else {
      $('.toggle-library').each( function () {
        $(this).removeClass('active');
      });
      $('.toggle-history').each( function () {
        $(this).addClass('active');
      });
    }

});

// function loadActivityHistory() {
//
//   // Update activity log using buffered data (after clearing table)
//   var table = modal.find('tbody');
//   table.empty();
//   for (i in data[0].events) {
//     var event = data[0].events[i];
//     var newrow = $('<tr>').append($('<td>').text(event.timestamp.slice(5,-4)),
//                                   $('<td>').text(event.actions),
//                                   $('<td>').text(event.outcomes));
//     table.append(newrow);
//   }
// }
