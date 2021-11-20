function create_chart(elem_id, list_of_labels, datasets) {
  const ctx = document.getElementById(elem_id)
  const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          datasets: datasets,
          labels: list_of_labels
      },
      options: {}
  });
 
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

MAIN_FORM_STATE = {
  'city': 'WIEN'
}

function filter_data(json) {
  filtered = json.filter(d => d['VendorCity'] == MAIN_FORM_STATE['city'])
  return filtered
}

function create_select_element(text_list, state_changer_function) {
  const select = document.createElement('select')
  select.classList = `form-select form-select-sm`
  text_list.forEach(d => {
    const option = document.createElement('option')
    option.textContent = d
    option.value = d
    select.appendChild(option)
  })
  select.addEventListener('change', (e) => {
    selected_value = e.target.value
    state_changer_function(selected_value)
  })
  return select
}


function load_search_form(json, city_data, country_data) {
  input_id = 'manufacture-search-form'
  const seach_form = document.getElementById(input_id)


  // City
  const list_of_cities = city_data.map(d => d.name)
  const city_select = create_select_element(list_of_cities, (selected_value) => {
    MAIN_FORM_STATE.city = selected_value
    load_graphs(json, city_data, country_data)
  })

  const city_col_4 = document.createElement('div')
  city_col_4.className = 'col-4'
  city_col_4.appendChild(city_select)


  seach_form.appendChild(city_col_4)
}


function update_results_counter(length) {
  const counter = document.getElementById('results-counter')
  counter.textContent = length
}

function load_graphs(json, city_data, country_data) {
  const table_results = document.getElementById('manufacturer-list-of-results')
  table_results.className = `table-scroll-vertical`
  table_results.innerHTML = `` // TODO, also do the same for diagrams!

  json = filter_data(json)

  update_results_counter(json.length)
  // json = json.slice(0, 4) // TEMPORARY!!!


  feather.replace({ 'aria-hidden': 'true' })

  create_table(json, 'manufacturer-list-of-results')

  city_data = city_data.sort((a,b) => a.TotalSpendEUR - b.TotalSpendEUR)
  city_data_graph_data_set = [
    {
      type: 'line',
      label: 'Line Dataset',
      data: city_data.map(d => d.TotalSpendEUR),
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#007bff',
      borderWidth: 1,
      pointBackgroundColor: '#000'
    },
    {
      type: 'bar',
      label: 'Bar Dataset',
      data: city_data.map(d => d.TotalCo2Emission),
      lineTension: 0,
      backgroundColor: '#d04e4e',
      borderColor: '#d04e4e',
      borderWidth: 2,
      pointBackgroundColor: '#d04e4e'
    }
  ]
  create_chart('dataChart1', city_data.map(d => d.name), city_data_graph_data_set)
}


// Get the file
fetch("../json_data/spend_data/spend_data_not_empty.json")
  .then(response => response.json())
  .then(json => {
    fetch("../json_data/country_data/country_data.json")
      .then(response => response.json())
      .then(country_data => {
          fetch("../json_data/city_data/city_data.json")
          .then(response => response.json())
          .then(city_data => {
              load_search_form(json, city_data, country_data)
              load_graphs(json, city_data, country_data)
          });
      });
  });
