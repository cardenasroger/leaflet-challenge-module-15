// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&updatedafter=2019-12-01&maxlongitude=-66.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

function color(mag){
  if (mag > 5){
      return 'red'
  }
  else if (mag >= 4){
      return '#FF8C00'
  }
  else if (mag >= 3){
      return '#FFA500'
  }
  else if (mag >= 2){
      return '#FFD700'
  }
  else if (mag >= 1){
      return '#9ACD32'
  }
  else{
      return '#ADFF2F'
  }
}

function size(mag){
  if (mag > 5){
      return 14
  }
  else if (mag >= 4){
      return 12
  }
  else if (mag >= 3){
      return 10
  }
  else if (mag >= 2){
      return 8
  }
  else if (mag >= 1){
      return 6
  }
  else {
      return 4
  }
}
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + "<h3>Magnitude: "+ feature.properties.mag+"</h3>" + "</p>");
  }

  // var addMarkers = (markers, myMap) => {
  //   markers.forEach(marker => {
  //     L.circle(marker, {
  //       fillOpacity: 0.75,
  //       color: "white",
  //       fillColor: "purple",
  
  
  //     }).bindPopup("<h1>" + marker.name + "</h1> <hr> ").addTo(myMap);
  //   })
  



  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: size(feature.properties.mag),
        color: color(feature.properties.mag),
        fillColor: color(feature.properties.mag),
        weight: 1.0,
        opacity: 1.0
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}