

/**
 * 

Filter:
    - VendorCity
        - VendorCountry
Aggregates:
    - TotalSpendEUR
        - Quantity
        - UOM
        - unit_price
    - TotalCo2Emission
 */
FIELDS_LIST = ['VendorCity', 'VendorCountry', 'CategoryL2']
BIG_FILTER_LEFT = {
    'VendorCity': 'UNSET',
    'VendorCountry': 'UNSET',
    'CategoryL2': 'UNSET'
}
BIG_FILTER_RIGHT = {
    'VendorCity': 'UNSET',
    'VendorCountry': 'UNSET',
    'CategoryL2': 'UNSET'
}
AGGREG_POSSIBLE_FIELDS = ['VendorCity', 'VendorCountry', 'CategoryL2']


function filter_input(input_json, chosen_big_filter) {

    FIELDS_LIST.forEach(field => {
        if (chosen_big_filter[field] != 'UNSET') {
            input_json = input_json.filter(d => d[field] == chosen_big_filter[field])
        }
    })

    return input_json
}


function calc_aggreg(c_item_data, agg) {
    unique_values = Array.from(new Set(c_item_data.map(d => d[agg])))
    mapped = unique_values.map(uniq => {
        filtered = c_item_data.filter(d => d[agg] === uniq)
        return {
            agg: uniq,
            total_SpendEUR: filtered.reduce((acc, d) => acc + parseInt(d.SpendEUR), 0),
            total_co2_emission: filtered.reduce((acc, d) => acc + parseInt(d.co2_emission), 0)
        }
    })
    return mapped
}




function create_table_div(batch_item) {
    const col_list = [
        {
            'code': 'agg',
            'readable': 'Aggregate'
        },
        {
            'code': 'total_SpendEUR',
            'readable': 'Total Spending in EUR'
        },
        {
            'code': 'total_co2_emission',
            'readable': 'Total CO2 Emission'
        },
    ] // SHould be same as in calc_aggreg()

    const row_list = batch_item.mapped

    const table_div = document.createElement('div')
    table_div.className = `table-scroll-vertical`

    const h5 = document.createElement('h5')
    h5.textContent = batch_item.agg_name
    table_div.appendChild(h5)


    const table = document.createElement('table')
    table.classList = 'table table-striped table-sm table-responsive' // TODO: verify
    
    const thead = document.createElement('thead')
    const thead_tr = document.createElement('tr')
    col_list.forEach(d => {
      const th = document.createElement('th')
      th.textContent = d.readable
      thead_tr.appendChild(th)
    })
    thead.appendChild(thead_tr)
    
    
    
    const tbody = document.createElement('tbody')
    row_list.forEach(d => {
      const tr = document.createElement('tr')
      col_list.forEach(col => {
        const td = document.createElement('td')
        td.textContent = d[col.code]
        td.width = '500px' // Temporary, better solution needed?
        tr.appendChild(td)
      })
      tbody.appendChild(tr)
    })
  
  
  
    
    table.appendChild(thead)
    table.appendChild(tbody)
    table_div.appendChild(table)
    return table_div
}

function load_agg_diagrams(mapped_list, agg_container_id) {
    const agg_diagrams_container = document.getElementById(agg_container_id)
    agg_diagrams_container.innerHTML = ``

    mapped_list.forEach(batch_item => {
        agg_diagrams_container.appendChild(create_table_div(batch_item))
    })
    // city_data = city_data.sort((a,b) => a.TotalCo2Emission - b.TotalCo2Emission)
    // city_data_graph_data_set = [
    //   {
    //     type: 'bar',
    //     label: 'TotalSpendEUR',
    //     data: city_data.map(d => d.TotalSpendEUR),
    //     lineTension: 0,
    //     backgroundColor: '#007bff',
    //     borderColor: '#007bff',
    //     borderWidth: 1
    //   },
    //   {
    //     type: 'bar',
    //     label: 'TotalCo2Emission',
    //     data: city_data.map(d => d.TotalCo2Emission),
    //     lineTension: 0,
    //     backgroundColor: '#d04e4e',
    //     borderColor: '#d04e4e',
    //     borderWidth: 1
    //   }
    // ]
    // create_chart('dataChart1', city_data.map(d => d.name), city_data_graph_data_set)
}


function display_stuff(comparison_items) {
    comparison_items.forEach(c_item => {
        mapped_list = AGGREG_POSSIBLE_FIELDS.map(agg => {
            mapped = calc_aggreg(c_item.data, agg)
            return {'mapped': mapped, 'agg_name': agg}
        })
        load_agg_diagrams(mapped_list, c_item.agg_container_id)
    })
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

function load_forms(spend_data, list_of_lists) {
    const form_container_ids = ['form_container_left', 'form_container_right']
    form_container_ids.forEach(form_container_id => {
        const form_container = document.getElementById(form_container_id)
        list_of_lists.forEach(list_of_list => {
            const select = create_select_element(list_of_list.uniq_vals, (e) => {
                if (form_container_id == 'form_container_left') {
                    BIG_FILTER_LEFT[list_of_list.field] = e
                    render(spend_data)
                }

                if (form_container_id == 'form_container_right') {
                    BIG_FILTER_RIGHT[list_of_list.field] = e
                    render(spend_data)
                }
            })
            form_container.appendChild(select)
        })
    })
}

function render(INPUT_DATA) {
    filtered_left = filter_input(INPUT_DATA, BIG_FILTER_LEFT)
    filtered_right = filter_input(INPUT_DATA, BIG_FILTER_RIGHT)
    display_stuff([
        {'data': filtered_left, 'agg_container_id': 'agg_container_left'},
        {'data': filtered_right, 'agg_container_id': 'agg_container_right'}
    ])
}

console.log('==============HELLO=============')

fetch("../json_data/spend_data/spend_data_not_empty.json")
    .then(response => response.json())
    .then(spend_data => {
        const list_of_lists = FIELDS_LIST.map(field => {
            const uniq_vals = Array.from(new Set(spend_data.map(d => d[field])))
            return {
                'field': field,
                'uniq_vals': uniq_vals
            }
        })
        load_forms(spend_data, list_of_lists)
        render(spend_data)
    });





