  function warningClick(cb) {
    if (cb.checked && map.hasLayer(cities)) {
      map.removeLayer(cities);
      map.removeLayer(marker);
      // map.addLayer(warnings);
      map.setView([48.3794, 31.1656], 3);
    } else {
      // map.removeLayer(warnings);
      map.addLayer(cities);
    }
  }

let SELECTED_VALUE = null
let WARNING_SHOWN = false
function load_warning_click(geo_data) {
    const warning_click_div = document.getElementById('warning_click_div')
    warning_click_div.classList = `form-check form-switch mt-3`

    const label_elem = document.createElement('label')
    label_elem.textContent = 'Show Markers'
    
    const input_elem = document.createElement('input')
    input_elem.className='form-check-input'
    input_elem.type='checkbox'
    input_elem.role='switch'
    input_elem.addEventListener('click', (e) => {
        WARNING_SHOWN = !WARNING_SHOWN
        load_map(geo_data)
    })
    

    warning_click_div.appendChild(input_elem)
    warning_click_div.appendChild(label_elem)

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
      SELECTED_VALUE = e.target.value
      state_changer_function()
    })
    return select
}

function load_form_for_map(geo_data) {
    const choose_the_country = document.getElementById('choose-the-country')
    const list_of_countries = geo_data.map(d => d.full_name)
    const select = create_select_element(list_of_countries, () => {
        load_map(geo_data)
    })
    choose_the_country.appendChild(select)
}


function render_map(){ 
    if(this.map) {
        this.map.remove();
    }
    const map_container = document.getElementById('map_container').innerHTML = `<div id="map"> </div>`
    const map = L.map("map").setView([48.3794, 31.1656], 3);


    L.tileLayer(
      "https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=3XFP3zCyXbN269GRH4Rg",
    //"https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}@2x.png?key=RqPVefXUdjgIrKWZw5Nh",
    /*{
        attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }*/
    {
      attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
    ).addTo(map);
    return map
}



function load_map(json_data) {
    const map = render_map()

    const center_data = json_data.find(d => d.full_name == SELECTED_VALUE)
    lat1 = center_data.coords.lat
    long1 = center_data.coords.long
    cities= center_data.cities
    len=cities.length;

    if (WARNING_SHOWN == true) {
      var countryIcon = L.icon({
        iconUrl: 'location.png',
        
        iconSize:     [50, 50],
         
    },{
      attribution:
      '<div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>',
    });

    var cityIcon = L.icon({
      iconUrl: 'city.png',
  
      iconSize:     [30, 30], 
  },{
    attribution:
    '<div>Icons made by <a href="" title="turkkub">turkkub</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>',
  });

      
  location1 = center_data.full_name+"&nbsp;&nbsp;("+center_data.code_name+")";
  spend1= center_data.total_spend_eur;
  CO2_1=center_data.total_co2_emission;

  function create_pop_html(location, spend, co2) {
    function calculate_maximum_for_location(location) {
      try {
        max_eur = cities.filter(d => d.total_spend_eur != 'UNSET')
          .sort((a, b) => b.total_spend_eur - a.total_spend_eur)[0].total_spend_eur
        
      } catch (error) {
        max_eur = 0
      }
      try {
        max_co2 = cities.filter(d => d.total_co2_emission != 'UNSET')
            .sort((a, b) => b.total_co2_emission - a.total_co2_emission)[0].total_co2_emission
      } catch (error) {
        max_co2 = 0
      } 

      largest = [max_co2, max_eur].sort((a,b) => b - a)[0]
      scale = 100 / largest
      return scale
    }

    function decide_box_width(value) {
      if (value == "UNSET") {
        value = 0
      }
      width = value * calculate_maximum_for_location(location)
      if (width >= 100) {
        width = 100
      }
      return width
      // return '100'
    }
    pop_html = `
      <b>Location:</b>
      <br>
      ${location}
      <br>
      <b>Spend:</b>
      <br>
      <div style="display: block; width: ${decide_box_width(spend)}px; height: 10px; background: #9aeae2">${spend}&nbsp;&nbsp;(EUR)</div>
      <b>CO2 Emission:</b><br>
      <div style="display: block; width: ${decide_box_width(co2)}px; height: 10px; background: #f79292">${co2}&nbsp;&nbsp;(KG)</div>
    `
    return pop_html
  }

      var marker = L.marker([lat1, long1],{icon: countryIcon}).addTo(map)
      .bindPopup(create_pop_html(location1, spend1, CO2_1));
      //.openPopup();

      for(var i=0;i<len;i++){
        location2 = cities[i].full_name+"&nbsp;&nbsp;("+cities[i].code_name+")";
        spend2= cities[i].total_spend_eur;
  CO2_2=cities[i].total_co2_emission;
        var citymarker = L.marker([cities[i].coords.lat, cities[i].coords.long],{icon: cityIcon}).addTo(map)
                          .bindPopup(create_pop_html(location2, spend2, CO2_2));
      }
    }
    

    if (WARNING_SHOWN == true) {
      


      for(var i=0;i<len;i++){
        
        CO2_2=cities[i].total_co2_emission;

        if(CO2_2 != "UNSET"){
          var circle = L.circle([cities[i].coords.lat, cities[i].coords.long], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: CO2_2/100
        }).addTo(map);
        }
        }

    }

    map.setView([lat1, long1],5);
    
}

// Get the file
fetch("../json_data/geo_data/geo_data.json")
  .then(response => response.json())
  .then(json => {
        load_form_for_map(json)
        SELECTED_VALUE = json[0].full_name
        load_map(json)
        load_warning_click(json)
  });
