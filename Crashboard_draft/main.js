function load_map(json) {
    var map = L.map("map").setView([47.5162, 14.5501], 5);
    L.tileLayer(
    "https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}@2x.png?key=RqPVefXUdjgIrKWZw5Nh",
    {
        attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
    ).addTo(map);

    //require('coordinates.json');

    //var coordinates=JSON.parse(data);

    const coordinates= JSON.parse(json);

    var len= coordinates.length;

    for(var i = 0; i<len;i++){
        var ATmarker = L.marker([coordinates[i].lat, coordinates[i].lon]).addTo(map).bindPopup(coordinates[i].full_name+"("+coordinates[i].code_name+")").openPopup();
    }

    var popup = L.popup();
    function onMapClick(e) {
        popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }
    map.on('click', onMapClick);
}



// Get the file
fetch("../json_data/geo_data/geo_data.json")
  .then(response => response.json())
  .then(json => {
      console.log(json)
      load_map(json)
  });