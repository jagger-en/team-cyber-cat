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
  'country': 'AT',
  'city': 'UNSET'
}

function filter_data(json) {
  filtered = json.filter(d => d['VendorCountry'] == MAIN_FORM_STATE['country'])
  if (MAIN_FORM_STATE['city'] != "UNSET") {
    filtered = json.filter(d => d['VendorCity'] == MAIN_FORM_STATE['city'])
  }
  return filtered
}

function create_select_element(text_list, state_changer_function) {
  const select = document.createElement('select')
  select.classList = `form-select form-select-sm`
  text_list.forEach(d => {
    const option = document.createElement('option')
    option.textContent = (d.full_name !== null) ? d.full_name : d.code_name
    option.value = d.code_name
    select.appendChild(option)
  })
  select.addEventListener('change', (e) => {
    selected_value = e.target.value
    state_changer_function(selected_value)
  })
  return select
}

function load_city_form(json, city_data, geo_data, chosen_code_name) {
  // City
  const filtered_country_cities = geo_data.filter(d => d.code_name == chosen_code_name)[0].cities
  const list_of_cities = filtered_country_cities.map(d => { return {'full_name': d.full_name, 'code_name': d.code_name}})
  const city_select = create_select_element(list_of_cities, (selected_value) => {
    MAIN_FORM_STATE.city = selected_value
    render(json, city_data, geo_data)
  })

  const city_col_4 = document.createElement('div')
  city_col_4.className = 'col-4'
  city_col_4.appendChild(city_select)
  return city_col_4
}


function load_search_form(json, city_data, geo_data) {
  input_id = 'manufacture-search-form'
  const seach_form = document.getElementById(input_id)
  const sub_form = document.createElement('div')

  // country
  const list_of_countries = geo_data.map(d => { return {'full_name': d.full_name, 'code_name': d.code_name}})
  const country_select = create_select_element(list_of_countries, (selected_value) => {
    MAIN_FORM_STATE.country = selected_value
    render(json, city_data, geo_data)
    sub_form.innerHTML = ``
    sub_form.appendChild(load_city_form(json, city_data, geo_data, selected_value))
  })

  const country_col_4 = document.createElement('div')
  country_col_4.className = 'col-4'
  country_col_4.appendChild(country_select)

  seach_form.appendChild(country_col_4)
  seach_form.appendChild(sub_form)
}


function update_results_counter(length) {
  const counter = document.getElementById('results-counter')
  counter.textContent = length
}

function render(json, city_data, geo_data) {
  json = filter_data(json)
  load_graphs(json, city_data, geo_data)
}

function load_graphs(json, city_data, geo_data) {
  const table_results = document.getElementById('manufacturer-list-of-results')
  table_results.className = `table-scroll-vertical`
  table_results.innerHTML = `` // TODO, also do the same for diagrams!

  update_results_counter(json.length)
  // json = json.slice(0, 4) // TEMPORARY!!!


  feather.replace({ 'aria-hidden': 'true' })

  create_table(json, 'manufacturer-list-of-results')

  city_data = city_data.sort((a,b) => a.TotalCo2Emission - b.TotalCo2Emission)
  city_data_graph_data_set = [
    {
      type: 'bar',
      label: 'TotalSpendEUR',
      data: city_data.map(d => d.TotalSpendEUR),
      lineTension: 0,
      backgroundColor: '#007bff',
      borderColor: '#007bff',
      borderWidth: 1
    },
    {
      type: 'bar',
      label: 'TotalCo2Emission',
      data: city_data.map(d => d.TotalCo2Emission),
      lineTension: 0,
      backgroundColor: '#d04e4e',
      borderColor: '#d04e4e',
      borderWidth: 1
    }
  ]
  create_chart('dataChart1', city_data.map(d => d.name), city_data_graph_data_set)
}


// Get the file
fetch("../json_data/spend_data/spend_data.json")
  .then(response => response.json())
  .then(json => {
    fetch("../json_data/city_data/city_data.json")
      .then(response => response.json())
      .then(city_data => {
          fetch("../json_data/geo_data/geo_data.json")
          .then(response => response.json())
          .then(geo_data => {
              load_search_form(json, city_data, geo_data)
              render(json, city_data, geo_data)
          });
      });
  });
