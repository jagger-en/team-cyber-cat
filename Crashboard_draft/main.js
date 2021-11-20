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

      
  location1 = center_data.full_name+"("+center_data.code_name+")";

      var marker = L.marker([lat1, long1],{icon: countryIcon}).addTo(map)
      .bindPopup(location1);
      //.openPopup();

      

      for(var i=0;i<len;i++){
        location2 = cities[i].full_name+"("+cities[i].code_name+")";
        var citymarker = L.marker([cities[i].coords.lat, cities[i].coords.long],{icon: cityIcon}).addTo(map)
      .bindPopup(location2);
      }

    }

    map.setView([lat1, long1],8);
    
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
