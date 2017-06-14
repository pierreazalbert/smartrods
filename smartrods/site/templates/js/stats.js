function updateStats() {
  if (activity_type != 0) {
    var progression = [
      {label: "Progression", value: 0, category: "Very High"},
      {label: "Progression", value: 0, category: "High"},
      {label: "Progression", value: 0, category: "Medium"},
      {label: "Progression", value: 0, category: "Low"}
    ];
    var accuracy = [
      {label: "Accuracy", value: 0, category: "Very High"},
      {label: "Accuracy", value: 0, category: "High"},
      {label: "Accuracy", value: 0, category: "Medium"},
      {label: "Accuracy", value: 0, category: "Low"}
    ];
    var fluency = [
      {label: "Fluency", value: 0, category: "Very High"},
      {label: "Fluency", value: 0, category: "High"},
      {label: "Fluency", value: 0, category: "Medium"},
      {label: "Fluency", value: 0, category: "Low"}
    ];
    var systematicity = [
      {label: "Systematicity", value: 0, category: "Very High"},
      {label: "Systematicity", value: 0, category: "High"},
      {label: "Systematicity", value: 0, category: "Medium"},
      {label: "Systematicity", value: 0, category: "Low"}
    ];
    var data = tempClassroom;
    var classroomSize = tempClassroom.length;
    for (i in data) {

      // Parse new stats for user
      var newstats = JSON.parse((data[i].events.slice(-1)[0].statistics).replace(/'/g, '"'));
      //console.log(newstats);
      // In case user is open in info modal, update stats
      var modal = $('#infoModal');
      //console.log(modal);
      var id = '#board_' + String(data[i].id) + '_info';
      // console.log(modal.find('canvas'), id);
      // console.log(modal.find('canvas').is(id));
      // console.log(newstats.progression);
      if (modal.find('canvas').is(id) == true) {
        // console.log('updating stats for board', data[i].id);
        modal.find('#stats-progression').text(newstats.progression + ' %');
        modal.find('#stats-accuracy').text(newstats.accuracy + ' %');
        modal.find('#stats-fluency').text(newstats.fluency + ' sec');
        modal.find('#stats-systematicity').text(newstats.systematicity);

        // Update activity log using buffered data (after clearing table)
        var table = modal.find('tbody');
        table.empty();
        for (j in data[i].events) {
          var event = data[i].events[j];
          var newrow = $('<tr>').append($('<td>').text(event.timestamp.slice(5,-4)),
                                        $('<td>').text(event.actions),
                                        $('<td>').text(event.outcomes));
          table.append(newrow);
        }
      }

      // Update progression donut (range from 0 to 100% progression)
      if (newstats.progression > 75) {
        progression[0].value += 1/classroomSize*100;
      }
      else if (newstats.progression > 50) {
        progression[1].value += 1/classroomSize*100;
      }
      else if (newstats.progression > 25) {
        progression[2].value += 1/classroomSize*100;
      }
      else {
        progression[3].value += 1/classroomSize*100;
      }
      // Update accuracy donut (range from 0 to 100% accuracy)
      if (newstats.accuracy > 75) {
        accuracy[0].value += 1/classroomSize*100;
      }
      else if (newstats.accuracy > 50) {
        accuracy[1].value += 1/classroomSize*100;
      }
      else if (newstats.accuracy > 25) {
        accuracy[2].value += 1/classroomSize*100;
      }
      else {
        accuracy[3].value += 1/classroomSize*100;
      }
      // Update fluency donut (range from 0 to 20s between each successful action)
      if (newstats.fluency > 15) {
        fluency[0].value += 1/classroomSize*100;
      }
      else if (newstats.fluency > 10) {
        fluency[1].value += 1/classroomSize*100;
      }
      else if (newstats.fluency > 5) {
        fluency[2].value += 1/classroomSize*100;
      }
      else {
        fluency[3].value += 1/classroomSize*100;
      }
      // Update systematicity donut
      if (newstats.systematicity == 'very high') {
        systematicity[0].value += 1/classroomSize*100;
      }
      else if (newstats.systematicity == 'high') {
        systematicity[1].value += 1/classroomSize*100;
      }
      else if (newstats.systematicity == "medium") {
        systematicity[2].value += 1/classroomSize*100;
      }
      else if (newstats.systematicity == "none") {
        systematicity[3].value += 1/classroomSize*100;
      }
    }
    window.progressionDonut.setData(progression);
    window.accuracyDonut.setData(accuracy);
    window.fluencyDonut.setData(fluency);
    window.systematicityDonut.setData(systematicity);
  }
}

// function lineChart() {
//   window.lineChart = Morris.Line({
//     element: 'line-chart',
//     data: [
//       { y: '2006', a: 100, b: 90 },
//       { y: '2007', a: 75,  b: 65 },
//       { y: '2008', a: 50,  b: 40 },
//       { y: '2009', a: 75,  b: 65 },
//       { y: '2010', a: 50,  b: 40 },
//       { y: '2011', a: 75,  b: 65 },
//       { y: '2012', a: 100, b: 90 }
//     ],
//     xkey: 'y',
//     ykeys: ['a', 'b'],
//     labels: ['Series A', 'Series B'],
//     lineColors: ['#1e88e5','#ff3321'],
//     lineWidth: '3px',
//     resize: true,
//     redraw: true
//   });
// }

function progressionDonut() {
  window.progressionDonut = Morris.Donut({
  element: 'progression-donut',
  data: [
    {label: "Progression", value: 0, category: "Very High"},
    {label: "Progression", value: 0, category: "High"},
    {label: "Progression", value: 0, category: "Medium"},
    {label: "Progression", value: 100, category: "Low"}
  ],
  colors: [
    '#7ED321',
    '#F7E500',
    '#F6A623',
    '#D0011B'
  ],
  resize: true,
  redraw: true,
  formatter: function (x, data) {return data.category + ': ' + data.value + '%'}
});
}

function accuracyDonut() {
  window.accuracyDonut = Morris.Donut({
  element: 'accuracy-donut',
  data: [
    {label: "Accuracy", value: 0, category: "Very High"},
    {label: "Accuracy", value: 0, category: "High"},
    {label: "Accuracy", value: 0, category: "Medium"},
    {label: "Accuracy", value: 100, category: "Low"}
  ],
  colors: [
    '#7ED321',
    '#F7E500',
    '#F6A623',
    '#D0011B'
  ],
  resize: true,
  redraw: true,
  formatter: function (x, data) {return data.category + ': ' + data.value + '%'}
});
}

function fluencyDonut() {
  window.fluencyDonut = Morris.Donut({
  element: 'fluency-donut',
  data: [
    {label: "Fluency", value: 0, category: "Very High"},
    {label: "Fluency", value: 0, category: "High"},
    {label: "Fluency", value: 0, category: "Medium"},
    {label: "Fluency", value: 100, category: "Low"}
  ],
  colors: [
    '#7ED321',
    '#F7E500',
    '#F6A623',
    '#D0011B'
  ],
  resize: true,
  redraw: true,
  formatter: function (x, data) {return data.category + ': ' + data.value + '%'}
});
}
function systematicityDonut() {
  window.systematicityDonut = Morris.Donut({
  element: 'systematicity-donut',
  data: [
    {label: "Systematicity", value: 0, category: "Very High"},
    {label: "Systematicity", value: 0, category: "High"},
    {label: "Systematicity", value: 0, category: "Medium"},
    {label: "Systematicity", value: 100, category: "Low"}
  ],
  colors: [
    '#7ED321',
    '#F7E500',
    '#F6A623',
    '#D0011B'
  ],
  resize: true,
  redraw: true,
  formatter: function (x, data) {return data.category + ': ' + data.value + '%'}
});
}
