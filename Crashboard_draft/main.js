
/*window.onload = function selectedCountry(){
    var input = document.getElementById('country');
    console.log(input);*/
input = "China"


if(input=="ALL"){

    function load_map(json) {
        var map = L.map("map").setView([48.3794, 31.1656], 3);
        L.tileLayer(
        "https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}@2x.png?key=RqPVefXUdjgIrKWZw5Nh",
        {
            attribution:
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        }
        ).addTo(map);
    
      
    
        const coordinates= json;
    
        var len= coordinates.length;
    
        for(var i = 0; i<len;i++){
            var ATmarker = L.marker([coordinates[i].coords.lat, coordinates[i].coords.long])
            .addTo(map)
            .bindPopup(coordinates[i].full_name+"("+coordinates[i].code_name+")")
            .openPopup();
            /*map.setView([coordinates[i].coords.lat,coordinates[i].coords.long],8);*/
        }
    
    
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
        map.on('click', onMapClick);
    }
    
    
    
    // Get the file
    fetch("../json_data/geo_data/geo_data.json")
      .then(response => response.json())
      .then(json => {
          console.log(json)
          load_map(json)
      });

}

else{
    function load_map(json) {
        var map = L.map("map").setView([48.3794, 31.1656], 3);
        L.tileLayer(
        "https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}@2x.png?key=RqPVefXUdjgIrKWZw5Nh",
        {
            attribution:
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        }
        ).addTo(map);
    
      
    
        const coordinates= json;
    
        var len= coordinates.length;
    
        for(var i = 0; i<len;i++){
            if(coordinates[i].full_name==input){
                var coorIndex=i;
            }
        }

       
        var marker = L.marker([coordinates[coorIndex].coords.lat, coordinates[coorIndex].coords.long])
        .addTo(map)
        .bindPopup(coordinates[coorIndex].full_name+"("+coordinates[coorIndex].code_name+")")
        .openPopup();
        map.setView([coordinates[coorIndex].coords.lat,coordinates[coorIndex].coords.long],8);
        
    
    
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
        map.on('click', onMapClick);
    }
    
    
    
    // Get the file
    fetch("../json_data/geo_data/geo_data.json")
      .then(response => response.json())
      .then(json => {
          console.log(json)
          load_map(json)
      });
}
//}


















  