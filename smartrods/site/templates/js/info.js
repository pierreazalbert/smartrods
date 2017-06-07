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

  // Draw canvas using buffered data
  canvas.attr('id', String('board_' + data[0].id + '_info'));
  drawBoard(canvas[0], id, data[0].rods);
  // Fill in modal header fields including board drawing
  modal.find('#info-user').text(data[0].user);
  modal.find('#info-id').text(data[0].id);
  modal.find('#info-connected').text((data[0].is_connected? "Yes":"No"));

  // $.ajax({
  //          type: "GET",
  //          url: String("/api/boards/"+id),
  //          data: '',
  //          contentType: "application/json; charset=utf-8",
  //          dataType: "json",
  //          username: 'smartrods',
  //          password: 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1',
  //          success: function (result) {/*console.log(result);*/},
  //          error: function (error) { console.log(error); }
  // }).done(function(data) {
  //
  //   // Render table for activity log
  //   // ... make function to compare rods objects and extract changes
  //
  //   // Fill in data for statistics tab
  //   // ... make function to calculate stats based on current exercise
  //
  // });

});
