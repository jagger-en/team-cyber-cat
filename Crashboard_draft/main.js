// The map
var map = L.map("map").setView([48.3794, 31.1656], 3);
// Single layer/marker
var ATmarker;
var marker;
// Layers/Markers groups
var cities = new L.layerGroup();
var warnings = new L.layerGroup();

L.tileLayer(
  "https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}@2x.png?key=RqPVefXUdjgIrKWZw5Nh",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
).addTo(map);
/*window.onload = function selectedCountry(){
    var input = document.getElementById('country');
    console.log(input);*/
input = "Germany";

function load_map(json) {
  const coordinates = json;
  var len = coordinates.length;

  for (var i = 0; i < len; i++) {
    ATmarker = L.marker([coordinates[i].coords.lat, coordinates[i].coords.long])
      .bindPopup(
        coordinates[i].full_name + "(" + coordinates[i].code_name + ")"
      )
      .openPopup();
    cities.addLayer(ATmarker);
    /*map.setView([coordinates[i].coords.lat,coordinates[i].coords.long],8);*/
  }
  cities.addTo(map);

  var popup = L.popup();
  /*function selectedCountry(e){
            map.setView([e.latlng.lat,e.latlng.lng],12);
        }*/
  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);
  }
  map.on("click", onMapClick);
}

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

if (input == "ALL") {
  map.addLayer(cities);
} else {
  function load_map(json) {
    const coordinates = json;
    var len = coordinates.length;

    for (var i = 0; i < len; i++) {
      if (coordinates[i].full_name == input) {
        var coorIndex = i;
      }
    }

    marker = L.marker([
      coordinates[coorIndex].coords.lat,
      coordinates[coorIndex].coords.long,
    ])
      .bindPopup(
        coordinates[coorIndex].full_name +
          "(" +
          coordinates[coorIndex].code_name +
          ")"
      )
      .openPopup();
    map.addLayer(marker);
    map.setView(
      [coordinates[coorIndex].coords.lat, coordinates[coorIndex].coords.long],
      8
    );
  }
}

// Get the file
fetch("../json_data/geo_data/geo_data.json")
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
    load_map(json);
  });
