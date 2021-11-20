function load_map() {
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

    const coordinates= JSON.parse('[{"full_name": "Austria","code_name": "AT","lat":47.5162,"lon":14.5501},{"full_name": "Netherlands","code_name": "NL", "lat": 52.1326, "lon": 5.2913},{"full_name": "Ukraine","code_name": "UA","lat": 48.3794,"lon":31.1656},{"full_name": "Finland", "code_name": "FI", "lat": 61.9241, "lon": 25.7482},{"full_name": "Germany","code_name": "DE","lat": 51.1657,"lon": 10.4515},{"full_name": "Italy","code_name": "IT","lat": 41.8719,"lon": 12.5674}]');

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