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


function create_table(json, table_div_id) {
  const col_list = ['DocumentId', 'ProductName', 'OriginalCurrency',
    'SpendEUR', 'Quantity', 'UOM', 'VendorName', 'VendorCity',
    'VendorCountry', 'unit_price']
  const row_list = json

  
  const table_div = document.getElementById(table_div_id)
  const table = document.createElement('table')
  table.classList = 'table table-striped table-sm table-responsive' // TODO: verify
  
  const thead = document.createElement('thead')
  const thead_tr = document.createElement('tr')
  col_list.forEach(d => {
    const th = document.createElement('th')
    th.textContent = d
    thead_tr.appendChild(th)
  })
  thead.appendChild(thead_tr)
  
  
  
  const tbody = document.createElement('tbody')
  row_list.forEach(d => {
    const tr = document.createElement('tr')
    col_list.forEach(col => {
      const td = document.createElement('td')
      td.textContent = d[col]
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })



  
  table.appendChild(thead)
  table.appendChild(tbody)
  table_div.appendChild(table)
}


function load_graphs(json) {
  feather.replace({ 'aria-hidden': 'true' })

  create_table(json, 'manufacturer-list-of-results')

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


// Get the file
fetch("../json_data/spend_data/spend_data.json")
  .then(response => response.json())
  .then(json => {
      load_graphs(json)
  });
