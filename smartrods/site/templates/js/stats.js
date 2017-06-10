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
    {label: "Progression", value: 50},
    {label: "Progression", value: 25},
    {label: "Progression", value: 5},
    {label: "Progression", value: 10},
    {label: "Progression", value: 10}
  ],
  resize: true,
  redraw: true
});
}

function accuracyDonut() {
  window.accuracyDonut = Morris.Donut({
  element: 'accuracy-donut',
  data: [
    {label: "Accuracy", value: 50},
    {label: "Accuracy", value: 25},
    {label: "Accuracy", value: 5},
    {label: "Accuracy", value: 10},
    {label: "Accuracy", value: 10}
  ],
  resize: true,
  redraw: true
});
}

function fluencyDonut() {
  window.fluencyDonut = Morris.Donut({
  element: 'fluency-donut',
  data: [
    {label: "Download Sales", value: 50},
    {label: "In-Store Sales", value: 25},
    {label: "Mail-Order Sales", value: 5},
    {label: "Uploaded Sales", value: 10},
    {label: "Video Sales", value: 10}
  ],
  resize: true,
  redraw: true
});
}
function systematicityDonut() {
  window.systematicityDonut = Morris.Donut({
  element: 'systematicity-donut',
  data: [
    {label: "Download Sales", value: 50},
    {label: "In-Store Sales", value: 25},
    {label: "Mail-Order Sales", value: 5},
    {label: "Uploaded Sales", value: 10},
    {label: "Video Sales", value: 10}
  ],
  resize: true,
  redraw: true
});
}
