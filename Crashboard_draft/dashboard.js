function create_chart(elem_id, list_of_labels, list_of_data) {
  const ctx = document.getElementById(elem_id)
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: list_of_labels,
      datasets: [{
        data: list_of_data,
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
  return myChart
}


function load_graphs() {
  feather.replace({ 'aria-hidden': 'true' })
  const LIST_OF_LABELS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  
  const LIST_OF_DATA = [
    15339,
    21345,
    18483,
    24003,
    23489,
    24092,
    12034 
  ]
  create_chart('myChart', LIST_OF_LABELS, LIST_OF_DATA)
}







load_graphs()